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
const request_1 = require("request-promise-native");
const tough_cookie_1 = require("tough-cookie");
const Constants = require("./constants");
const supportedCapabilities = require("../samples/supported-capabilities.json");
const devices = require("../samples/devices.json");
const builds = require("../samples/builds.json");
const errors_1 = require("../errors");
const decorators_1 = require("../decorators");
const debug_1 = require("debug");
const userAgentFactory_1 = require("../GenerateAgent/useragentGenerator");
class State {
    constructor() {
        this.constants = Constants;
        this.supportedCapabilities = supportedCapabilities;
        this.language = 'id_ID';
        this.timezoneOffset = String(new Date().getTimezoneOffset() * -60);
        this.radioType = 'wifi-none';
        this.capabilitiesHeader = '3brTvwE=';
        this.connectionTypeHeader = 'WIFI';
        this.isLayoutRTL = false;
        this.euDCEnabled = undefined;
        this.adsOptOut = false;
        this.thumbnailCacheBustingValue = 1000;
        this.cookieStore = new tough_cookie_1.MemoryCookieStore();
        this.cookieJar = request_1.jar(this.cookieStore);
        this.clientSessionIdLifetime = 1200000;
        this.pigeonSessionIdLifetime = 1200000;
        this.checkpoint = null;
        this.challenges = null;
        this.csrftoken = null;
        this.cookiesForLogin = null;
        this.webUserAgent = null;
        this.cookieCsrf = [];
        this.cookiesMidValue = [];
        this.cookiesIgdidVal = [];
    }
    get signatureKey() {
        return this.constants.SIGNATURE_KEY;
    }
    get signatureVersion() {
        return this.constants.SIGNATURE_VERSION;
    }
    get appVersionCode() {
        return this.constants.APP_VERSION_CODE;
    }
    get appVersion() {
        return this.constants.APP_VERSION;
    }
    get appUserAgent() {
        return `Instagram ${this.appVersion} Android (${this.deviceString}; ${this.language}; ${this.appVersionCode})`;
    }
    get generateBrowserAgent() {
        const ua = new userAgentFactory_1.userAgentFactory();
        const agent = ua.userAgentFactory_();
        this.uaweb = agent;
        return this.uaweb;
    }
    get challengeUrl() {
        if (this.challenge) {
            return `/api/v1${this.challenges.challenge.api_path}`;
        }
        if (this.checkpoint) {
            return `${this.checkpoint.checkpoint_url}`;
        }
    }
    set cookieCsrfToken(value) {
        this.cookieCsrf.push(value);
    }
    get cookieCsrfToken() {
        try {
            return this.extractCookieValue('csrftoken');
        }
        catch (_a) {
            return this.cookieCsrf[0];
            //State.stateDebug('csrftoken lookup failed, returning "missing".');
            //return 'missing';
        }
    }
    get cookieUserId() {
        return this.extractCookieValue('ds_user_id');
    }
    get cookieUsername() {
        return this.extractCookieValue('ds_user');
    }
    set cookieMid(value) {
        this.cookiesMidValue.push(value);
    }
    get cookieMid() {
        try {
            return this.extractCookieValue('mid');
        }
        catch (_a) {
            return this.cookiesMidValue[0];
        }
    }
    set cookieIgdid(value) {
        this.cookiesIgdidVal.push(value);
    }
    get cookieIgdid() {
        try {
            return this.extractCookieValue('ig_did');
        }
        catch (_a) {
            return this.cookiesIgdidVal[0];
        }
    }
    isExperimentEnabled(experiment) {
        return this.experiments.includes(experiment);
    }
    removeCookie() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Bluebird.fromCallback(cb => this.cookieStore.removeAllCookies(cb));
        });
    }
    cloneState(jar) {
        return __awaiter(this, void 0, void 0, function* () {
            this.newStore = new tough_cookie_1.MemoryCookieStore();
            this.cookieJar['_jar'] = yield Bluebird.fromCallback(cb => jar.cloneSync(this.newStore, cb));
        });
    }
    extractCookie(key) {
        const cookies = this.cookieJar.getCookies(this.constants.HOST);
        return _.find(cookies, { key }) || null;
    }
    get fbAnalyticsApplicationId() {
        return this.constants.FACEBOOK_ANALYTICS_APPLICATION_ID;
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
                constants: this.constants,
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
//# sourceMappingURL=state.js.map