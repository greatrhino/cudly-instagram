export var __esModule: boolean;
export class ChallengeRepository extends repository_1.Repository {
    constructor(client: any);
    state(): Promise<any>;
    selectVerifyMethod(choice: any, isReplay?: boolean): Promise<any>;
    replay(choice: any): Promise<any>;
    deltaLoginReview(choice: any): Promise<any>;
    sendPhoneNumber(phoneNumber: any): Promise<any>;
    auto(reset?: boolean): Promise<any>;
    reset(): Promise<any>;
    sendSecurityCode(code: any): Promise<any>;
    middleware(body: any): void;
}
import repository_1 = require("../core/repository");
