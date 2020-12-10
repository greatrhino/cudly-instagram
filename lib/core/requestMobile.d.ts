export var __esModule: boolean;
export class RequestM {
    static requestTransform(body: any, response: any, resolveWithFullResponse: any): any;
    constructor(client: any);
    client: any;
    constants: typeof Constants;
    end$: any;
    error$: any;
    attemptOptions: {
        maxAttempts: number;
    };
    language: string;
    agent: userAgentFactory_1.userAgentFactory;
    userAgent: any;
    defaults: {};
    radioType: string;
    capabilitiesHeader: string;
    connectionTypeHeader: string;
    isLayoutRTL: boolean;
    euDCEnabled: any;
    adsOptOut: boolean;
    thumbnailCacheBustingValue: number;
    clientSessionIdLifetime: number;
    pigeonSessionIdLifetime: number;
    sendBypass(userOptions: any, onlyCheckHttpStatus: any): Promise<any>;
    handleResponseError(response: any): any;
    updateState(response: any): void;
    signatureKey(): string;
    signatureVersion(): string;
    signature(data: any): any;
    sign(payload: any): {
        ig_sig_key_version: () => string;
        signed_body: string;
    };
    faultTolerantRequestWeb(options: any): Promise<any>;
    appUserAgent(): string;
    generateDevice(seed: any): void;
    deviceString: any;
    deviceId: string;
    uuid: any;
    phoneId: any;
    adid: any;
    build: any;
    generateTemporaryGuid(seed: any, lifetime: any): any;
    getDefaultHeadersWeb(): {
        'User-Agent': string;
        'X-Ads-Opt-Out': string;
        'X-CM-Bandwidth-KBPS': string;
        'X-CM-Latency': string;
        'X-IG-App-Locale': any;
        'X-IG-Device-Locale': any;
        'X-Pigeon-Session-Id': any;
        'X-Pigeon-Rawclienttime': string;
        'X-IG-Connection-Speed': string;
        'X-IG-Bandwidth-Speed-KBPS': string;
        'X-IG-Bandwidth-TotalBytes-B': string;
        'X-IG-Bandwidth-TotalTime-MS': string;
        'X-Bloks-Version-Id': any;
        'X-MID': any;
        'X-IG-WWW-Claim': any;
        'X-IG-Connection-Type': any;
        'X-IG-Capabilities': any;
        'X-IG-App-ID': any;
        'X-IG-Device-ID': any;
        'X-IG-Android-ID': any;
        'Accept-Language': any;
        'X-FB-HTTP-Engine': string;
        Authorization: any;
        Host: string;
        'Accept-Encoding': string;
        Connection: string;
    };
}
export namespace RequestM {
    const requestDebug: any;
}
import Constants = require("./constants");
import userAgentFactory_1 = require("../GenerateAgent/useragentGenerator");
