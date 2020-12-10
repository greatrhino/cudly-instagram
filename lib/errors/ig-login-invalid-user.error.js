"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const ig_response_error_1 = require("./ig-response.error");
class IgLoginInvalidUserError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.text = 'Salah password bos!';
        this.message = this.constructor.name;
    }
}
exports.IgLoginInvalidUserError = IgLoginInvalidUserError;
//# sourceMappingURL=ig-login-invalid-user.error.js.map