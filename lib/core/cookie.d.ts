export var __esModule: boolean;
export class State {
    constructor({ username, password, cookie }: {
        username: any;
        password: any;
        cookie: any;
    }, { requestOptions }?: {
        requestOptions: any;
    });
    credentials: {
        username: any;
        password: any;
        cookie: any;
    };
    timezoneOffset: string;
    cookieStore: any;
    cookieJar: any;
    get UserAgent(): any;
    get cookieCsrfToken(): any;
    get cookieUserId(): any;
    get cookieUsername(): any;
    get cookieMid(): any;
    get cookieIgdid(): any;
    get cookieSessionid(): any;
    get cookieRur(): any;
    get urlgen(): any;
    extractCookie(key: any): any;
    extractCookieValue(key: any): any;
    extractUserId(): any;
    deserializeCookieJar(cookies: any): Promise<void>;
    serializeCookieJar(): Promise<any>;
    serialize(): Promise<{
        cookies: string;
    }>;
    deserialize(state: any): Promise<void>;
    constants: any;
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
