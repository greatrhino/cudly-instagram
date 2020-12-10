"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ig_response_error_1 = require("./ig-response.error");
class IgCheckpointError extends ig_response_error_1.IgResponseError {
    get url() {
        return this.response.body.checkpoint_url;
    }
    get apiUrl() {
        //return this.response.body.challenge.api_path;
    }
}
exports.IgCheckpointError = IgCheckpointError;
//# sourceMappingURL=ig-checkpoint.error.js.map