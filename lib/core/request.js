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
const Agent = require('../GenerateAgent/useragentGenerator');
const aggent = new Agent.userAgentFactory();
class Request {
    constructor(client) {
        this.client = client;
        this.end$ = new rxjs_1.Subject();
        this.error$ = new rxjs_1.Subject();
        this.attemptOptions = {
            maxAttempts: 1,
        };
        this.defaults = {};
    }
    getString(start, end, all) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(`${start}(.*?)${end}`);
            const str = all;
            const result = regex.exec(str);
            return result;
        });
    }
    _getSharedData(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const _sharedData = yield this.getString('<script type="text/javascript">window._sharedData =', '};</script>', response);
            if (_sharedData) {
                const resultJsonStringData = `${_sharedData[1]}}`;
                const resultJson = JSON.parse(resultJsonStringData);
                const result = resultJson.entry_data.LoginAndSignupPage;
                if (typeof result === 'object') {
                    const err = new errors_1.IgLoginRequiredError("IgLoginRequiredError");
                    process.nextTick(() => this.error$.next(err));
                    throw err;
                }
            }
        });
    }
    sendGet(userOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: baseUrl,
                uri: '',
                resolveWithFullResponse: true,
                proxy: false,
                simple: false,
                transform: Request.requestTransform,
                jar: this.client.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.getDefaultHeadersLogin(),
                method: 'GET',
            }, this.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequest(options);
            if (typeof response.body === 'object' && response.statusCode === 200) {
                return response;
            } 
            const error = this.handleResponse(response);
            process.nextTick(() => this.error$.next(error));
            throw error;
          
        });
    }
    send(userOptions, action = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: baseUrl,
                uri: '',
                resolveWithFullResponse: true,
                proxy: false,
                simple: false,
                transform: Request.requestTransform,
                jar: this.client.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.getDefaultHeaders(),
                method: 'GET',
            }, this.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequest(options);
            if (action === true) {
                if (typeof response.body === 'object' && response.body !== undefined && response.body !== null) {
                    return response.body.graphql;
                } else if (response.body === null || response.body === 'undefined'){
                    const error = new errors_1.IgMediaNotFound("IgMediaNotFound");
                    process.nextTick(() => this.error$.next(error));
                    throw error;
                }
                const error = this.handleResponse(response);
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
            this.updateState(response);
            process.nextTick(() => this.end$.next());
            const body = response.body;
            if (body && body !== undefined && response.statusCode === 200 && action === false) {
                return response;
            }
            const error = this.handleResponse(response);
            process.nextTick(() => this.error$.next(error));
            throw error;
        });
    }
    getCooks(userOptions, action = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: baseUrl,
                uri: '',
                simple: false,
                resolveWithFullResponse: true,
                jar: this.client.state.cookieJar,
                json: true,
                strictSSL: false,
                gzip: true
            }, this.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequest(options);
            //this.updateState(response);
            process.nextTick(() => this.end$.next());
            return true;
        });
    }
    getSession(headers) {
        const { 'set-cookie': FindCookies } = headers;
        if (typeof FindCookies !== null && typeof FindCookies !== undefined) {
            const sessionid = FindCookies.find((x) => { return x.includes('sessionid'); }) ? FindCookies.find((x) => { return x.includes('sessionid'); }).split(';')[0] : '';
            const _sessionid = sessionid.split("=")[1];
            if (_sessionid === '""' || typeof _sessionid !== string) {
                const error = new errors_1.IgLoginRequiredError("IgLoginRequiredError");
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
            return _sessionid;
        }
    }
    getCookies(cookie) {
        try {
            const ig_did = cookie.find((x) => { return x.includes('ig_did'); }) ? cookie.find((x) => { return x.includes('ig_did'); }).split(';')[0] : '';
            const csrftoken = this.client.state.csrftoken;
            const mid = cookie.find((x) => { return x.includes('mid'); }) ? cookie.find((x) => { return x.includes('mid'); }).split(';')[0] : '';
            const cookie_ = `ig_cb=1; ${ig_did}; ig_nrcb=1; csrftoken=${csrftoken}; ${mid};`;
            this.client.state.ig_did = ig_did.split("=")[1];
            this.client.state.mid = mid.split("=")[1];
            return cookie_;
        }
        catch (e) {
            return e;
        }
    }
    sendBypass(userOptions, onlyCheckHttpStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: 'https://i.instagram.com/',
                uri: '',
                resolveWithFullResponse: true,
                proxy: this.client.state.proxyUrl,
                simple: false,
                transform: Request.requestTransform,
                jar: this.client.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.getDefaultHeadersWeb(),
                method: 'GET',
            }, this.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
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
    sendLogin(userOptions, action = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: baseUrl,
                uri: '',
                resolveWithFullResponse: true,
                proxy: false,
                simple: false,
                transform: Request.requestTransform,
                jar: this.client.state.cookieJar,
                strictSSL: false,
                gzip: true,
                headers: this.getDefaultHeadersLogin(),
                method: 'GET',
            }, this.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequest(options);
            this.updateState(response);
            process.nextTick(() => this.end$.next());
            if (response.body.status === 'ok' && response.body.authenticated && response.statusCode === 200) {
                return response;
            }
            else if (response.body.status === 'ok' && response.body.user === false && response.statusCode === 200) {
                const error = new errors_1.IgLoginInvalidUserError("IgLoginInvalidUserError");
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
            else if (response.body.status === 'ok' && response.body.user && response.body.authenticated === false) {
                const error = new errors_1.IgLoginBadPasswordError("IgLoginBadPasswordError");
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
            else if (typeof response.body.message === 'string') {
                const error = this.handleResponse(response);
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
            else {
                const error = new errors_1.IgNotFoundError(response);
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
        });
    }
    handleResponse(response) {
        Request.requestDebug(`Request ${response.request.method} ${response.request.uri.path} failed: ${typeof response.body === 'object' ? JSON.stringify(response.body) : response.body}`);
        const joson = response.body;
        if (joson.spam) {
            return new errors_1.IgActionSpamError(response);
        }
        if (response.statusCode === 404) {
            return new errors_1.IgNotFoundError(response);
        }
        if (response.statusCode === 500) {
            return new errors_1.IgNotFoundError(response);
        }
        //const joson = response.body;
        if (typeof joson.message === 'string') {
            if (joson.message === 'checkpoint_required') {
                this.client.state.checkpoint = joson;
                return new errors_1.IgCheckpointError(response);
            }
            if (joson.message === 'challenge_required') {
                this.client.state.challenge = joson;
                return new errors_1.IgChallengeError(response);
            }
            if (joson.message === 'feedback_required') {
                return new errors_1.IgActionSpamError(response);
            }
        }
        if(typeof joson === 'string'){
            if(joson === 'Oops, an error occurred.\n'){
                return new errors_1.IgMediaNotFound("IgMediaNotFound");
            }
            if(joson === 'Sorry, this photo has been deleted'){
                return new errors_1.IgMediaNotFound("IgMediaNotFound");
            }
        }
       
        return new errors_1.IgResponseError(response);
    }
    handleResponseError(response) {
        Request.requestDebug(`Request ${response.request.method} ${response.request.uri.path} failed: ${typeof response.body === 'object' ? JSON.stringify(response.body) : response.body}`);
        const json = response.body;
        if (json.spam) {
            return new errors_1.IgActionSpamError(response);
        }
        if (response.statusCode === 404) {
            return new errors_1.IgNotFoundError(response);
        }
        if (typeof json.message === 'string') {
            if (json.message === 'challenge_required') {
                this.client.state.checkpoint = json;
                return new errors_1.IgCheckpointError(response);
            }
            if (json.message === 'user_has_logged_out') {
                return new errors_1.IgUserHasLoggedOutError(response);
            }
            if (json.message === 'login_required') {
                return new errors_1.IgLoginRequiredError(response);
            }
            if (json.message.toLowerCase() === 'not authorized to view user') {
                return new errors_1.IgPrivateUserError(response);
            }
        }
        if (json.error_type === 'sentry_block') {
            return new errors_1.IgSentryBlockError(response);
        }
        if (json.error_type === 'inactive user') {
            return new errors_1.IgInactiveUserError(response);
        }
        return new errors_1.IgResponseError(response);
    }
    signature(data) {
        return crypto_1.createHmac('sha256', this.client.state.signatureKey)
            .update(data)
            .digest('hex');
    }
    sign(payload) {
        const json = typeof payload === 'object' ? JSON.stringify(payload) : payload;
        const signature = this.signature(json);
        return {
            ig_sig_key_version: this.client.state.signatureVersion,
            signed_body: `${signature}.${json}`,
        };
    }
    updateState(response) {
        const { 'x-ig-set-www-claim': wwwClaim, 'ig-set-authorization': auth, 'ig-set-password-encryption-key-id': pwKeyId, 'ig-set-password-encryption-pub-key': pwPubKey, 'X-CSRFToken': CSRFToken, 'set-cookie': Set_Cookies } = response.headers;
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
        if (typeof CSRFToken === 'string') {
            this.client.state.cookieCsrfToken = CSRFToken;
        }
        if (typeof Cookie !== null && typeof Cookie !== undefined) {
            this.client.state.Set_Cookies = this.getCookies(Set_Cookies);
        }
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
    static requestTransformLogin(body, response, resolveWithFullResponse) {
        try {
            response.body = JSONbigString.parse(body);
        }
        catch (e) {
            if (lodash_1.inRange(response.statusCode, 200, 299)) {
                throw e;
            }
        }
        return resolveWithFullResponse ? response : response;
    }
    faultTolerantRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield attempt_1.retry(() => __awaiter(this, void 0, void 0, function* () { return request(options); }), this.attemptOptions);
            }
            catch (err) {
                throw new errors_1.IgNetworkError(err);
            }
        });
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
    getDefaultHeadersLogin() {
        var _a;
        return {
            'User-Agent': this.client.state.generateBrowserAgent,
            'Accept-Language': 'id-ID',
            'X-Instagram-AJAX': 1,
            'X-CSRFToken': this.client.state.cookieCsrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'X-IG-App-ID': '936619743392459',
            'X-IG-WWW-Claim': this.client.state.igWWWClaim | '0',
            Referer: baseUrl
        };
    }
    getDefaultHeaders() {
        var _a;
        return {
            'User-Agent': {},
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'X-Instagram-AJAX': 1,
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'X-CSRFToken': this.client.state.cookieCsrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'X-IG-App-ID': '936619743392459',
            'X-IG-WWW-Claim': this.client.state.igWWWClaim || '0',
            Referer: baseUrl
        };
    }
    getDefaultHeadersWeb() {
        var _a;
        //const cookies = this.client.state.deserialize();
        return {
            'User-Agent': this.client.state.appUserAgent,
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
            'X-IG-EU-DC-ENABLED': typeof this.client.state.euDCEnabled === 'undefined' ? void 0 : this.client.state.euDCEnabled.toString(),
            'X-IG-Extended-CDN-Thumbnail-Cache-Busting-Value': this.client.state.thumbnailCacheBustingValue.toString(),
            'X-Bloks-Version-Id': this.client.state.bloksVersionId,
            'X-MID': (_a = this.client.state.extractCookie('mid')) === null || _a === void 0 ? void 0 : _a.value,
            'X-IG-WWW-Claim': this.client.state.igWWWClaim || '0',
            'X-Bloks-Is-Layout-RTL': this.client.state.isLayoutRTL.toString(),
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
exports.Request = Request;
Request.requestDebug = debug_1.default('ig:request');
//# sourceMappingURL=request.js.map