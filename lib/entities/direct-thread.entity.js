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
const urlRegex = require("url-regex");
const entity_1 = require("../core/entity");
const errors_1 = require("../errors");
const publish_service_1 = require("../services/publish.service");
const Bluebird = require("bluebird");
class DirectThreadEntity extends entity_1.Entity {
    constructor() {
        super(...arguments);
        this.threadId = null;
        this.userIds = null;
    }
    deleteItem(itemId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.threadId) {
                throw new errors_1.IgClientError('threadId was null.');
            }
            return this.client.directThread.deleteItem(this.threadId, itemId);
        });
    }
    broadcastText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const urls = text.match(urlRegex({ strict: false }));
            if (urls instanceof Array) {
                return this.broadcastLink(text, urls);
            }
            return yield this.broadcast({
                item: 'text',
                form: {
                    text,
                },
            });
        });
    }
    broadcastReel(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.broadcast({
                item: 'reel_share',
                form: {
                    media_id: options.mediaId,
                    reel_id: options.reelId || options.mediaId.split('_')[1],
                    text: options.text,
                    entry: 'reel',
                },
                qs: {
                    media_type: options.mediaType || 'photo',
                },
            });
        });
    }
    broadcastUserStory(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.broadcast({
                item: 'story_share',
                form: {
                    story_media_id: options.mediaId,
                    reel_id: options.reelId || options.mediaId.split('_')[1],
                    text: options.text,
                },
                qs: {
                    media_type: options.mediaType || 'photo',
                },
                signed: true,
            });
        });
    }
    broadcastProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.broadcast({
                item: 'profile',
                form: {
                    profile_user_id: id,
                },
            });
        });
    }
    broadcastLink(link_text, link_urls) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.broadcast({
                item: 'link',
                form: {
                    link_text,
                    link_urls: JSON.stringify(link_urls),
                },
            });
        });
    }
    broadcastPhoto(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { upload_id } = yield this.client.upload.photo({
                uploadId: options.uploadId,
                file: options.file,
            });
            return yield this.broadcast({
                item: 'configure_photo',
                form: {
                    allow_full_aspect_ratio: options.allowFullAspectRatio || true,
                    upload_id,
                },
            });
        });
    }
    broadcastVideo(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uploadId = options.uploadId || Date.now().toString();
            const videoInfo = publish_service_1.PublishService.getVideoInfo(options.video);
            yield this.client.upload.video(Object.assign({ video: options.video, uploadId, isDirect: true }, videoInfo));
            yield Bluebird.try(() => this.client.media.uploadFinish({
                upload_id: uploadId,
                source_type: '2',
                video: { length: videoInfo.duration / 1000.0 },
            })).catch(errors_1.IgResponseError, publish_service_1.PublishService.catchTranscodeError(videoInfo, options.transcodeDelay || 4 * 1000));
            return yield this.broadcast({
                item: 'configure_video',
                form: {
                    video_result: '',
                    upload_id: uploadId,
                    sampled: typeof options.sampled !== 'undefined' ? options.sampled : true,
                },
            });
        });
    }
    broadcastVoice(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const duration = publish_service_1.PublishService.getMP4Duration(options.file);
            const uploadId = options.uploadId || Date.now().toString();
            yield this.client.upload.video({
                duration,
                video: options.file,
                uploadId,
                isDirectVoice: true,
                mediaType: '11',
            });
            yield Bluebird.try(() => this.client.media.uploadFinish({
                upload_id: uploadId,
                source_type: '4',
            })).catch(errors_1.IgResponseError, publish_service_1.PublishService.catchTranscodeError({ duration }, options.transcodeDelay || 4 * 1000));
            return yield this.broadcast({
                item: 'share_voice',
                form: {
                    waveform: JSON.stringify(options.waveform || Array.from(Array(20), (_, i) => Math.sin(i * (Math.PI / 10)) * 0.5 + 0.5)),
                    waveform_sampling_frequency_hz: options.waveformSamplingFrequencyHz || '10',
                    upload_id: uploadId,
                },
            });
        });
    }
    broadcastStory(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = input instanceof Buffer ? { file: input } : input;
            const baseOptions = Object.assign(Object.assign({}, options), { viewMode: options.viewMode || 'replayable', replyType: options.replyType });
            if (this.threadId !== null) {
                return yield this.client.publish.story(Object.assign(Object.assign({}, baseOptions), { threadIds: [this.threadId] }));
            }
            if (this.userIds !== null) {
                return yield this.client.publish.story(Object.assign(Object.assign({}, baseOptions), { recipientUsers: this.userIds }));
            }
            throw new Error('DirectThread: No recipients set');
        });
    }
    updateTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.updateTitle(this.threadId, title);
        });
    }
    mute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.mute(this.threadId);
        });
    }
    unmute() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.unmute(this.threadId);
        });
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.hide(this.threadId);
        });
    }
    leave() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.leave(this.threadId);
        });
    }
    addUser(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.addUser(this.threadId, userIds);
        });
    }
    markItemSeen(threadItemId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.directThread.markItemSeen(this.threadId, threadItemId);
        });
    }
    broadcast(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.threadId === null && this.userIds === null) {
                throw new Error('DirectThread: No recipients set');
            }
            const baseParams = {
                item: options.item,
                form: options.form,
                qs: options.qs,
                signed: options.signed,
            };
            let params;
            if (this.threadId) {
                params = Object.assign(baseParams, { threadIds: this.threadId });
            }
            else {
                params = Object.assign(baseParams, { userIds: this.userIds });
            }
            const response = yield this.client.directThread.broadcast(params);
            if (response.payload) {
                this.threadId = response.payload.thread_id;
                this.userIds = null;
                return response.payload;
            }
            else if (response.message_metadata) {
                const [first] = response.message_metadata;
                this.threadId = first.thread_id;
                this.userIds = null;
                return response;
            }
        });
    }
}
exports.DirectThreadEntity = DirectThreadEntity;
//# sourceMappingURL=direct-thread.entity.js.map