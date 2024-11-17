import {paramMetadata} from "../../common/fieldMetadata";
import {ExtendedBot} from "../../extension/extendedBot";
import {BaseInstruction, BaseInstructionInput} from "../instruction";

class ChatInstructionInput implements BaseInstructionInput {
    @paramMetadata("消息内容")
    public content: string = "";
}

class ChatInstruction extends BaseInstruction {
    private bot: ExtendedBot;

    constructor(bot: ExtendedBot) {
        super("Chat", "向 Minecraft 中所有在线玩家发送消息。", ChatInstructionInput);
        this.bot = bot;
    }

    exe(input: ChatInstructionInput) {
        this.bot.chat(input.content)
    }
}