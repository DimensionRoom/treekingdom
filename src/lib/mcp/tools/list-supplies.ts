import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { queryExternal } from "../supabase";

export default defineTool({
  name: "list_supplies",
  title: "List supplies",
  description:
    "List store supplies/products. Optionally filter by category, or by is_lucky=true to get only lucky/auspicious plants.",
  inputSchema: {
    category: z.string().optional().describe("Category key to filter by."),
    is_lucky: z.boolean().optional().describe("If true, only return items flagged as lucky."),
    query: z.string().optional().describe("Text query matched against product names."),
    limit: z.number().int().min(1).max(100).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, is_lucky, query, limit }) => {
    const params = new URLSearchParams();
    params.set(
      "select",
      "id,name,category,description,price,compare_at_price,stock,emoji,is_lucky,lucky,plant_id,variety_id,tags,sort_order",
    );
    params.set("order", "sort_order.asc,created_at.asc");
    params.set("limit", String(limit ?? 50));
    if (category) params.set("category", `eq.${category}`);
    if (typeof is_lucky === "boolean") params.set("is_lucky", `eq.${is_lucky}`);
    if (query) {
      const q = query.replace(/[%,]/g, "");
      params.set("or", `(name->>th.ilike.*${q}*,name->>en.ilike.*${q}*)`);
    }
    const rows = await queryExternal(`supplies?${params}`);
    return {
      content: [{ type: "text", text: JSON.stringify(rows) }],
      structuredContent: { supplies: rows },
    };
  },
});
