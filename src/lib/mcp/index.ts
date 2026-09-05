import { defineMcp } from "@lovable.dev/mcp-js";
import listPlants from "./tools/list-plants";
import getPlant from "./tools/get-plant";
import listSupplies from "./tools/list-supplies";
import getSupply from "./tools/get-supply";
import listCategories from "./tools/list-categories";

export default defineMcp({
  name: "treekingdom-mcp",
  title: "TreeKingdom MCP",
  version: "0.1.0",
  instructions:
    "Read-only tools for the TreeKingdom bilingual (TH/EN) plant encyclopedia and lucky-plant store. Use list_categories to discover category keys, list_plants / get_plant for encyclopedia data (with care levels and varieties), and list_supplies / get_supply for store products (set is_lucky=true for auspicious plants).",
  tools: [listCategories, listPlants, getPlant, listSupplies, getSupply],
});
