"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ig_response_error_1 = require("./ig-response.error");
class IgChallengeError extends ig_response_error_1.IgResponseError {
    get url() {
        return this.response.body.challenge.url;
    }
    get apiUrl() {
        return this.response.body.challenge.api_path;
    }
}
exports.IgChallengeError = IgChallengeError;
//# sourceMappingURL=ig-challenge.error.js.map