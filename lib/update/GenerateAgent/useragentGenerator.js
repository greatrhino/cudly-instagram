"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserAgentGenerator = void 0;
const ua = require('useragent-generator');
const AndroidVersionGetBuild = [{
        version: '7.0.0',
        buildCodes: [
            "NRD90M",
            "NRD90R",
            "NRD90S",
            "NRD90T",
            "NRD90U",
            "NRD91D",
            "NBD90W",
            "NBD90X",
            "NBD90Z",
            "NRD91N",
            "NRD91K",
            "NBD91P",
            "N5D91L",
            "NBD91U",
            "NBD91Y",
            "NBD91Z",
            "NBD92D",
            "NBD92E",
            "NBD92F",
            "NBD92G",
        ],
    },
    {
        version: '7.1.1',
        buildCodes: [
            "NMF26F",
            "NMF26H",
            "NMF26J",
            "NMF26O",
            "NMF26Q",
            "NMF26R",
            "NMF26U",
            "NMF26V",
            "N4F26I",
            "N4F26J",
            "N4F26M",
            "N6F26Q",
            "N4F26O",
            "N4F26Q",
            "NUF26K",
            "N6F26R",
            "NOF26V",
            "NOF26W",
            "NMF26X",
            "NMF27D",
            "N4F26T",
            "NOF27B",
            "NOF27C",
            "NUF26N",
            "N6F26U",
            "N4F26U",
            "N4F26X",
            "NOF27D",
        ],
    },
    {
        version: '7.1.2',
        buildCodes: [
            "N2G47D",
            "N2G47E",
            "N2G47F",
            "N2G47H",
            "N2G47J",
        ],
    },
    {
        version: '8.0.0',
        buildCodes: [
            "OPR6.170623.010",
            "OPR6.170623.011",
            "OPR6.170623.012",
            "OPR6.170623.013",
            "OPR1.170623.026",
        ],
    },
    {
        version: '8.1.0',
        buildCodes: [
            "OPM1.171019.011",
            "OPM2.171019.012",
            "OPM1.171019.012",
            "OPM1.171019.013",
            "OPM1.171019.014"
        ],
    },
    {
        version: '9.0.0',
        buildCodes: [
            "PPR1.180610.009",
            "PPR1.180610.010",
            "PPR1.180610.011",
            "5748468",
            "5794013",
            "5887210"
        ],
    },
    {
        version: '10.0.0',
        buildCodes: [
            "QP1A.190711.019",
            "QP1A.190711.020",
            "QP1A.190711.020.C3",
            "QP1A.191005.007",
            "QP1A.191005.007.A1",
            "5933585",
            "QD4A.200805.003",
            "QD4A.200805.001"
        ],
    },
];
const AndroidDevice = [
    "Nexus 5X",
    "SAMSUNG-SM-G935A",
    "SAMSUNG-SM-G891A",
    "SAMSUNG ONEPLUS A3003",
    "SAMSUNG-SM-G891A",
    "SAMSUNG SM-G925F",
    "SAMSUNG GT-I9505",
    "SAMSUNG-SM-G935V",
    "SAMSUNG SM-G935F",
    "SAMSUNG-SM-G920F",
    "SAMSUNG-SM-T713",
    "ASUS_A001",
    "ASUS_A006",
    "ASUS_X008D",
    "ASUS_X008DA",
    "ASUS_Z017D",
    "ASUS_X008DB",
    "Nexus 9",
    "Pixel C",
    "Nexus 6P",
    "Nexus 6",
    "SM-G930T",
    "SM-G955U",
    "SM-G930F",
    "SC-05G",
    "HTC 10",
    "SM-A520F",
    "Vivo 5R",
    "SCV36",
    "SM-G920V",
    "LG-M150",
    "LGL158VL",
    "LG-H860",
    "5049W",
    "Infinix X559C",
    "P00C",
    "Lenovo TB-7304X",
    "HTC 10 evo",
    "LG-LS993",
    "E1051X",
    "Ixion M545",
    "HTC One M9",
    "Formuler Z8",
    "BV8000Pro",
    "BQ-5008L",
    "CITI ATL 4G CS5029ML",
    "E1041X",
    "S2 LITE",
    "SM-T813",
    "HORIZON",
    "G155",
    "S2_PRO",
    "K6000 Plus",
    "SC-02H",
    "LGMP450",
    "FS526",
    "FS528",
    "LG-M257",
    "Infinix HOT 4",
    "BV7000",
    "Infinix X603",
    "LGMS210",
    "TFQCOAL01232",
    "SM-T819",
    "LG-M150",
    "Grand Pro",
    "LG-H870",
    "MI 5s",
    "X20L",
    "Redmi Note 4X",
    "MT-107",
    "HTC_0PJA10",
    "PSP7512DUO",
    "Pixel 2 XL",
    "Pixel 3",
    "LEX722",
    "SM-N975F",
    "SM-T350",
    "SM-A750FN",
    "SM-A105G",
    "SM-J701F"
];
const ChromeVersion = [
    "60.0.3112",
    "61.0.3163",
    "62.0.3202",
    "63.0.3239",
    "64.0.3282",
    "65.0.3325",
    "66.0.3359",
    "67.0.3396",
    "68.0.3440",
    "69.0.3497",
    "70.0.3538",
    "71.0.3578",
    "72.0.3626",
    "73.0.3683",
    "74.0.3729",
    "75.0.3770",
    "76.0.3809",
    "77.0.3865",
    "78.0.3904",
    "79.0.3945",
    "80.0.3987",
    "81.0.4044",
    "83.0.4103",
    "84.0.4147",
    "85.0.4183",
    "86.0.4240"
];
const firefox = [
    "60.0.1",
    "60.0.2",
    "60.1.0",
    "60.2.0",
    "61.0.1",
    "62.0",
    "62.0.2",
    "63.0.0",
    "64.0.2",
    "65.0.0",
    "66.0.1",
    "68.0.0",
    "68.0.1",
    "68.1.0",
    "70.0",
    "70.0.1",
    "71.0",
    "72.0.1",
    "72.0.2",
    "73.0",
    "73.0.1",
    "74.0",
    "75.0",
    "76.0.0",
    "76.0.1",
    "77.0.0",
    "77.0.1",
    "78.0",
    "78.0.1",
    "78.0.2"
];
const PC_Device = [
    "Windows NT 6.4", "Windows NT 6.3", "Windows NT 6.2", "Windows NT 6.2; ARM;", "Windows NT 6.1"
];
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function getChromeAgent() {
    const getRandom = getDeviceRandom();
    const pickChromev = getRandomInt(ChromeVersion.length);
    const ChromeVer = ChromeVersion[pickChromev];
    const agent = ua.chrome.androidPhone({
        version: ChromeVer,
        androidVersion: getRandom.version,
        device: getRandom.device_,
        buildVersion: getRandom.buildCode
    });
    return agent;
}
function getDeviceRandom() {
    const pickNumber = getRandomInt(AndroidVersionGetBuild.length);
    const version = AndroidVersionGetBuild[pickNumber].version;
    const getBuild = getRandomInt(AndroidVersionGetBuild[pickNumber].buildCodes.length);
    const buildCode = AndroidVersionGetBuild[pickNumber].buildCodes[getBuild];
    const pickDevice = getRandomInt(AndroidDevice.length);
    const device_ = AndroidDevice[pickDevice];
    return {
        pickNumber,
        version,
        buildCode,
        device_
    };
}
function getChromeFireFox() {
    const getRandom = getDeviceRandom();
    const RandomFr = getRandom.pickNumber;
    const firefoxVersion = firefox[RandomFr];
    return ua.firefox.androidPhone({
        version: firefoxVersion,
        androidVersion: getRandom.version,
        device: getRandom.device_,
        buildVersion: getRandom.buildCode
    });
}
function ChromeWeb() {
    const getRandom = getDeviceRandom();
    const pickChromev = getRandomInt(ChromeVersion.length);
    const ChromeVer = ChromeVersion[pickChromev];
    const PC_OS = getRandomInt(PC_Device.length);
    const Os_Desktop = ChromeVersion[PC_Device];
    return ua.chrome({
        version: ChromeVer,
        os: Os_Desktop
    });
}
function firefoxDesktop() {
    const pickNumber = getRandomInt(firefox.length);
    const firefoxDesktop = firefox[pickNumber];
    const PC_OS = getRandomInt(PC_Device.length);
    const Os_Desktop = ChromeVersion[PC_Device];
    return ua.firefox({
        version: firefoxDesktop,
        os: Os_Desktop
    });
}
function UserAgentGenerator() {
    try {
        const functions = [getChromeAgent, ChromeWeb];
        return functions[getRandomInt(functions.length)]();
        ;
    }
    catch (e) {
        return e;
    }
}
exports.UserAgentGenerator = UserAgentGenerator;
//# sourceMappingURL=useragentGenerator.js.map