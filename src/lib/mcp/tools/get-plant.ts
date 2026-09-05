import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { queryExternal } from "../supabase";

export default defineTool({
  name: "get_plant",
  title: "Get plant",
  description: "Get a single plant by id, including its varieties.",
  inputSchema: {
    id: z.string().min(1).describe("Plant id."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const idEnc = encodeURIComponent(id);
    const [plants, varieties] = await Promise.all([
      queryExternal(`plants?id=eq.${idEnc}&select=*&limit=1`),
      queryExternal(`plant_varieties?plant_id=eq.${idEnc}&select=*&order=sort_order.asc`),
    ]);
    const plant = plants?.[0];
    if (!plant) {
      return { content: [{ type: "text", text: `Plant ${id} not found` }], isError: true };
    }
    const result = { ...plant, varieties };
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: { plant: result },
    };
  },
});
