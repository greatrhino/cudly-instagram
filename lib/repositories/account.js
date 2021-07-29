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
const repository_1 = require("../core/repository");
const errors_1 = require("../errors");
const lodash_1 = require("lodash");
const Bluebird = require("bluebird");
const debug_1 = require("debug");
const crypto = require('crypto');
const reques_1 = require('request-promise-native');
const decorators_1 = require("../decorators");
const baseUrl = 'https://www.instagram.com';
//const {username,password} = process.env
class account extends repository_1.Repository {
    login({ username, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const createEncPassword = pwd => {
                return `#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${pwd}`;
            };
            const response = yield Bluebird.try(() => this.client.request.sendLogin({
                method: 'POST',
                url: '/accounts/login/ajax/',
                form: {
                    username,
                    enc_password: createEncPassword(password),
                    queryParams: {},
                    optIntoOneTap: 'false'
                },
            })).catch(errors_1.IgResponseError, error => {
                switch (error.response.body.name) {
                    case 'IgCheckpointError': {
                        throw new errors_1.IgCheckpointError(error.response.body);
                    }
                    case 'IgLoginBadPasswordError': {
                        throw new errors_1.IgLoginBadPasswordError(error.response.body);
                    }
                    default: {
                        throw error;
                    }
                }
            });
            return response.body;
        });
    }

    changepassword({ oldpassword, newpassword }) {
        return __awaiter(this, void 0, void 0, function* () {
            const createEncPassword = pwd => {
                return `#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${pwd}`;
            };
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: '/accounts/password/change/',
                headers: {
                    "user-agent": this.client.state.generateBrowserAgent,
                    Referer: `${baseUrl}/accounts/password/change/`,
                },
                form: {
                    enc_old_password: createEncPassword(oldpassword),
                    enc_new_password1: createEncPassword(newpassword),
                    enc_new_password2: createEncPassword(newpassword)
                },
            });
            return body;
        });
    }
    
    async userinfo({ username }) {
        const { body } = await this.client.request.sendGet({
            headers: {
                'Referer': `${baseUrl}/${username}/?__a=1`,
             },
             method: 'GET',
             url: `/${username}/?__a=1`,
        });
        return body;
    }
    async mediainfo({ shortcode }) {
        const { body } = await this.client.request.sendGet({
            url: `/p/${shortcode}/?__a=1`,
            method: 'GET',
            headers: {
                'Referer': `${baseUrl}/p/${shortcode}/?__a=1`,
             },
        });
        return body;
    }
    
    async infoMedia(mediaId) {
        const { body } = await this.client.request.sendBypass({
            url: `/api/v1/media/${mediaId}/info/`,
            method: 'GET',
            form: this.client.request.sign({
                igtv_feed_preview: false,
                media_id: mediaId,
                _csrftoken: this.client.state.cookieCsrfToken,
                _uid: this.client.state.cookieUserId,
                _uuid: this.client.state.uuid,
            }),
        });
        return body;
    }
    async friendShip(id) {
        const { body } = await this.client.request.sendBypass({
            url: `/api/v1/friendships/show/${id}/`,
        });
        return body;
    }
    async infoUser(id) {
        const { body } = await this.client.request.sendBypass({
            url: `/api/v1/users/${id}/info/`,
        });
        return body.user;
    }

    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/accounts/edit/?__a=1',
            });
            return body;
        });
    }
    getInfobyID({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.sendBypass({
                url: `/api/v1/users/${id}/info/`,
            });
            return body.user;
        });
    }
    bypassChallenge(choice) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.sendBypass({
                method: 'POST',
                url: '/api/v1/challenge/',
                form: this.client.request.sign({
                    choice,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                }),
            });
            this.middleware(body);
            return body;
        });
    }
    selectVerifyMethod({ choice }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.sendBypass({
                url: this.client.state.challengeUrl,
                method: 'POST',
                form: this.client.request.sign({
                    choice,
                    _csrftoken: this.client.state.cookieCsrfToken,
                    guid: this.client.state.uuid,
                    device_id: this.client.state.deviceId,
                }),
            });
            this.middleware(body);
            return body;
        });
    }
    _navigateChallenge({ challengeUrl, endpoint, form }) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = endpoint
                ? challengeUrl.replace('/challenge/', `/challenge/${endpoint}/`)
                : challengeUrl;
            const { body } = yield this.client.request.send({
                method: 'POST',
                url,
                headers: {
                    Referer: `${baseUrl}${challengeUrl}`
                },
                form
            });
            this.middleware(body);
            return body;
        });
    }
    updateChallenge({ challengeUrl, choice, securityCode }) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = securityCode ? { security_code: securityCode } : { choice };
            return this._navigateChallenge({
                challengeUrl,
                form
            });
        });
    }
    getIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request.getCooks({
                url: '/',
                method: 'POST',
            });
            return true;
        });
    }
    middleware(body) {
        if (body.status === 'ok') {
            this.client.state.checkpoint = null;
            this.client.state.challenge = null;
        }
        else if (body.action === 'close') {
            this.client.state.checkpoint = null;
            this.client.state.challenge = null;
        }
        else {
            this.client.state.challenge = body;
        }
    }
    like({ mediaId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: `/web/likes/${mediaId}/like/`,
            });
            return body;
        });
    }
    follow({ userId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                method: 'POST',
                url: `/web/friendships/${userId}/follow/`,
            });
            return body;
        });
    }
    _getHomeData({ queryHash, variables }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = yield this.client.request.send({
                url: '/graphql/query/',
                qs: {
                    query_hash: queryHash,
                    variables: JSON.stringify(variables)
                }
            });
            return body;
        });
    }
    getHome(mediaItemCursor) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getHomeData({
                queryHash: '01b3ccff4136c4adf5e67e1dd7eab68d',
                variables: {
                    fetch_media_item_cursor: mediaItemCursor
                }
            });
        });
    }
    _getGis(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rhx_gis } = this._sharedData || (yield this._getSharedData(path));
            return crypto
                .createHash('md5')
                .update(`${rhx_gis}:${path}`)
                .digest('hex');
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('/accounts/logout/ajax/');
        });
    }
}
exports.account = account;
account.accountDebug = debug_1.default('ig:account');
//# sourceMappingURL=account.js.map