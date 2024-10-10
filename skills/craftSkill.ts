import {warn} from "../utils/log";
import {bot} from "../index";

export class CraftSkill {
    public static async craftCraftingTable() {
        // 检查身上是否有木板
        const items = bot.inventory.items().filter(item => item.name.includes("planks"));
        if (items.length === 0) {
            warn("没有 planks 可用于制作 craftingTable")
            return
        }

        // 检查身上的木板是否足够
        let planksCount = 0
        items.forEach(planks => planksCount += planks.count)
        if (planksCount < 4) {
            warn(`没有足够的 planks 可用于制作 craftingTable，当前 ${planksCount}`)
            return;
        }

        // 获取工作台的制作方法
        const craftingTableId = bot.registry.itemsByName["crafting_table"].id;
        const recipes = bot.recipesFor(craftingTableId, null, 1, false);
        if (recipes.length === 0) {
            warn(`没有获取过木板，请先获取木板`)
            return;
        }

        // 制作工作台
        await bot.craft(recipes[0], 1, null)

        return bot.inventory.findInventoryItem(craftingTableId, null, false);
    }
}