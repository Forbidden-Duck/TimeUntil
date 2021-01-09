import * as fs from "fs";

const CONFIG_NAME = "timeUntil.json";
let CONFIG = {};

export function set(key, value) {
    CONFIG[key] = value;
}

export function get(key) {
    return CONFIG[key];
}

export function load() {
    try {
        CONFIG = fs.readFileSync(CONFIG_NAME, "json");
        return true;
    } catch (err) {
        console.warn(`Failed to read: ${CONFIG_NAME}`);
        return false;
    }
}

export function save() {
    try {
        fs.writeFileSync(CONFIG_NAME, CONFIG, "json");
        return true;
    } catch (err) {
        console.warn(`Failed to write: ${CONFIG_NAME}`);
        return false;
    }
}