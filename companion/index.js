import { settingsStorage } from "settings";
import * as messaging from "messaging";

settingsStorage.onchange = function (event) {
    if (event.newValue !== event.oldValue) {
        if ((event.key === "birthday" || event.key === "customTime")
            && !parseDate(JSON.parse(event.newValue).name)) {
            settingsStorage.setItem(event.key, event.oldValue);
            return;
        }
        sendValue(event.key, event.newValue);
    }
}

function parseDate(value) {
    const dateSpl = value.split("-").map(item => parseInt(item));
    if (dateSpl.length === 3) {
        if (validateDate(new Date(), dateSpl)) {
            const date = new Date(dateSpl[0], dateSpl[1] - 1, dateSpl[2]);
            if (!isNaN(date.getTime())) {
                return true;
            }
        }
    }
    return false;
}

function validateDate(thenSpl) {
    const year = thenSpl[0];
    const month = thenSpl[1];
    const day = thenSpl[2];
    if (year < 1800 || year > 2200) {
        return false;
    }
    if (month == 2 && day > 29) {
        return false;
    }
    if (month > 12 || month < 1) {
        return false;
    }
    if (day > 31 || day < 1) {
        return false;
    }
    return true;
}

function sendValue(key, value) {
    if (!key || !value) {
        return;
    }
    sendSettingData({
        key: key,
        value: JSON.parse(value)
    });
}

function sendSettingData(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send(data);
    } else {
        console.log("No peerSocket connection");
    }
}