"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const ig_response_error_1 = require("./ig-response.error");
class IgLoginBadPasswordError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.text = 'Buruk password error (Bad password)!';
        this.message = this.constructor.name;
    }
}
exports.IgLoginBadPasswordError = IgLoginBadPasswordError;
//# sourceMappingURL=ig-login-bad-password.error.js.map