/**
 * @license Shikai
 * Reducer.js
 *
 * Copyright (c) 2024, TheWisker.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Runtime from "./Reducers/Runtime";
import Settings from "./Reducers/Settings";
import Themes from "./Reducers/Themes";

import Copy from "../Tools/Copy"

export default function(default_state) {
    return (state = default_state, action) => {
        //console.log(action.type, state, "Reducer");
        switch(action.type) {
            case "Theme_Activate":
                return {...state, settings: Copy(state.themes[action.key].settings)};
            case "Set_Logos":
                return {...state, runtime: {...state.runtime, logos: action.payload}};
            default: {
                const newRuntime = Runtime(state.runtime, action);
                const newSettings = Settings(state.settings, action);
                const newThemes = Themes(state, action);

                // Validate returned slice shapes to avoid reducers accidentally returning non-objects
                const runtimeSafe = (newRuntime && typeof newRuntime === 'object') ? newRuntime : state.runtime;
                const settingsSafe = (newSettings && typeof newSettings === 'object' && !Array.isArray(newSettings)) ? newSettings : state.settings;
                const themesSafe = Array.isArray(newThemes) ? newThemes : state.themes;

                return {
                    ...state,
                    runtime: runtimeSafe,
                    settings: settingsSafe,
                    themes: themesSafe
                };
            }
        }
    }
}