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
class Request {
    constructor(client, requestOptions) {
        this.client = client;
        this.end$ = new rxjs_1.Subject();
        this.error$ = new rxjs_1.Subject();
        this.attemptOptions = {
            maxAttempts: 1,
        };
        this.defaults = {};
        requestOptions = {};
        requestOptions.baseUrl = baseUrl;
        requestOptions.uri = '';
        requestOptions.proxy = false;
        requestOptions.jar = this.client.state.cookieJar;
        requestOptions.resolveWithFullResponse = true;
        requestOptions.simple = false;
        requestOptions.strictSSL = false;
        requestOptions.gzip = true;
        this.request = request.defaults(requestOptions);
    }
    _getSharedData__(response) {
        return __awaiter(this, void 0, void 0, function* () {
            var scs = Array.from(response.querySelectorAll('script'));
            var sharedDataRawText = scs.filter(sc => sc.textContent.indexOf('_sharedData') > -1)[0];
            if (sharedDataRawText) {
                const sharedDataJSONText = sharedDataRawText.textContent.trim().match(/\=\ (.*);/)[1];
                let sharedData;
                try {
                    sharedData = JSON.parse(sharedDataJSONText);
                }
                catch (e) {
                    throw new Error(e);
                }
                return sharedData;
            }
        });
    }
    _getSharedData_(response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getText = response;
                const _sharedData = this.getString('<script type="text/javascript">window._sharedData =', '};</script>', getText);
                const resultJsonStringData = `${_sharedData[1]}}`;
                const resultJson = JSON.parse(resultJsonStringData);
                return resultJson;
            }
            catch (e) {
                return new Error(e);
            }
        });
    }
    getString(start, end, all) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(`${start}(.*?)${end}`);
            const str = all;
            const result = regex.exec(str);
            return result;
        });
    }
    send(userOptions, action = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                transform: Request.requestTransform,
                headers: this.getDefaultHeaders(),
                method: 'GET',
            }, this.request.defaults);
            Request.requestDebug(`Requesting ${options.method} ${options.url || options.uri || '[could not find url]'}`);
            const response = yield this.faultTolerantRequest(options);
            if (action === true) {
                if (typeof response.body === 'object' && response.body !== undefined && response.body !== null) {
                    return response.body.graphql;
                }
                const error = this.handleResponse(response);
                process.nextTick(() => this.error$.next(error));
                throw error;
            }
            this.updateState(response);
            process.nextTick(() => this.end$.next());
            if (response.body.status === 'ok' && response.statusCode === 200 && action === false) {
                return response;
            }
            const error = this.handleResponse(response);
            process.nextTick(() => this.error$.next(error));
            throw error;
        });
    }
    handleResponse(response) {
        Request.requestDebug(`Request ${response.request.method} ${response.request.uri.path} failed: ${typeof response.body === 'object' ? JSON.stringify(response.body) : response.body}`);
        const joson = response.body;
        //const resp = _getSharedData(json);
        if (joson.spam) {
            return new errors_1.IgActionSpamError(response);
        }
        if (response.statusCode === 404) {
            return new errors_1.IgNotFoundError(response);
        }
        //const joson = response.body;
        if (typeof joson.message === 'string') {
            if (joson.message === 'checkpoint_required') {
                this.client.state.checkpoint = joson;
                return new errors_1.IgCheckpointError(response);
            }
            if (joson.message === 'feedback_required') {
                return new errors_1.IgActionSpamError(response);
            }
        }
        if (this._getSharedData_(joson)) {
            const entry_data = joson.entry_data;
            if (entry_data && typeof entry_data === 'object') {
                const Challenge = entry_data.Challenge;
                if (Challenge && typeof Challenge === 'object') {
                    const challengeType = Challenge[0].challengeType;
                    return new Error(challengeType);
                }
            }
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
    sendBypass(userOptions, onlyCheckHttpStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = lodash_1.defaultsDeep(userOptions, {
                baseUrl: 'https://i.instagram.com',
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
            throw response;
        });
    }
    updateState(response) {
        const { 'x-ig-set-www-claim': wwwClaim, 'ig-set-authorization': auth, 'ig-set-password-encryption-key-id': pwKeyId, 'ig-set-password-encryption-pub-key': pwPubKey, 'X-CSRFToken': CSRFToken } = response.headers;
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
    }
    handleResponseError(response) {
        Request.requestDebug(`Request ${response.request.method} ${response.request.uri.path} failed: ${typeof response.body === 'object' ? JSON.stringify(response.body) : response.body}`);
        return new errors_1.IgResponseError(response);
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
    faultTolerantRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield attempt_1.retry(() => __awaiter(this, void 0, void 0, function* () { return this.request(options); }), this.attemptOptions);
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
    getDefaultHeaders() {
        var _a;
        if (this.client.state.webUserAgent === 'undefined' || this.client.state.webUserAgent === null) {
            this.client.state.webUserAgent = Agent.UserAgentGenerator();
        }
        return {
            'User-Agent': this.client.state.webUserAgent,
            'Accept-Language': 'id-ID',
            'X-Instagram-AJAX': 1,
            'X-CSRFToken': this.client.state.cookieCsrfToken,
            'X-Requested-With': 'XMLHttpRequest',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'X-IG-App-ID': this.client.state.fbAnalyticsApplicationId,
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
            Referer: 'https://i.instagram.com/api/v1/challenge'
        };
    }
}
exports.Request = Request;
Request.requestDebug = debug_1.default('ig:request');
//# sourceMappingURL=request.js.map