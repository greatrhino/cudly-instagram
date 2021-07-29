"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const feeds_1 = require("../repositories/timeline.feed");
class FeedFactory {
    constructor(client) {
        this.client = client;
    }
 
    timeline(reason) {
        const feed = new feeds_1.TimelineFeed(this.client);
        if (reason) {
            feed.reason = reason;
        }
        return feed;
    }
}
exports.FeedFactory = FeedFactory;
//# sourceMappingURL=feed.factory.js.map