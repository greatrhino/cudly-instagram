"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const ig_response_error_1 = require("./ig-response.error");
class IgAccountNotFound extends Error {
    constructor(message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.text = 'Link/username tidak ditemukan!';
        this.message = this.constructor.name;
    }
}
exports.IgAccountNotFound = IgAccountNotFound;