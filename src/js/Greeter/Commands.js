/**
 * @license Shikai
 * Commands.js
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {types as classicTypes, notify as classicNotify} from "./Notifications";
import {types as modernTypes, notify as modernNotify} from "./ModernNotifications";
import {get_lang, data} from "../../lang";

// Detect which notification system to use based on available DOM elements
function getNotifySystem() {
    const modernRoot = document.getElementById("notificationroot");
    if (modernRoot) {
        return { types: modernTypes, notify: modernNotify };
    }
    return { types: classicTypes, notify: classicNotify };
}

function execute(bool, message, callback) {
    const { types, notify } = getNotifySystem();
    if (bool) {
        notify(message, types.Info);
        if (window.__is_debug != true) {setTimeout(() => {callback();}, 1000);}
    } else {notify(data.get(get_lang(), "commands.messages.unavailable"), types.Warning);}
}

export function sleep() {return execute(lightdm.can_suspend, data.get(get_lang(), "commands.messages.sleep"), lightdm.suspend);}
export function restart() {return execute(lightdm.can_restart, data.get(get_lang(), "commands.messages.reboot"), lightdm.restart);}
export function shutdown() {return execute(lightdm.can_shutdown, data.get(get_lang(), "commands.messages.shutdown"), lightdm.shutdown);}
export function hibernate() {return execute(lightdm.can_hibernate, data.get(get_lang(), "commands.messages.hibernate"), lightdm.hibernate);}
