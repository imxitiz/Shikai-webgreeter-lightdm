/**
 * @license Shikai
 * js/app.jsx
 *
 * Unified entry point with design mode switching
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import "../assets/index.yml";
import "../css/tailwind.css";
import "../css/style.scss";

import React, { useState, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import Store from "./Redux/Store";

// Hide loader after app mounts
function hideLoader() {
  const loadroot = document.getElementById("loadroot");
  if (loadroot) {
    loadroot.classList.add("hidden");
    setTimeout(() => {
      loadroot.style.display = "none";
    }, 500);
  }
}

// Classic components
import LoginWindow from "./Components/LoginWindow";
import SettingsWindow from "./Components/SettingsWindow";

// Modern components
import ModernLoginWindow from "./Components/LoginWindow/Modern";
import ModernSettings from "./Components/SettingsWindow/Modern";
import ModernBackground from "./Components/Background";
import { TooltipProvider } from "./Components/ui/tooltip";

import * as Operations from "./Greeter/Operations";
import { types, notify } from "./Greeter/ModernNotifications";
import Idle from "./Greeter/Idle";
import { set_lang, data, get_lang } from "../lang";

// Design Mode Context
const DesignModeContext = createContext({
  mode: "modern",
  setMode: () => {},
});

export const useDesignMode = () => useContext(DesignModeContext);

// Design mode storage key
const DESIGN_MODE_KEY = "shikai_design_mode";

function getStoredDesignMode() {
  try {
    const stored = localStorage.getItem(DESIGN_MODE_KEY);
    return stored === "classic" ? "classic" : "modern";
  } catch {
    return "modern";
  }
}

function setStoredDesignMode(mode) {
  try {
    localStorage.setItem(DESIGN_MODE_KEY, mode);
  } catch {
    // Ignore storage errors
  }
}

// Design Mode Switcher Button
function DesignModeSwitcher() {
  const { mode, setMode } = useDesignMode();

  const toggleMode = () => {
    const newMode = mode === "modern" ? "classic" : "modern";
    setMode(newMode);
    setStoredDesignMode(newMode);
    // Reload to apply the new design
    window.location.reload();
  };

  // Common button styles that work in both classic and modern modes
  const buttonStyle = {
    position: "fixed",
    bottom: "24px",
    left: "24px",
    zIndex: 9999,
    padding: "10px 16px",
    borderRadius: "9999px",
    background: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "white",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)"
  };

  return (
    <button
      type="button"
      onClick={toggleMode}
      style={buttonStyle}
      title={`Switch to ${mode === "modern" ? "Classic" : "Modern"} design`}
      onMouseEnter={(e) => {
        e.target.style.background = "rgba(59, 130, 246, 0.7)";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "rgba(0, 0, 0, 0.6)";
        e.target.style.transform = "scale(1)";
      }}
    >
      {mode === "modern" ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Switch to Classic">
            <rect width="18" height="18" x="3" y="3" rx="2"/>
            <path d="M9 3v18"/>
          </svg>
          Switch to Classic
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="Switch to Modern">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
          </svg>
          Switch to Modern
        </>
      )}
    </button>
  );
}

// Classic App Component
function ClassicApp({ store }) {
  useEffect(() => {
    // Hide loader when classic app mounts
    hideLoader();
  }, []);

  return (
    <Provider store={store}>
      <div id="loginroot" className="loginwindow">
        <LoginWindow />
      </div>
      <div id="settingroot">
        <SettingsWindow />
      </div>
      <DesignModeSwitcher />
    </Provider>
  );
}

// Modern App Component
function ModernApp({ store }) {
  useEffect(() => {
    // Hide loader when modern app mounts
    hideLoader();
  }, []);

  return (
    <Provider store={store}>
      <TooltipProvider>
        <ModernBackground>
          <ModernLoginWindow />
          <ModernSettings />
          <DesignModeSwitcher />
        </ModernBackground>
      </TooltipProvider>
    </Provider>
  );
}

// Main App with Design Mode Provider
function App({ store }) {
  const [mode, setMode] = useState(getStoredDesignMode);

  return (
    <DesignModeContext.Provider value={{ mode, setMode }}>
      {mode === "modern" ? (
        <ModernApp store={store} />
      ) : (
        <ClassicApp store={store} />
      )}
    </DesignModeContext.Provider>
  );
}

function launch() {
  if (!window.__is_debug) {
    lightdm = window.lightdm;
  }

  const store = Store();
  // Expose store for debugging in dev
  window.__store = store;

  // Create the React app
  const root = createRoot(document.getElementById("root"));
  root.render(<App store={store} />);

  // Wallpaper handling
  const wallCallback = (wallpapers) => {
    document.body.onclick = (e) => {
      const path = e.composedPath ? e.composedPath() : (e.path || []);
      const isInteractive =
        (e.target?.closest && e.target.closest('button, a, input, textarea, select, label, [role="button"]')) ||
        (path && path.some((el) => el && el.nodeType === 1 && el.matches && el.matches('button, a, input, textarea, select, label, [role="button"]')));

      const inNoWall = (e.target?.closest && e.target.closest('.no-wall-change')) ||
        (path && path.some((el) => el && el.nodeType === 1 && el.classList && el.classList.contains && el.classList.contains('no-wall-change')));

      // Only change when click is in empty background (non-interactive and not in no-wall-change zone)
      if (!isInteractive && !inNoWall) {
        const wallpaper =
          wallpapers[Math.floor(Math.random() * wallpapers.length)];
        document.body.style.backgroundImage = `url('${wallpaper}')`;
        if (typeof greeter_comm !== "undefined" && greeter_comm) {
          greeter_comm.broadcast(wallpaper);
        }
      }
    };

    // Set an initial wallpaper deterministically
    if (!document.body.style.backgroundImage) {
      const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
      document.body.style.backgroundImage = `url('${wallpaper}')`;
      if (typeof greeter_comm !== "undefined" && greeter_comm) {
        try { greeter_comm.broadcast(wallpaper); } catch (err) { /* ignore */ }
      }
    }
  };

  // Theme mode
		const setTheme = (isDark) => {
			document.documentElement.setAttribute(
				"data-theme",
				isDark ? "dark" : "light",
			);
		};
		let lastTheme = store.getState().settings.behaviour.dark_mode;
		setTheme(lastTheme);

		// Keep theme in sync with store
		store.subscribe(() => {
			try {
				const isDark = store.getState().settings.behaviour.dark_mode;
				if (isDark !== lastTheme) {
					lastTheme = isDark;
					setTheme(isDark);
				}
			} catch (err) {
				// defensive: ignore errors during reducer execution or missing state
				console.warn("Error syncing theme from store", err);
			}
		}); 

  if (window.__is_debug) {
    wallCallback(Operations.getWallpapers(Operations.getWallpaperDir()));
  } else {
    Operations.getWallpapers(Operations.getWallpaperDir(), wallCallback);
  }

  Operations.getLogos(Operations.getLogosDir(), (dt) =>
    store.dispatch({ type: "Set_Logos", payload: dt })
  );

  // Idle handling
  const idle = new Idle((t) => store.dispatch(t));
  idle.changeTimeout(store.getState().settings.behaviour.idle.timeout);
  if (store.getState().settings.behaviour.idle.enabled) {
    idle.start();
  }

  let lastLang;
  let idleTimeout;
  let failureTimeout;
  let lastEvent = true;
  let idleEnabled = store.getState().settings.behaviour.idle.enabled;

  store.subscribe(() => {
    const state = store.getState();

    // Handle icon colors for classic mode
    const icons = state.settings.style.main.icons;
    try {
      const stylesheet = document.styleSheets[0];
      const changeClassProperty = (selector, property, value) => {
        for (let i = 0; i < stylesheet.cssRules.length; i++) {
          if (stylesheet.cssRules[i].selectorText === selector) {
            stylesheet.cssRules[i].style.setProperty(property, value);
            break;
          }
        }
      };
      changeClassProperty(".SVGBackground", "fill", icons.background);
      changeClassProperty(".SVGPath", "fill", icons.foreground);
    } catch {
      // Ignore stylesheet errors
    }

    // Handle login window animations for classic mode
    const loginroot = document.getElementById("loginroot");
    if (loginroot) {
      if (lastEvent !== state.runtime.events.inactivity) {
        if (state.runtime.events.inactivity) {
          loginroot.style.transform = `translate(${window.innerWidth + loginroot.offsetWidth}px, 0)`;
        } else {
          loginroot.classList.add("notransition");
          loginroot.style.transform = `translate(${-window.innerWidth - loginroot.offsetWidth}px, 0)`;
          loginroot.offsetHeight; // Force reflow
          loginroot.classList.remove("notransition");
          loginroot.style.transform = "translate(0, 0)";
        }
        lastEvent = state.runtime.events.inactivity;
      }

      if (!state.runtime.events.inactivity) {
        if (state.runtime.events.loginSuccess) {
          loginroot.style.transform = "scale(0.4)";
          loginroot.style.opacity = "0";
          if (window.__is_debug) {
            setTimeout(() => location.reload(), 1500);
          }
        } else if (state.runtime.events.loginFailure) {
          loginroot.style.transform = "scale(0.8)";
          clearInterval(failureTimeout);
          failureTimeout = setTimeout(() => {
            loginroot.style.transform = "scale(1)";
            store.dispatch({ type: "Stop_Event", key: "loginFailure" });
          }, 500);
        }
      }
    }

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

    // Handle successful login for modern mode
    if (state.runtime.events.loginSuccess && !window.__is_debug) {
      const session = state.runtime.session;
      if (session && typeof lightdm !== "undefined" && lightdm) {
        lightdm.start_session(session.key);
      }
    }
  });

  // Debug mode notifications
  if (window.__is_debug === true) {
    setInterval(() => {
      const hints = data.get(get_lang(), "demo.hints");
      if (hints?.length) {
        notify(
          data.get(get_lang(), "demo.hint") + " " + hints[Math.floor(Math.random() * hints.length)],
          types.Info
        );
      }
    }, 15 * 1000);

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
  console.log("Received GreeterBroadcastEvent", e.data);
		try {
			document.body.style.backgroundImage = `url('${e.data}')`;
			document.body.style.backgroundSize = "cover";
			document.body.style.backgroundPosition = "center center";
			document.body.style.backgroundRepeat = "no-repeat";
		} catch (err) {
			console.warn("Failed to apply broadcast background", err);
		}
});
