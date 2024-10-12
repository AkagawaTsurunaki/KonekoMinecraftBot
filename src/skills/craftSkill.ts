import {bot} from "../../index";
import {getLogger} from "../utils/logger";


const logger = getLogger("SleepSkill")


export class CraftSkill {
    public static async craftCraftingTable() {
        // 检查身上是否有木板
        const items = bot.inventory.items().filter(item => item.name.includes("planks"));
        if (items.length === 0) {
            logger.warn(`No more "*_planks" to craft "crafting_table"`)
            return
        }

        // 检查身上的木板是否足够
        let planksCount = 0
        items.forEach(planks => planksCount += planks.count)
        if (planksCount < 4) {
            logger.warn(`Need more "*_planks" to craft "crafting_table", now we have ${planksCount}`)
            return;
        }

        // 获取工作台的制作方法
        const craftingTableId = bot.registry.itemsByName["crafting_table"].id;
        const recipes = bot.recipesFor(craftingTableId, null, 1, false);
        if (recipes.length === 0) {
            logger.warn(`We have not gotten "*_planks" so the recipe is not existed, try to get some.`)
            return;
        }

        // 制作工作台
        await bot.craft(recipes[0], 1, undefined)

        return bot.inventory.findInventoryItem(craftingTableId, null, false);
    }
}