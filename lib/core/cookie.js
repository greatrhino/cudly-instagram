"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const Bluebird = require("bluebird");
const Chance = require("chance");
const request_1 = require("request");
const tough_cookie_1 = require("tough-cookie");
const errors_1 = require("../errors");
const decorators_1 = require("../decorators");
const debug_1 = require("debug");
const userAgentFactory_1 = require("../GenerateAgent/useragentGenerator");
const baseUrl = 'https://www.instagram.com';
class State {
    constructor({ username, password, cookie }, { requestOptions } = {}) {
        this.credentials = {
            username,
            password,
            cookie
        };
        this.timezoneOffset = String(new Date().getTimezoneOffset() * -60);
        this.cookieStore = new tough_cookie_1.MemoryCookieStore();
        this.cookieJar = request_1.jar(this.credentials.cookie);
    }
    get UserAgent() {
        const ua = new userAgentFactory_1.userAgentFactory();
        return ua.userAgentFactory_();
        ;
    }
    get cookieCsrfToken() {
        try {
            return this.extractCookieValue('csrftoken');
        }
        catch (_a) {
            State.stateDebug('csrftoken lookup failed, returning "missing".');
            return 'missing';
        }
    }
    get cookieUserId() {
        return this.extractCookieValue('ds_user_id');
    }
    get cookieUsername() {
        return this.extractCookieValue('ds_user');
    }
    get cookieMid() {
        return this.extractCookieValue('mid');
    }
    get cookieIgdid() {
        return this.extractCookieValue('ig_did');
    }
    get cookieSessionid() {
        return this.extractCookieValue('sessionid');
    }
    get cookieRur() {
        return this.extractCookieValue('rur');
    }
    get urlgen() {
        return this.extractCookieValue('urlgen');
    }
    extractCookie(key) {
        const cookies = this.cookieJar.getCookies(this.constants.HOST);
        return _.find(cookies, { key }) || null;
    }
    extractCookieValue(key) {
        const cookie = this.extractCookie(key);
        if (cookie === null) {
            State.stateDebug(`Could not find ${key}`);
            throw new errors_1.IgCookieNotFoundError(key);
        }
        return cookie.value;
    }
    extractUserId() {
        try {
            return this.cookieUserId;
        }
        catch (e) {
            if (this.challenge === null || !this.challenge.user_id) {
                throw new errors_1.IgUserIdNotFoundError();
            }
            return String(this.challenge.user_id);
        }
    }
    deserializeCookieJar(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            this.cookieJar['_jar'] = yield Bluebird.fromCallback(cb => tough_cookie_1.CookieJar.deserialize(cookies, this.cookieStore, cb));
        });
    }
    serializeCookieJar() {
        return __awaiter(this, void 0, void 0, function* () {
            return Bluebird.fromCallback(cb => this.cookieJar['_jar'].serialize(cb));
        });
    }
    serialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = {
                cookies: JSON.stringify(yield this.serializeCookieJar()),
            };
            for (const [key, value] of Object.entries(this)) {
                obj[key] = value;
            }
            return obj;
        });
    }
    deserialize(state) {
        return __awaiter(this, void 0, void 0, function* () {
            State.stateDebug(`Deserializing state of type ${typeof state}`);
            const obj = typeof state === 'string' ? JSON.parse(state) : state;
            if (typeof obj !== 'object') {
                State.stateDebug(`State deserialization failed, obj is of type ${typeof obj} (object expected)`);
                throw new TypeError('State isn\'t an object or serialized JSON');
            }
            State.stateDebug(`Deserializing ${Object.keys(obj).join(', ')}`);
            if (obj.constants) {
                this.constants = obj.constants;
                delete obj.constants;
            }
            if (obj.cookies) {
                yield this.deserializeCookieJar(obj.cookies);
                delete obj.cookies;
            }
            for (const [key, value] of Object.entries(obj)) {
                this[key] = value;
            }
        });
    }
    generateDevice(seed) {
        const chance = new Chance(seed);
        this.deviceString = chance.pickone(devices);
        const id = chance.string({
            pool: 'abcdef0123456789',
            length: 16,
        });
        this.deviceId = `android-${id}`;
        this.uuid = chance.guid();
        this.phoneId = chance.guid();
        this.adid = chance.guid();
        this.build = chance.pickone(builds);
    }
    generateTemporaryGuid(seed, lifetime) {
        return new Chance(`${seed}${this.deviceId}${Math.round(Date.now() / lifetime)}`).guid();
    }
}
State.stateDebug = debug_1.default('ig:state');
__decorate([
    decorators_1.Enumerable(false),
    __metadata("design:type", Object)
], State.prototype, "constants", void 0);
__decorate([
    decorators_1.Enumerable(false),
    __metadata("design:type", String)
], State.prototype, "proxyUrl", void 0);
__decorate([
    decorators_1.Enumerable(false),
    __metadata("design:type", Object)
], State.prototype, "cookieStore", void 0);
__decorate([
    decorators_1.Enumerable(false),
    __metadata("design:type", Object)
], State.prototype, "cookieJar", void 0);
__decorate([
    decorators_1.Enumerable(false),
    __metadata("design:type", Object)
], State.prototype, "checkpoint", void 0);
__decorate([
    decorators_1.Enumerable(false),
    __metadata("design:type", Object)
], State.prototype, "challenge", void 0);
exports.State = State;
//# sourceMappingURL=cookie.js.map