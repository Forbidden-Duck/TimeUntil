import document from "document";
import { me } from "appbit";
import { user } from "user-profile";
import * as utils from "../common/utils.js";
import * as themeLoader from "../common/themeLoader.js";
import * as Config from "../common/config.js";
import * as messaging from "messaging";
import { display } from "display";
if (display.on != true) {
    utils.openList();
}
display.onchange = () => {
    if (display.on != true) {
        utils.openList();
    }
}

const listPage = document.getElementById("listPage");
const datePage = document.getElementById("date");

const christmasButton = document.getElementById("christmasButton");
const newyearsButton = document.getElementById("newyearsButton");
const halloweenButton = document.getElementById("halloweenButton");
const birthdayButton = document.getElementById("birthdayButton");
const customButton = document.getElementById("customButton");
const customText = document.getElementById("customText");

const titleText = document.getElementById("title");
const backButton = document.getElementById("backButton");

initConfig();
utils.loadDocument(document);
themeLoader.loadDocument(document);

let currentDate = false;
let usersBirthday;
let usersCustom;
let usersCustomText;
let customTimeout;

backButton.onactivate = (event) => {
    currentDate = false;
    utils.openList();
    themeLoader.loadTheme("default");
}

christmasButton.onactivate = (event) => {
    currentDate = "christmas";
    utils.openDate();
    const now = new Date();
    let then = new Date(now.getFullYear() + 1, 11, 25, 0, 0, 0, 0);
    if (!(now.getMonth() == 11
        && now.getDate() >= 25)) {
        then = new Date(now.getFullYear(), 11, 25, 0, 0, 0, 0);
    }
    utils.loadTimeIntoDate(now, then);
    titleText.text = "Christmas";
    themeLoader.loadTheme("christmas");
}

newyearsButton.onactivate = (event) => {
    currentDate = "newyears";
    utils.openDate();
    const now = new Date();
    utils.loadTimeIntoDate(now, new Date(now.getFullYear(), 11, 31, 23, 59, 0, 0));
    titleText.text = "New Years";
    themeLoader.loadTheme("newyears");
}

halloweenButton.onactivate = (event) => {
    currentDate = "halloween";
    utils.openDate();
    const now = new Date();
    let then = new Date(now.getFullYear() + 1, 9, 31, 0, 0, 0, 0);
    if (!(now.getMonth() == 9
        && now.getDate() >= 31)) {
        then = new Date(now.getFullYear(), 9, 31, 0, 0, 0, 0);
    }
    utils.loadTimeIntoDate(now, then);
    titleText.text = "Halloween";
    themeLoader.loadTheme("halloween");
}

birthdayButton.onactivate = (event) => {
    currentDate = "birthday";
    utils.openDate();
    const now = new Date();
    let then = new Date(now.getFullYear() + 1, usersBirthday.getMonth(), usersBirthday.getDate(), 0, 0, 0, 0);
    updateBirthdayTime(now, then);
    themeLoader.loadTheme("birthday");
}

customButton.onactivate = (event) => {
    if (usersCustom == undefined) {
        customText.text = "No date set";
        if (!customTimeout) {
            customTimeout = setTimeout(() => {
                customText.text = `${usersCustomText || "Custom"}`;
                customTimeout = undefined;
            }, 3000);
        }
        return;
    }
    if (!validateCustom()) {
        customText.text = "Invalid date set";
        if (!customTimeout) {
            customTimeout = setTimeout(() => {
                customText.text = `${usersCustomText || "Custom"}`;
                customTimeout = undefined;
            }, 3000);
        }
        return;
    }
    currentDate = "custom";
    utils.openDate();
    const now = new Date();
    updateCustomTime(now, usersCustom);
    themeLoader.loadTheme("custom");
}

messaging.peerSocket.onmessage = function (event) {
    if (event.data.key === "birthday") {
        updateBirthday(event.data.value.name);
        Config.set("birthday", event.data.value.name);
        Config.save();

        if (datePage.class === "visible"
            && currentDate === "birthday") {
            const now = new Date();
            let then = new Date(now.getFullYear() + 1, usersBirthday.getMonth(), usersBirthday.getDate(), 0, 0, 0, 0);
            updateBirthdayTime(now, then);
        }
    } else if (event.data.key === "customTitle") {
        updateCustomText(event.data.value.name);
        Config.set("customTitle", event.data.value.name);
        Config.save();
    } else if (event.data.key === "customTime") {
        updateCustom(event.data.value.name);
        Config.set("customTime", event.data.value.name);
        Config.save();

        if (datePage.class === "visible"
            && currentDate === "custom") {
            const now = new Date();
            updateCustomTime(now, usersCustom);
        }
    }
}

function updateBirthdayTime(now, then) {
    if (!(now.getMonth() == usersBirthday.getMonth()
        && now.getDate() >= usersBirthday.getDate())) {
        then = new Date(now.getFullYear(), usersBirthday.getMonth(), usersBirthday.getDate(), 0, 0, 0, 0);
    }
    utils.loadTimeIntoDate(now, then);
    titleText.text = `${utils.birthdayToMonthDay(usersBirthday)} - ${utils.ageFromDate(usersBirthday)}yrs`;
}

function updateBirthday(birthdaySet) {
    const birthday = birthdaySet.split("-").map(item => parseInt(item));
    usersBirthday = new Date(birthday[0], birthday[1] - 1, birthday[2], 0, 0, 0, 0);
}

function updateCustomTime(now, then) {
    utils.loadTimeIntoDate(now, then);
    titleText.text = `${usersCustomText || "Custom"}`;
}

function updateCustomText(title) {
    usersCustomText = title;
    customText.text = `${usersCustomText || "Custom"}`;
    if (datePage.class === "visible"
        && currentDate === "custom") {
        titleText.text = `${usersCustomText || "Custom"}`;
    }
}

function updateCustom(customSet) {
    const custom = customSet.split("-").map(item => parseInt(item));
    usersCustom = new Date(custom[0], custom[1] - 1, custom[2], 0, 0, 0, 0);
}

function validateCustom() {
    if (!(usersCustom instanceof Date)) {
        return false;
    }
    const now = new Date();
    if (now.getFullYear() > usersCustom.getFullYear()) {
        return false;
    } else if (now.getFullYear() == usersCustom.getFullYear()) {
        if (now.getMonth() > usersCustom.getMonth()) {
            return false;
        }
        if (now.getMonth() == usersCustom.getMonth()
            && now.getDate() >= usersCustom.getDate()) {
            return false;
        }
    }
    return true;
}

function initConfig() {
    if (Config.load()) {
        const birthdaySet = Config.get("birthday");
        if (birthdaySet) {
            updateBirthday(birthdaySet);
        }
        const customTitleSet = Config.get("customTitle");
        const customTimeSet = Config.get("customTime");
        if (customTitleSet) {
            updateCustomText(customTitleSet);
        }
        if (customTimeSet) {
            updateCustom(customTimeSet);
        }
    }
    if (me.permissions.granted("access_user_profile")
        && !usersBirthday) {
        const now = new Date();
        if (typeof user.age === "number") {
            usersBirthday = new Date(now.getFullYear() - user.age, 0, 1, 0, 0, 0, 0);
        } else {
            usersBirthday = new Date();
        }
    }
}