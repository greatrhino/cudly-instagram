export var __esModule: boolean;
export class account extends repository_1.Repository {
    constructor(client: any);
    login({ username, password }: {
        username: any;
        password: any;
    }): Promise<any>;
    userinfo({ username }: {
        username: any;
    }): Promise<any>;
    mediainfo({ shortcode }: {
        shortcode: any;
    }): Promise<any>;
    getProfile(): Promise<any>;
    getInfobyID({ id }: {
        id: any;
    }): Promise<any>;
    bypassChallenge(choice: any): Promise<any>;
    selectVerifyMethod({ choice }: {
        choice: any;
    }): Promise<any>;
    _navigateChallenge({ challengeUrl, endpoint, form }: {
        challengeUrl: any;
        endpoint: any;
        form: any;
    }): Promise<any>;
    updateChallenge({ challengeUrl, choice, securityCode }: {
        challengeUrl: any;
        choice: any;
        securityCode: any;
    }): Promise<any>;
    getIndex(): Promise<boolean>;
    middleware(body: any): void;
    like({ mediaId }: {
        mediaId: any;
    }): Promise<any>;
    follow({ userId }: {
        userId: any;
    }): Promise<any>;
    _getHomeData({ queryHash, variables }: {
        queryHash: any;
        variables: any;
    }): Promise<any>;
    getHome(mediaItemCursor: any): Promise<any>;
    _getGis(path: any): Promise<any>;
    logout(): Promise<any>;
}
export namespace account {
    const accountDebug: any;
}
import repository_1 = require("../core/repository");
