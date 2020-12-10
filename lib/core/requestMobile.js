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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try {
            step(generator.next(value));
        }
        catch (e) {
            reject(e);
        } }
        function rejected(value) { try {
            step(generator["throw"](value));
        }
        catch (e) {
            reject(e);
        } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const crypto_1 = require("crypto");
const rxjs_1 = require("rxjs");
const attempt_1 = require("@lifeomic/attempt");
const request = require("request-promise");
const req_ = require("request-promise");
const errors_1 = require("../errors");
const JSONbigInt = require("json-bigint");
const JSONbigString = JSONbigInt({ storeAsString: true });
const debug_1 = require("debug");
const baseUrl = 'https://www.instagram.com';
const appurl = 'https://i.instagram.com';
const devices = require("../samples/devices.json");
const builds = require("../samples/builds.json");
const supportedCapabilities = require("../samples/supported-capabilities.json");
const Constants = require("./constants");
const Chance = require("chance");
const userAgentFactory_1 = require("../GenerateAgent/useragentGenerator");
class RequestM {
    constructor(client) {
        this.client = client;
        this.constants = Constants;
        this.end$ = new rxjs_1.Subject();
        this.error$ = new rxjs_1.Subject();
        this.attemptOptions = {
            maxAttempts: 1,
        };
        this.language = 'en_US';
        this.agent = new userAgentFactory_1.userAgentFactory();
        this.userAgent = this.agent.userAgentFactory_();
        this.defaults = {};
        this.radioType = 'wifi-none';
        this.capabilitiesHeader = '3brTvwE=';
        this.connectionTypeHeader = 'WIFI';
        this.isLayoutRTL = false;
        this.euDCEnabled = undefined;
        this.adsOptOut = false;
        this.thumbnailCacheBustingValue = 1000;
        this.clientSessionIdLifetime = 1200000;
        this.pigeonSessionIdLifetime = 1200000;
    }
    sendBypass(userOptions, onlyCheckHttpStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: 'https://i.instagram.com/',
                uri: '',
                resolveWithFullResponse: true,
                proxy: this.client.state.proxyUrl,
                simple: false,
                transform: RequestM.requestTransform,
                jar: this.client.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.getDefaultHeadersWeb(),
                method: 'GET',
            }, this.defaults);
            RequestM.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequestWeb(options);
            this.updateState(response);
            process.nextTick(() => this.end$.next());
            if (response.body.status === 'ok' || (onlyCheckHttpStatus && response.statusCode === 200)) {
                return response;
            }
            const error = this.handleResponseError(response);
            process.nextTick(() => this.error$.next(error));
            throw error;
        });
    }
    handleResponseError(response) {
        RequestM.requestDebug(`Request ${response.request.method} ${response.request.uri.path} failed: ${typeof response.body === 'object' ? JSON.stringify(response.body) : response.body}`);
        const json = response.body;
        if (typeof json.message === 'string') {
            if (json.message === 'challenge_required') {
                this.client.state.checkpoint = json;
                return new errors_1.IgCheckpointError(response);
            }
        }
        return new errors_1.IgResponseError(response);
    }
    updateState(response) {
        const { 'x-csrftoken': CSRFtoken, 'x-ig-set-www-claim': wwwClaim, 'ig-set-authorization': auth, 'ig-set-password-encryption-key-id': pwKeyId, 'ig-set-password-encryption-pub-key': pwPubKey, } = response.headers;
        if (typeof wwwClaim === 'string') {
            this.client.state.igWWWClaim = wwwClaim;
        }
        if (typeof auth === 'string' && !auth.endsWith(':')) {
            this.client.state.authorization = auth;
        }
        if (typeof pwKeyId === 'string') {
            this.client.state.passwordEncryptionKeyId = pwKeyId;
        }
        if (typeof pwPubKey === 'string') {
            this.client.state.passwordEncryptionPubKey = pwPubKey;
        }
        if (typeof CSRFtoken === 'string') {
            this.client.state.csrftoken = CSRFtoken;
        }
    }
    signatureKey() {
        return "9193488027538fd3450b83b7d05286d4ca9599a0f7eeed90d8c85925698a05dc";
    }
    signatureVersion() {
        return "4";
    }
    signature(data) {
        return crypto_1.createHmac('sha256', '9193488027538fd3450b83b7d05286d4ca9599a0f7eeed90d8c85925698a05dc')
            .update(data)
            .digest('hex');
    }
    sign(payload) {
        const json = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        const signature = this.signature(json);
        return {
            ig_sig_key_version: this.signatureVersion,
            signed_body: `${signature}.${json}`,
        };
    }
    static requestTransform(body, response, resolveWithFullResponse) {
        try {
            response.body = JSONbigString.parse(body);
        }
        catch (e) {
            if (lodash_1.inRange(response.statusCode, 200, 299)) {
                throw e;
            }
        }
        return resolveWithFullResponse ? response : response.body;
    }
    faultTolerantRequestWeb(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield attempt_1.retry(() => __awaiter(this, void 0, void 0, function* () { return req_(options); }), this.attemptOptions);
            }
            catch (err) {
                throw new errors_1.IgNetworkError(err);
            }
        });
    }
    appUserAgent() {
        return `Instagram 121.0.0.29.119 Android (${this.deviceString}; ${this.language}; 185203708)`;
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
    getDefaultHeadersWeb() {
        var _a;
        //const cookies = this.client.state.deserialize();
        return {
            'User-Agent': this.appUserAgent(),
            'X-Ads-Opt-Out': this.client.state.adsOptOut ? '1' : '0',
            'X-CM-Bandwidth-KBPS': '-1.000',
            'X-CM-Latency': '-1.000',
            'X-IG-App-Locale': this.client.state.language,
            'X-IG-Device-Locale': this.client.state.language,
            'X-Pigeon-Session-Id': this.client.state.pigeonSessionId,
            'X-Pigeon-Rawclienttime': (Date.now() / 1000).toFixed(3),
            'X-IG-Connection-Speed': `${lodash_1.random(1000, 3700)}kbps`,
            'X-IG-Bandwidth-Speed-KBPS': '-1.000',
            'X-IG-Bandwidth-TotalBytes-B': '0',
            'X-IG-Bandwidth-TotalTime-MS': '0',
            'X-Bloks-Version-Id': this.client.state.bloksVersionId,
            'X-MID': (_a = this.client.state.extractCookie('mid')) === null || _a === void 0 ? void 0 : _a.value,
            'X-IG-WWW-Claim': this.client.state.igWWWClaim || '0',
            'X-IG-Connection-Type': this.client.state.connectionTypeHeader,
            'X-IG-Capabilities': this.client.state.capabilitiesHeader,
            'X-IG-App-ID': this.client.state.fbAnalyticsApplicationId,
            'X-IG-Device-ID': this.client.state.uuid,
            'X-IG-Android-ID': this.client.state.deviceId,
            'Accept-Language': this.client.state.language.replace('_', '-'),
            'X-FB-HTTP-Engine': 'Liger',
            Authorization: this.client.state.authorization,
            Host: 'i.instagram.com',
            'Accept-Encoding': 'gzip',
            Connection: 'close',
        };
    }
}
exports.RequestM = RequestM;
RequestM.requestDebug = debug_1.default('ig:requestm');
//# sourceMappingURL=requestMobile.js.map