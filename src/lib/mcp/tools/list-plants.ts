import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { queryExternal } from "../supabase";

export default defineTool({
  name: "list_plants",
  title: "List plants",
  description:
    "List plants in the TreeKingdom encyclopedia. Optionally filter by category (e.g. tropical, succulent, flower, herb, tree, cactus, indoor, outdoor) or by a text query matched against Thai/English names.",
  inputSchema: {
    category: z.string().optional().describe("Category key to filter by."),
    query: z.string().optional().describe("Text query matched against plant names."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, query, limit }) => {
    const params = new URLSearchParams();
    params.set("select", "id,name,category,description,emoji,care,levels,tags,sort_order");
    params.set("order", "sort_order.asc,created_at.asc");
    params.set("limit", String(limit ?? 50));
    if (category) params.set("category", `eq.${category}`);
    if (query) {
      const q = query.replace(/[%,]/g, "");
      params.set("or", `(name->>th.ilike.*${q}*,name->>en.ilike.*${q}*)`);
    }
    const rows = await queryExternal(`plants?${params}`);
    return {
      content: [{ type: "text", text: JSON.stringify(rows) }],
      structuredContent: { plants: rows },
    };
  },
});
