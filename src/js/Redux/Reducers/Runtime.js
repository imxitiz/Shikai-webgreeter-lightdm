/**
 * @license Shikai
 * Runtime.js
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Helper to safely get users array
function getUsers() {
    if (typeof lightdm === 'undefined' || !lightdm) {
        return [{ username: 'user', display_name: 'User', session: 'plasma', image: '' }];
    }
    return lightdm.users || [];
}

// Helper to safely get sessions array
function getSessions() {
    if (typeof lightdm === 'undefined' || !lightdm) {
        return [{ name: 'Plasma', key: 'plasma', type: 'x11' }];
    }
    return lightdm.sessions || [];
}

export default function Runtime(state, action) {
    const users = getUsers();
    const sessions = getSessions();
    
    switch (action.type) {
        case "Switch_User": {
            if (action.value) {
                console.debug('Runtime reducer: Switch_User (direct)', action.value);
                return {...state, user: action.value};
            }
            const userIndex = users.findIndex(u => u.username === state.user?.username);
            if (userIndex === users.length - 1 || userIndex === -1) {
                console.debug('Runtime reducer: Switch_User (wrap to 0)', users[0]);
                return {...state, user: users[0]};
            }
            console.debug('Runtime reducer: Switch_User (next)', users[userIndex + 1]);
            return {...state, user: users[userIndex + 1]};
        }
        case "Switch_Session": {
            if (action.value) {
                return {...state, session: action.value};
            }
            const sessionIndex = sessions.findIndex(s => s.key === state.session?.key);
            if (sessionIndex === sessions.length - 1 || sessionIndex === -1) {
                return {...state, session: sessions[0]};
            }
            return {...state, session: sessions[sessionIndex + 1]};
        }
        case "Start_Event": {
            const events = {...state.events};
            events[action.key] = true;
            return {...state, events: events};
        }
        case "Stop_Event": {
            const events = {...state.events};
            events[action.key] = false;
            return {...state, events: events};
        }
        default:
            return state;
    }
}
