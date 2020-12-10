export var __esModule: boolean;
export class DirectThreadEntity extends entity_1.Entity {
    constructor(...args: any[]);
    threadId: any;
    userIds: any;
    deleteItem(itemId: any): Promise<any>;
    broadcastText(text: any): Promise<any>;
    broadcastReel(options: any): Promise<any>;
    broadcastUserStory(options: any): Promise<any>;
    broadcastProfile(id: any): Promise<any>;
    broadcastLink(link_text: any, link_urls: any): Promise<any>;
    broadcastPhoto(options: any): Promise<any>;
    broadcastVideo(options: any): Promise<any>;
    broadcastVoice(options: any): Promise<any>;
    broadcastStory(input: any): Promise<any>;
    updateTitle(title: any): Promise<any>;
    mute(): Promise<any>;
    unmute(): Promise<any>;
    hide(): Promise<any>;
    leave(): Promise<any>;
    addUser(userIds: any): Promise<any>;
    markItemSeen(threadItemId: any): Promise<any>;
    broadcast(options: any): Promise<any>;
}
import entity_1 = require("../core/entity");
