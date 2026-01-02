/**
 * Storage.js
 *
 *
 */

function saveItem(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
        console.warn('localStorage.setItem failed for key', key, err);
    }
    return data;
}

function getItem(key) {
    try {
        let item = localStorage.getItem(key);
        if (item != null && item != undefined && item != "null" && item != "undefined" && item != "") {return JSON.parse(item);}    
    } catch (err) {
        console.warn('localStorage.getItem failed for key', key, err);
    }
    return null;
}

export function saveSettings(data) {return saveItem("Settings", data);} 
export function getSettings() {return getItem("Settings");}

export function saveThemes(data) {return saveItem("Themes", data);} 
export function getThemes() {return getItem("Themes");}
