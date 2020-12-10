"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const ig_response_error_1 = require("./ig-response.error");
class IgLoginRequiredError extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.text = 'Cookies is dead. Please relogin now!';
        this.message = this.constructor.name;
    }
}
exports.IgLoginRequiredError = IgLoginRequiredError;
//# sourceMappingURL=ig-login-required.error.js.map