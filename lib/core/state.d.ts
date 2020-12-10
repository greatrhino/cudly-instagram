export var __esModule: boolean;
export class State {
    constants: typeof Constants;
    supportedCapabilities: any;
    language: string;
    timezoneOffset: string;
    cookieStore: any;
    cookieJar: any;
    checkpoint: any;
    challenges: any;
    csrftoken: any;
    cookiesForLogin: any;
    webUserAgent: any;
    cookieCsrf: any[];
    cookiesMidValue: any[];
    cookiesIgdidVal: any[];
    get signatureKey(): string;
    get signatureVersion(): string;
    get appVersionCode(): string;
    get appVersion(): string;
    get appUserAgent(): string;
    get generateBrowserAgent(): any;
    uaweb: any;
    get challengeUrl(): string;
    set cookieCsrfToken(arg: any);
    get cookieCsrfToken(): any;
    get cookieUserId(): any;
    get cookieUsername(): any;
    set cookieMid(arg: any);
    get cookieMid(): any;
    set cookieIgdid(arg: any);
    get cookieIgdid(): any;
    isExperimentEnabled(experiment: any): any;
    removeCookie(key: any): Promise<any>;
    /**
     getCookiesBefore(){
        const ig_did = this.extractCookieValue("ig_did");
        const mid = this.extractCookieValue("mid");
        const csrftoken = this.extractCookieValue("csrftoken");
        const CookieString = `ig_did=${ig_did};mid=${mid};fbm_124024574287414=base_domain=.instagram.com;ig_nrbc=1;csrftoken=${csrftoken}`;
        return CookieString;
    }
    */
    extractCookie(key: any): any;
    get fbAnalyticsApplicationId(): string;
    extractCookieValue(key: any): any;
    extractUserId(): any;
    deserializeCookieJar(cookies: any): Promise<void>;
    serializeCookieJar(): Promise<any>;
    serialize(): Promise<{
        cookies: string;
    }>;
    deserialize(state: any): Promise<void>;
    generateDevice(seed: any): void;
    deviceString: any;
    deviceId: string;
    uuid: any;
    phoneId: any;
    adid: any;
    build: any;
    generateTemporaryGuid(seed: any, lifetime: any): any;
}
export namespace State {
    const stateDebug: any;
}
import Constants = require("./constants");
