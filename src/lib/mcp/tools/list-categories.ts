import { defineTool } from "@lovable.dev/mcp-js";
import { queryExternal } from "../supabase";

export default defineTool({
  name: "list_categories",
  title: "List categories",
  description: "List all plant/product categories with Thai and English names.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async () => {
    const rows = await queryExternal(
      `categories?select=key,emoji,color,name,sort_order&order=sort_order.asc`,
    );
    return {
      content: [{ type: "text", text: JSON.stringify(rows) }],
      structuredContent: { categories: rows },
    };
  },
});
