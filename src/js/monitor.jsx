/**
 * @license Shikai
 * monitor.jsx
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import "../css/monitor.scss";

import * as Operations from "./Greeter/Operations";

function launch() {
    let wall_callback = (wallpapers) => {
        document.body.onclick = (e) => {
            const isInteractive =
													e.target?.closest &&
													e.target.closest(
														'button, a, input, textarea, select, label, [role="button"]',
													);
												if (e.target === e.currentTarget || !isInteractive) {
													let wallpaper =
														wallpapers[
															Math.floor(Math.random() * wallpapers.length)
														];
													document.body.style.backgroundImage =
														"url('" + wallpaper + "')";
													if (greeter_comm) {
														greeter_comm.broadcast(wallpaper);
													}
												}
        };
        document.body.click();
    }
    if (window.__is_debug) {
        wall_callback(Operations.getWallpapers(Operations.getWallpaperDir()));
    } else {
        Operations.getWallpapers(Operations.getWallpaperDir(), wall_callback);
    };
}

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
    } catch (err) { console.warn('Failed to apply broadcast background', err); }
});
