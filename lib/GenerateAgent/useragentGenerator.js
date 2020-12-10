"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.userAgentFactory = void 0;
const ua = require('useragent-generator');
class userAgentFactory {
    constructor() {
        this.AndroidVersionGetBuild = [
            {
                version: '7.0.0',
                buildCodes: ["NRD90M", "NRD90R", "NRD90S", "NRD90T", "NRD90U", "NRD91D", "NBD90W", "NBD90X", "NBD90Z", "NRD91N", "NRD91K", "NBD91P", "N5D91L", "NBD91U", "NBD91Y", "NBD91Z", "NBD92D", "NBD92E", "NBD92F", "NBD92G",],
            },
            {
                version: '7.1.1',
                buildCodes: ["NMF26F", "NMF26H", "NMF26J", "NMF26O", "NMF26Q", "NMF26R", "NMF26U", "NMF26V", "N4F26I", "N4F26J", "N4F26M", "N6F26Q", "N4F26O", "N4F26Q", "NUF26K", "N6F26R", "NOF26V", "NOF26W", "NMF26X", "NMF27D", "N4F26T", "NOF27B", "NOF27C", "NUF26N", "N6F26U", "N4F26U", "N4F26X", "NOF27D",],
            },
            {
                version: '7.1.2',
                buildCodes: ["N2G47D", "N2G47E", "N2G47F", "N2G47H", "N2G47J"],
            },
            {
                version: '8.0.0',
                buildCodes: ["OPR6.170623.010", "OPR6.170623.011", "OPR6.170623.012", "OPR6.170623.013", "OPR1.170623.026",],
            },
            {
                version: '8.1.0',
                buildCodes: ["OPM1.171019.011", "OPM2.171019.012", "OPM1.171019.012", "OPM1.171019.013", "OPM1.171019.014", "6826376", "6780335", "6644286", "6560352", "6495665", "6454887", "6440157", "6197208"],
            },
            {
                version: '9.0.0',
                buildCodes: ["PPR1.180610.009", "PPR1.180610.010", "PPR1.180610.011", "5748468", "5794013", "5887210", "6826377", "6780336", "6644287",
                    "PQ3A.190705.003", "PQ3B.190705.003", "PQ3A.190801.002", "PQ3B.190801.002", "PQ3A.190705.001"],
            },
            {
                version: '10.0.0',
                buildCodes: ["QP1A.190711.019", "QP1A.190711.020", "QP1A.190711.020.C3", "QP1A.191005.007", "QP1A.191005.007.A1", "5933585", "QD4A.200805.003", "QD4A.200805.001", "QQ3A.200605.002",
                    "QD4A.200317.024.A1", "QD4A.200317.027", "6777444", "6780337", "RP1A.200720.009", "RP1A.200720.010", "RP1A.200720.011", "RP1A.201005.004", "RP1A.201005.006"
                ],
            },
        ];
        this.AndroidDevice = [
            "Nexus 5X", "SAMSUNG-SM-G935A", "SAMSUNG-SM-G891A", "SAMSUNG ONEPLUS A3003", "SAMSUNG-SM-G891A", "SAMSUNG SM-G925F", "SAMSUNG GT-I9505", "SAMSUNG-SM-G935V", "SAMSUNG SM-G935F", "SAMSUNG-SM-G920F", "SAMSUNG-SM-T713", "ASUS_A001", "ASUS_A006", "ASUS_X008D", "ASUS_X008DA", "ASUS_Z017D", "ASUS_X008DB", "Nexus 9", "Pixel C", "Nexus 6P", "Nexus 6", "SM-G930T", "SM-G955U", "SM-G930F", "SC-05G", "HTC 10", "SM-A520F", "Vivo 5R", "SCV36", "SM-G920V", "LG-M150", "LGL158VL", "LG-H860", "5049W", "Infinix X559C", "P00C", "Lenovo TB-7304X", "HTC 10 evo", "LG-LS993", "E1051X", "Ixion M545", "HTC One M9", "Formuler Z8", "BV8000Pro", "BQ-5008L", "CITI ATL 4G CS5029ML", "E1041X", "S2 LITE",
            "SM-T813", "HORIZON", "G155", "S2_PRO", "K6000 Plus", "SC-02H", "LGMP450", "FS526", "FS528", "LG-M257", "Infinix HOT 4", "BV7000", "Infinix X603", "LGMS210", "TFQCOAL01232", "SM-T819", "LG-M150", "Grand Pro", "LG-H870", "MI 5s", "X20L", "Redmi Note 4X", "MT-107", "HTC_0PJA10", "PSP7512DUO", "Pixel 2 XL", "Pixel 3", "LEX722", "SM-N975F", "SM-T350", "SM-A750FN", "SM-A105G", "SM-J701F", "SM-G530BT", "SM-G530F", "SM-G530FQ", "SM-G530T", "SM-G530W", "SM-G850F", "SM-G850K", "SM-G850M", "SM-G850W", "SM-G130H", "SM-N910G", "SM-N9150", "SM-N915G", "SM-G360H", "SM-E500H", "SM-E500F", "SM-G9209", "SM-G9208", "SM-G9200", "SM-G920V", "SM-G530FZ", "SM-G530H", "SM-G530M", "SM-G530R7",
            "SM-G530Y", "SM-G850FQ", "SM-G850L", "SM-G360BT", "SM-A3009", "SM-A300HQ", "SM-A300M", "SM-A5009", "SM-A7009W", "SM-A7009", "SM-A700F", "SM-G920TR", "SM-A605", "SM-J737", "SM-J610", "SM-J415", "SM-A750", "SM-A115", "SM-A115", "SM-A115", "SM-A315", "SM-P615", "SM-P610N", "SM-A716N", "SM-J260", "SM-M015", "SM-A716V", "SM-M017", "SM-A013", "SM-T970", "SM-F707", "SM-M515", "SM-J800", "SM-G8850", "SM-J737", "SM-A605", "SM-J400", "SM-G611", "SM-G960", "SM-J106F", "ZenFone Max Pro M1", "ASUS_X00TD", "Redmi Note 7", "Mi A2", "MI 9", "Redmi Note 6 Pro", "Mi A1",
            "F17 Pro", "F15", "F11 Pro", "A33", "A3s", "A1k", "A5", "A31", "A52", "Reno Z", "Reno", "Reno 5G", "Reno4", "Reno4 Pro", "Reno4 Z 4G", "Reno3 Pro 5G"
        ];
        this.iOsDevice = [
            "7.0", "7.0.1", "7.0.2", "7.0.3", "7.0.4", "7.0.5", "7.0.6", "7.1", "7.1.1", "7.1.2", "8.0",
            "8.0.1", "8.0.2", "8.1", "8.1.1", "8.1.2", "8.1.3", "8.2", "8.3", "8.4", "10.0", "10.0.1", "10.0.2", "10.0.3",
            "9.0", "9.0.1", "9.0.2", "9.2", "9.2.1", "9.1", "10.0", "10.1", "10.1.1", "10.2", "10.2.1", "11.0", "11.0.1", "11.0.2",
            "11.0.3", "11.1", "11.1.1", "11.1.2", "11.2", "11.2.1", "11.2.3", "11.2.4", "11.2.5", "11.2.6",
            "11.3", "11.3.1", "11.4", "11.4.1", "12.0", "12.0.1", "12.1", "12.1.1", "12.1.2", "12.1.3", "12.1.4",
            "12.2", "12.3", "12.3.1", "12.3.2"
        ];
        this.ChromeVersion = ["60.0.3112", "61.0.3163", "62.0.3202", "63.0.3239", "64.0.3282", "65.0.3325", "66.0.3359", "67.0.3396", "68.0.3440", "69.0.3497", "70.0.3538", "71.0.3578", "72.0.3626", "73.0.3683", "74.0.3729", "75.0.3770", "76.0.3809", "77.0.3865", "78.0.3904", "79.0.3945", "80.0.3987", "81.0.4044", "83.0.4103", "84.0.4147", "85.0.4183", "86.0.4240"];
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    getChromeAgent() {
        const getRandom = this.getDeviceRandom();
        const pickChromev = this.getRandomInt(this.ChromeVersion.length);
        const ChromeVer = this.ChromeVersion[pickChromev];
        const agent = ua.chrome.androidWebview({
            chromeVersion: ChromeVer,
            androidVersion: getRandom.version,
            device: getRandom.device_,
            buildVersion: getRandom.buildCode
        });
        return agent;
    }
    getDeviceRandom() {
        const pickNumber = this.getRandomInt(this.AndroidVersionGetBuild.length);
        const version = this.AndroidVersionGetBuild[pickNumber].version;
        const getBuild = this.getRandomInt(this.AndroidVersionGetBuild[pickNumber].buildCodes.length);
        const buildCode = this.AndroidVersionGetBuild[pickNumber].buildCodes[getBuild];
        const pickDevice = this.getRandomInt(this.AndroidDevice.length);
        const device_ = this.AndroidDevice[pickDevice];
        return {
            pickNumber,
            version,
            buildCode,
            device_
        };
    }
    getiosDevice() {
        const pickNumber = this.getRandomInt(this.iOsDevice.length);
        const iosv = this.iOsDevice[pickNumber];
        return ua.safari.iOSWebview({ iOSVersion: iosv });
    }
    userAgentFactory_() {
        try {
            const functions = [this.getChromeAgent, this.getChromeAgent];
            return this.getChromeAgent();
            //return functions[getRandomInt(functions.length)]();
        }
        catch (e) {
            return e;
        }
    }
}
exports.userAgentFactory = userAgentFactory;
//# sourceMappingURL=useragentGenerator.js.map