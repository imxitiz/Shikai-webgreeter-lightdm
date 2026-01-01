/**
 * @license Shikai
 * js/modern.jsx
 *
 * Modern entry point for Shikai with Tailwind CSS and shadcn/ui
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import "../assets/index.yml";
import "../css/tailwind.css";
import "../css/style.scss";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import Store from "./Redux/Store";
import ModernLoginWindow from "./Components/LoginWindow/Modern";
import ModernSettings from "./Components/SettingsWindow/Modern";
import ModernBackground from "./Components/Background";
import { TooltipProvider } from "./Components/ui/tooltip";

import * as Operations from "./Greeter/Operations";
import { types, notify } from "./Greeter/ModernNotifications";
import Idle from "./Greeter/Idle";
import { set_lang, data, get_lang } from "../lang";

// Hide loader after app mounts
function hideLoader() {
	// Handle app.html loader
	const loadroot = document.getElementById("loadroot");
	if (loadroot) {
		loadroot.classList.add("hidden");
		setTimeout(() => {
			loadroot.style.display = "none";
		}, 500);
	}
	// Handle modern.html spinner
	const spinner = document.querySelector(".loading-spinner");
	if (spinner) {
		spinner.style.opacity = "0";
		setTimeout(() => {
			spinner.remove();
		}, 300);
	}
}

function ModernApp({ store }) {
	useEffect(() => {
		// Hide loader when app mounts
		hideLoader();
	}, []);

	return (
		<Provider store={store}>
			<TooltipProvider>
				<ModernBackground>
					<ModernLoginWindow />
					<ModernSettings />
				</ModernBackground>
			</TooltipProvider>
		</Provider>
	);
}

function launch() {
	if (!window.__is_debug) {
		lightdm = window.lightdm;
	}

	// Global error handlers to capture greeter runtime issues (logs appear in seat0-greeter.log)
	window.addEventListener('error', (e) => {
		console.error('Uncaught error', e.error || e.message || e);
	});
	window.addEventListener('unhandledrejection', (e) => {
		console.error('Unhandled promise rejection', e.reason || e);
	});

	const store = Store();
	// Expose store for debugging (removed before production)
	window.__store = store;
	// Load saved settings immediately so UI reflects persisted choices in greeter
	try { store.dispatch({ type: "Settings_Update" }); } catch (err) { console.warn('Settings_Update dispatch failed', err); }

	// Create the modern React app
	const root = createRoot(document.getElementById("root"));
	root.render(<ModernApp store={store} />);

	// Persist settings on change (debounced)
	import.meta?.env?.MODE; // keep bundlers happy about top-level imports
	let _lastSettingsJSON = JSON.stringify(store.getState().settings || {});
	let _settingsSaveTimer = null;
	const scheduleSave = () => {
		clearTimeout(_settingsSaveTimer);
		_settingsSaveTimer = setTimeout(() => {
			try {
				const current = JSON.stringify(store.getState().settings || {});
				if (current !== _lastSettingsJSON) {
					_lastSettingsJSON = current;
					import("./Greeter/Storage").then(({ saveSettings }) => {
						saveSettings(store.getState().settings);
					}).catch((e) => console.warn('Failed to import saveSettings', e));
				}
			} catch (err) { console.warn('Failed to persist settings', err); }
		}, 150);
	};
	store.subscribe(scheduleSave);

	// Wallpaper handling
	const wallCallback = (wallpapers) => {
		document.body.onclick = (e) => {
			// Use composedPath to detect interactive ancestors (handles SVG elements with pointer-events:none)
			const path = e.composedPath ? e.composedPath() : (e.path || []);
			const isInteractive =
				(e.target?.closest && e.target.closest('button, a, input, textarea, select, label, [role="button"]')) ||
				(path && path.some((el) => el && el.nodeType === 1 && el.matches && el.matches('button, a, input, textarea, select, label, [role="button"]')));

			// Also detect areas that explicitly opt-out of wallpaper changes (class="no-wall-change")
			const inNoWall = (e.target?.closest && e.target.closest('.no-wall-change')) ||
				(path && path.some((el) => el && el.nodeType === 1 && el.classList && el.classList.contains && el.classList.contains('no-wall-change')));

			// Only change wallpaper when clicking in non-interactive areas AND outside any no-wall-change elements
			if (!isInteractive && !inNoWall) {
				const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
				document.body.style.backgroundImage = `url('${wallpaper}')`;
				document.body.style.backgroundSize = 'cover';
				document.body.style.backgroundPosition = 'center center';
				document.body.style.backgroundRepeat = 'no-repeat';
				document.body.classList.add('has-wallpaper');
				try { localStorage.setItem('CurrentWallpaper', wallpaper); } catch (err) { /* ignore */ }
				if (typeof greeter_comm !== 'undefined' && greeter_comm) {
					try { greeter_comm.broadcast(wallpaper); } catch (err) { console.warn('greeter_comm.broadcast failed', err); }
				}
			}
		};

		// Ensure an initial wallpaper is set (avoid synthetic click to prevent accidental handlers)
		if (!document.body.style.backgroundImage) {
			const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
			document.body.style.backgroundImage = `url('${wallpaper}')`;
			document.body.style.backgroundSize = 'cover';
			document.body.style.backgroundPosition = 'center center';
			document.body.style.backgroundRepeat = 'no-repeat';
			document.body.classList.add('has-wallpaper');
			try { localStorage.setItem('CurrentWallpaper', wallpaper); } catch (err) { /* ignore */ }
			if (typeof greeter_comm !== 'undefined' && greeter_comm) {
				try { greeter_comm.broadcast(wallpaper); } catch (err) { /* ignore */ }
			}
		}
	};


	try {
		// Restore last wallpaper if present
		try {
			const last = localStorage.getItem('CurrentWallpaper');
			if (last) {
				document.body.style.backgroundImage = `url('${last}')`;
				document.body.style.backgroundSize = 'cover';
				document.body.style.backgroundPosition = 'center center';
				document.body.style.backgroundRepeat = 'no-repeat';
			}
		} catch (err) { /* ignore */ }

		if (window.__is_debug) {
			wallCallback(Operations.getWallpapers(Operations.getWallpaperDir()));
		} else {
			Operations.getWallpapers(Operations.getWallpaperDir(), wallCallback);
		}
	} catch (err) {
		console.warn('Failed to load wallpapers', err);
		// fallback to a small set of embedded wallpapers
		wallCallback(["./assets/media/wallpapers/Wallpaper01.jpg"]);
	}

	// Set initial theme mode based on settings and keep in sync
	const setTheme = (isDark) => {
		document.documentElement.setAttribute(
			"data-theme",
			isDark ? "dark" : "light",
		);
	};
	let lastTheme = store.getState().settings.behaviour.dark_mode;
	setTheme(lastTheme);

	Operations.getLogos(Operations.getLogosDir(), (dt) =>
		store.dispatch({ type: "Set_Logos", payload: dt }),
	);

	// Idle handling
	const idle = new Idle((t) => store.dispatch(t));
	idle.changeTimeout(store.getState().settings.behaviour.idle.timeout);
	if (store.getState().settings.behaviour.idle.enabled) {
		idle.start();
	}

	let lastLang;
	let idleTimeout;
	let idleEnabled = store.getState().settings.behaviour.idle.enabled;

	store.subscribe(() => {
		const state = store.getState();

		// Handle idle settings changes
		if (idleEnabled !== state.settings.behaviour.idle.enabled) {
			idleEnabled = state.settings.behaviour.idle.enabled;
			if (idleEnabled) {
				idle.start();
			} else {
				idle.stop();
			}
		}

		if (idleTimeout !== state.settings.behaviour.idle.timeout) {
			idleTimeout = state.settings.behaviour.idle.timeout;
			idle.changeTimeout(idleTimeout);
		}

		// Handle language changes
		if (lastLang !== state.settings.behaviour.language) {
			lastLang = state.settings.behaviour.language;
			set_lang(lastLang);
		}

		// Handle theme mode changes
		lastTheme = state.settings.behaviour.dark_mode;
		setTheme(lastTheme);

		// Handle successful login
		if (state.runtime.events.loginSuccess && !window.__is_debug) {
			// Start the session
			const session = state.runtime.session;
			if (session && lightdm) {
				lightdm.start_session(session.key);
			}
		}
	});

	// Debug mode notifications
	if (window.__is_debug === true) {
		setInterval(() => {
			const hints = data.get(get_lang(), "demo.hints");
			if (hints && hints.length > 0) {
				const hintPrefix = data.get(get_lang(), "demo.hint") || "Hint:";
				notify(
					hintPrefix + " " + hints[Math.floor(Math.random() * hints.length)],
					types.Info,
				);
			}
		}, 15 * 1000);

		setTimeout(() => {
			const infoMsg = data.get(get_lang(), "demo.notifications.info");
			if (infoMsg) notify(infoMsg, types.Info);
			setTimeout(() => {
				const successMsg = data.get(get_lang(), "demo.notifications.success");
				if (successMsg) notify(successMsg, types.Success);
				setTimeout(() => {
					const warningMsg = data.get(get_lang(), "demo.notifications.warning");
					if (warningMsg) notify(warningMsg, types.Warning);
					setTimeout(() => {
						const errorMsg = data.get(get_lang(), "demo.notifications.error");
						if (errorMsg) notify(errorMsg, types.Error);
					}, 500);
				}, 500);
			}, 500);
		}, 1500);
	}
}

// Launch when ready
window.onload = () => {
	if (!window.__is_debug) {
		if (window.lightdm === undefined) {
			window.addEventListener("GreeterReady", () => launch());
		} else {
			launch();
		}
	} else {
		launch();
	}
};

// Handle wallpaper broadcast
window.addEventListener("GreeterBroadcastEvent", (e) => {
	try {
		document.body.style.backgroundImage = `url('${e.data}')`;
		document.body.style.backgroundSize = 'cover';
		document.body.style.backgroundPosition = 'center center';
		document.body.style.backgroundRepeat = 'no-repeat';
		document.body.classList.add('has-wallpaper');
		try { localStorage.setItem('CurrentWallpaper', e.data); } catch (err) { /* ignore */ }
	} catch (err) { console.warn('Failed to apply broadcast background', err); }
});
