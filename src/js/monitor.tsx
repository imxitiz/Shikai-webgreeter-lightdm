/**
 * @license Shikai
 * monitor.tsx
 *
 * Copyright (c) 2024, TheWisker.
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as Operations from "./Greeter/Operations";

import "../css/tailwind.css";
import "../css/style.scss";

declare global {
	interface Window {
		__is_debug?: boolean;
	}
}

function launch() {
	const wall_callback = (wallpapers: string[]) => {
		document.body.onclick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			const isInteractive = !!target?.closest?.(
				'button, a, input, textarea, select, label, [role="button"]',
			);
			if (e.target === e.currentTarget || !isInteractive) {
				const wallpaper =
					wallpapers[Math.floor(Math.random() * wallpapers.length)];
				document.body.style.backgroundImage = `url('${wallpaper}')`;
				const greeter = (
					window as unknown as {
						greeter_comm?: { broadcast?: (s: string) => void };
					}
				).greeter_comm;
				if (greeter?.broadcast) {
					try {
						greeter.broadcast(wallpaper);
					} catch (err) {
						console.warn("greeter_comm.broadcast failed", err);
					}
				}
			}
		};

		// trigger once to set an initial wallpaper
		document.body.click();
	};

	if (window.__is_debug) {
		const wallpapers = Operations.getWallpapers(
			Operations.getWallpaperDir(),
		) as string[];
		wall_callback(wallpapers);
	} else {
		Operations.getWallpapers(Operations.getWallpaperDir(), wall_callback);
	}
}

window.onload = () => {
	if (!window.__is_debug) {
		if (window.lightdm === undefined) {
			window.addEventListener("GreeterReady", () => {
				launch();
			});
		} else {
			launch();
		}
	} else {
		launch();
	}
};

window.addEventListener("GreeterBroadcastEvent", (evt: Event) => {
	try {
		// `evt` may be a CustomEvent with `detail` or a plain Event with `data` depending on environment
		const evtAny = evt as unknown as { data?: unknown; detail?: unknown };
		const maybeUrl =
			typeof evtAny.data !== "undefined" ? evtAny.data : evtAny.detail;
		if (typeof maybeUrl !== "string") return;
		const url = maybeUrl;
		document.body.style.backgroundImage = `url('${url}')`;
		document.body.style.backgroundSize = "cover";
		// document.body.style.backgroundPosition = "center center";
		document.body.style.backgroundRepeat = "no-repeat";
	} catch (err) {
		console.warn("Failed to apply broadcast background", err);
	}
});
