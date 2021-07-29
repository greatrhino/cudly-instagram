"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const state_1 = require("./state");
const request_1 = require("./request");
const account_1 = require("../repositories/account");
const status_repository_1 = require("../repositories/status.repository");
const entity_factory_1 = require("./entity.factory");
const challenge_repository_1 = require("../repositories/challenge.repository");
const feed_factory_1  = require("./feed.factory");
//const userAgentFactory_1 = require("../GenerateAgent/useragentGenerator");
class IgApiClient {
    constructor() {
        this.state = new state_1.State();
        this.request = new request_1.Request(this);
        this.account = new account_1.account(this);
        this.status = new status_repository_1.StatusRepository(this);
        this.entity = new entity_factory_1.EntityFactory(this);
        this.feed = new feed_factory_1.FeedFactory(this);
        this.challenge = new challenge_repository_1.ChallengeRepository(this);
    }
    destroy() {
        this.request.error$.complete();
        this.request.end$.complete();
    }
}
exports.IgApiClient = IgApiClient;
//# sourceMappingURL=client.js.map