export var __esModule: boolean;
export class Request {
    static requestTransform(body: any, response: any, resolveWithFullResponse: any): any;
    static requestTransformLogin(body: any, response: any, resolveWithFullResponse: any): any;
    constructor(client: any);
    client: any;
    end$: any;
    error$: any;
    attemptOptions: {
        maxAttempts: number;
    };
    defaults: {};
    getString(start: any, end: any, all: any): Promise<RegExpExecArray>;
    _getSharedData(response: any): Promise<void>;
    send(userOptions: any, action?: boolean): Promise<any>;
    getCooks(userOptions: any, action?: boolean): Promise<boolean>;
    getSession(headers: any): any;
    getCookies(cookie: any): any;
    sendBypass(userOptions: any, onlyCheckHttpStatus: any): Promise<any>;
    sendLogin(userOptions: any, action?: boolean): Promise<any>;
    handleResponse(response: any): any;
    handleResponseError(response: any): any;
    signature(data: any): any;
    sign(payload: any): {
        ig_sig_key_version: any;
        signed_body: string;
    };
    updateState(response: any): void;
    faultTolerantRequest(options: any): Promise<any>;
    faultTolerantRequestWeb(options: any): Promise<any>;
    getDefaultHeadersLogin(): {
        'User-Agent': any;
        'Accept-Language': string;
        'X-Instagram-AJAX': number;
        'sec-fetch-site': string;
        'sec-fetch-mode': string;
        'sec-fetch-dest': string;
        'X-CSRFToken': any;
        'X-Requested-With': string;
        'X-IG-App-ID': string;
        'X-IG-WWW-Claim': number;
        Referer: string;
    };
    getDefaultHeaders(): {
        'User-Agent': {};
        'Accept-Language': string;
        'X-Instagram-AJAX': number;
        'sec-fetch-site': string;
        'sec-fetch-mode': string;
        'sec-fetch-dest': string;
        'X-CSRFToken': any;
        'X-Requested-With': string;
        'X-IG-App-ID': string;
        'X-IG-WWW-Claim': any;
        Referer: string;
    };
    getDefaultHeadersWeb(): {
        'User-Agent': any;
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
export namespace Request {
    const requestDebug: any;
}
