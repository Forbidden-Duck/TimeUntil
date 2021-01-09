import { THEMES } from "../themes.js";

let document;

export function loadDocument(doc) {
    document = doc;
}

export function loadTheme(themeID) {
    if (!document) {
        return;
    }
    const theme = THEMES[themeID];
    if (!theme) {
        console.log(`Failed to find theme: ${themeID}`);
        loadTheme("default");
        return;
    }
    loadType(["back", theme.back]);
    loadType(["fill", theme.fill]);
    loadType(["fillOut", theme.fillOut]);
    if (theme.text) {
        loadType(["text", theme.text]);
    }
}

function loadType(type) {
    const elements = document.getElementsByClassName(type[0]);
    elements.forEach((ele, i) => {
        ele.style.fill = type[1];
    });
}