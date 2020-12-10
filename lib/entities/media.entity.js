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
const request = require("request-promise");
const entity_1 = require("../core/entity");
class MediaEntity extends entity_1.Entity {
    static oembed(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return request({
                url: 'https://api.instagram.com/oembed/',
                json: true,
                qs: {
                    url,
                },
            });
        });
    }
}
exports.MediaEntity = MediaEntity;
//# sourceMappingURL=media.entity.js.map