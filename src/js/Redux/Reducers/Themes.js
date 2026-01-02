/**
 * @license Shikai
 * Themes.js
 *
 * Copyright (c) 2024, TheWisker.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Copy from "../../Tools/Copy"
import { saveThemes, getThemes } from "../../Greeter/Storage";

export default function Themes(state = {}, action) {
    switch (action.type) {
        case "Theme_Purge": return [];
        case "Theme_Add": {
            const themes = Copy(state.themes || []);
            themes.push({ name: action.value, settings: Copy(state.settings || {}) });
            return themes;
        }
        case "Theme_Remove": {
            const themes = Copy(state.themes || []);
            if (themes.length > action.key) { themes.splice(action.key, 1); }
            return themes;
        }
        case "Themes_Save":{
            // Persist themes but ensure reducer returns the themes slice
            saveThemes(state.themes || []);
            return state.themes || [];
        }
        case "Themes_Update": {
            const value = getThemes();
            return (value == null) ? (state.themes || []) : value;
        }
        default:
            return state.themes || [];
    }
}