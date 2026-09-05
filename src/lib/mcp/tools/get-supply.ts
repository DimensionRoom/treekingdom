import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { queryExternal } from "../supabase";

export default defineTool({
  name: "get_supply",
  title: "Get supply",
  description: "Get a single supply/product by id.",
  inputSchema: { id: z.string().min(1) },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const [rows, variants] = await Promise.all([
      queryExternal(`supplies?id=eq.${encodeURIComponent(id)}&select=*&limit=1`),
      queryExternal(
        `supply_variants?supply_id=eq.${encodeURIComponent(id)}&select=*&order=sort_order.asc`,
      ).catch(() => []),
    ]);
    const supply = rows?.[0];
    if (!supply) {
      return { content: [{ type: "text", text: `Supply ${id} not found` }], isError: true };
    }
    const withVariants = { ...supply, variants: variants ?? [] };
    return {
      content: [{ type: "text", text: JSON.stringify(withVariants) }],
      structuredContent: { supply: withVariants },
    };
  },
});

