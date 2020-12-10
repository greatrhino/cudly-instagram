export var __esModule: boolean;
export class IgApiClient {
    state: state_1.State;
    request: request_1.Request;
    account: account_1.account;
    status: status_repository_1.StatusRepository;
    entity: entity_factory_1.EntityFactory;
    destroy(): void;
}
import state_1 = require("./state");
import request_1 = require("./request");
import account_1 = require("../repositories/account");
import status_repository_1 = require("../repositories/status.repository");
import entity_factory_1 = require("./entity.factory");
