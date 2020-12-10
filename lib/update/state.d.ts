export var __esModule: boolean;
export class State {
    constants: any;
    supportedCapabilities: any;
    language: string;
    timezoneOffset: string;
    radioType: string;
    capabilitiesHeader: string;
    connectionTypeHeader: string;
    isLayoutRTL: boolean;
    euDCEnabled: any;
    adsOptOut: boolean;
    thumbnailCacheBustingValue: number;
    cookieStore: any;
    cookieJar: any;
    checkpoint: any;
    challenge: any;
    clientSessionIdLifetime: number;
    pigeonSessionIdLifetime: number;
    webUserAgent: any;
    get signatureKey(): any;
    get signatureVersion(): any;
    get userBreadcrumbKey(): any;
    get appVersion(): any;
    get appVersionCode(): any;
    get fbAnalyticsApplicationId(): any;
    get fbOtaFields(): any;
    get fbOrcaApplicationId(): any;
    get loginExperiments(): any;
    get experiments(): any;
    get bloksVersionId(): any;
    get clientSessionId(): any;
    get pigeonSessionId(): any;
    get appUserAgent(): string;
    get devicePayload(): {
        android_version: any;
        android_release: any;
        manufacturer: any;
        model: any;
    };
    get batteryLevel(): number;
    get isCharging(): any;
    get challengeUrl(): string;
    get cookieCsrfToken(): any;
    get cookieUserId(): any;
    get cookieUsername(): any;
    isExperimentEnabled(experiment: any): any;
    extractCookie(key: any): any;
    extractCookieValue(key: any): any;
    extractUserId(): any;
    deserializeCookieJar(cookies: any): Promise<void>;
    serializeCookieJar(): Promise<any>;
    serialize(): Promise<{
        constants: any;
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
