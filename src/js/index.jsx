/**
 * @license Shikai
 * js/index.jsx
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import "../assets/index.yml";
import "../css/style.scss";

import React from "react";
import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";

import Store from "./Redux/Store";
import LoginWindow from "./Components/LoginWindow";
import SettingsWindow from "./Components/SettingsWindow";

import * as Operations from "./Greeter/Operations";
import {types, notify} from "./Greeter/Notifications";
import Idle from "./Greeter/Idle";
import {set_lang, data, get_lang} from "../lang";

function launch() {
    if ((!window.__is_debug)) {lightdm = window.lightdm;}

    const store = Store();

    // Load saved settings immediately (so theme and style survive greeter reloads)
    try { store.dispatch({ type: "Settings_Update" }); } catch (err) { console.warn('Settings_Update dispatch failed', err); }

    createRoot(document.getElementById("loginroot")).render((
        <Provider store={store}>
            <LoginWindow/>
        </Provider>
    ));

    // Persist settings on change (debounced)
    let _lastSettingsJSON = JSON.stringify(store.getState().settings || {});
    let _settingsSaveTimer = null;
    const scheduleSave = () => {
        clearTimeout(_settingsSaveTimer);
        _settingsSaveTimer = setTimeout(() => {
            try {
                const current = JSON.stringify(store.getState().settings || {});
                if (current !== _lastSettingsJSON) {
                    _lastSettingsJSON = current;
                    import("./Greeter/Storage").then(({ saveSettings }) => { saveSettings(store.getState().settings); }).catch((e) => console.warn('Failed to import saveSettings', e));
                }
            } catch (err) { console.warn('Failed to persist settings', err); }
        }, 150);
    };
    store.subscribe(scheduleSave);

    createRoot(document.getElementById("settingroot")).render((
        <Provider store={store}>
            <SettingsWindow/>
        </Provider>
    ));
    
    let wall_callback = (wallpapers) => {
        document.body.onclick = (e) => {
            console.log("Body clicked, changing wallpaper");
            console.log(e.target);
									// Avoid changing wallpaper when clicking in interactive UI regions
									if (e.target?.closest?.(".no-wall-change"))
										return;
									const isInteractive =
										e.target?.closest &&
										e.target.closest(
											'button, a, input, textarea, select, label, [role="button"]',
										);
									if (e.target === e.currentTarget || !isInteractive) {
										const wallpaper =
											wallpapers[Math.floor(Math.random() * wallpapers.length)];
										document.body.style.backgroundImage = `url('${wallpaper}')`;
										if (typeof greeter_comm !== "undefined" && greeter_comm) {
											greeter_comm.broadcast(wallpaper);
										}
									}
								};
								document.body.click();
    }
    try {
        // Restore last wallpaper if present
        try {
            const last = localStorage.getItem('CurrentWallpaper');
            if (last) {
                document.body.style.backgroundImage = `url('${last}')`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center center';
                document.body.style.backgroundRepeat = 'no-repeat';
                document.body.classList.add('has-wallpaper');
            }
        } catch (err) { /* ignore */ }

        if (window.__is_debug) {
            wall_callback(Operations.getWallpapers(Operations.getWallpaperDir()));
        } else {
            Operations.getWallpapers(Operations.getWallpaperDir(), wall_callback);
        }
    } catch (err) { console.warn('Failed to load wallpapers', err); wall_callback(["./assets/media/wallpapers/Wallpaper01.jpg"]); }

    try {
        Operations.getLogos(Operations.getLogosDir(), (dt) => store.dispatch({type: "Set_Logos", payload: dt}));
    } catch (err) { console.warn('Failed to load logos', err); }

    // Theme sync
				const setTheme = (isDark) => {
					document.documentElement.setAttribute(
						"data-theme",
						isDark ? "dark" : "light",
					);
				};
				let lastTheme = store.getState().settings.behaviour.dark_mode;
				setTheme(lastTheme);

    let idle;
				try {
					idle = new Idle((t) => {
						store.dispatch(t);
					}); //Listens for idle event
					if (idle && typeof idle.changeTimeout === "function") {
						idle.changeTimeout(
							store.getState().settings.behaviour.idle.timeout,
						);
					}
					if (store.getState().settings.behaviour.idle.enabled) {
						if (idle && typeof idle.start === "function") {
							try {
								idle.start();
							} catch (e) {
								console.error("Idle.start() failed:", e);
							}
						} else {
							console.warn("Idle not available, skipping idle startup.");
						}
					}
				} catch (e) {
					console.error("Failed to initialize Idle:", e);
					idle = null;
				}

    let last_lang;
    let idle_timeout;
    let failure_timeout;
    let last_event = true;
    let idle_enabled = store.getState().settings.behaviour.idle.enabled;
    store.subscribe(() => {
					// Sync theme
					try {
						const isDark = store.getState().settings.behaviour.dark_mode;
						if (isDark !== lastTheme) {
							lastTheme = isDark;
							setTheme(isDark);
						}
					} catch (err) {
						console.warn("Error syncing theme from store", err);
					}

try {
				let icons = store.getState().settings.style.main.icons;
				if (document.styleSheets && document.styleSheets.length > 0) {
					const stylesheet = document.styleSheets[0];
					const changeClassProperty = (selector, property, value) => {
						try {
							if (!stylesheet.cssRules) return;
							for (let i = 0; i < stylesheet.cssRules.length; i++) {
								if (stylesheet.cssRules[i].selectorText === selector) {
									stylesheet.cssRules[i].style.setProperty(property, value);
									break;
								}
							}
						} catch (err) {
							// Some environments restrict stylesheet access
							console.warn('Unable to update stylesheet rules', err);
						}
					};
					changeClassProperty(".SVGBackground", "fill", icons.background);
					changeClassProperty(".SVGPath", "fill", icons.foreground);
				}
			} catch (err) {
				console.warn('Error syncing icon colors', err);
			}

					const loginroot = document.getElementById("loginroot");
					if (last_event != store.getState().runtime.events.inactivity) {
						if (store.getState().runtime.events.inactivity) {
							loginroot.style.transform =
								"translate(" +
								(window.innerWidth + loginroot.offsetWidth) +
								"px, 0)";
						} else {
							loginroot.classList.add("notransition");
							loginroot.style.transform =
								"translate(" +
								(-window.innerWidth - loginroot.offsetWidth) +
								"px, 0)";
							loginroot.offsetHeight; //Force reflow
							loginroot.classList.remove("notransition");
							loginroot.style.transform = "translate(0, 0)";
						}
						last_event = store.getState().runtime.events.inactivity;
					}

					if (!store.getState().runtime.events.inactivity) {
						if (store.getState().runtime.events.loginSuccess) {
							loginroot.style.transform = "scale(0.4)";
							loginroot.style.opacity = "0";
							if (window.__is_debug) {
								setTimeout(() => {
									location.reload();
								}, 1500);
							}
						} else if (store.getState().runtime.events.loginFailure) {
							loginroot.style.transform = "scale(0.8)";
							clearInterval(failure_timeout);
							failure_timeout = setTimeout(() => {
								loginroot.style.transform = "scale(1)";
								store.dispatch({ type: "Stop_Event", key: "loginFailure" });
							}, 500);
						}
					}

					if (
						idle_enabled != store.getState().settings.behaviour.idle.enabled
					) {
						idle_enabled = store.getState().settings.behaviour.idle.enabled;
						if (idle_enabled) {
							idle.start();
						} else {
							idle.stop();
						}
					}

					if (
						idle_timeout != store.getState().settings.behaviour.idle.timeout
					) {
						idle_timeout = store.getState().settings.behaviour.idle.timeout;
						idle.changeTimeout(idle_timeout);
					}

					if (last_lang != store.getState().settings.behaviour.language) {
						last_lang = store.getState().settings.behaviour.language;
						set_lang(last_lang);
					}
				});

    if (window.__is_debug === true) {
        setInterval(() => {
            const hints = data.get(get_lang(), "demo.hints");
            notify(data.get(get_lang(), "demo.hint") + " " + hints[Math.floor(Math.random() * hints.length)], types.Info);
        }, 10 * 1000);
        setTimeout(() => {
            notify(data.get(get_lang(), "demo.notifications.info"), types.Info);
            setTimeout(() => {
                notify(data.get(get_lang(), "demo.notifications.success"), types.Success);
                setTimeout(() => {
                    notify(data.get(get_lang(), "demo.notifications.warning"), types.Warning);
                    setTimeout(() => {
                        notify(data.get(get_lang(), "demo.notifications.error"), types.Error);
                    }, 500);
                }, 500);
            }, 500);
        }, 1500);
    }
};

window.onload = () => {
    if (!window.__is_debug) {
        if (window.lightdm === undefined) {
            window.addEventListener("GreeterReady", () => {launch();});
        } else {launch();}
    } else {launch();}
}

window.addEventListener("GreeterBroadcastEvent", (e) => {
    try {
        document.body.style.backgroundImage = "url('" + e.data + "')";
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundRepeat = 'no-repeat';
        try { localStorage.setItem('CurrentWallpaper', e.data); } catch (e) { /* ignore */ }
    } catch (err) { console.warn('Failed to apply broadcast background', err); }
});
