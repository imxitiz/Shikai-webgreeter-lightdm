/* RevealExamples — How to use revealTransition() for ANY reveal animation

The revealTransition API accepts a callback and works for backgrounds, themes, colors, or ANY DOM change.

API: revealTransition(callback: () => void, opts?: { x?, y?, duration?, easing? })
*/

import revealTransition from "./RevealAnimation";

/* ========== BACKGROUND WALLPAPER (CLICK) ========== */
export function setupWallpaperClick(wallpapers: string[]) {
	document.body.onclick = (e: MouseEvent) => {
		const isInteractive =
			(e.target as HTMLElement)?.closest?.("button, input, a") !== null;
		if (isInteractive) return;

		const wallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];

		revealTransition(
			() => {
				document.body.style.backgroundImage = `url('${wallpaper}')`;
				document.body.classList.add("has-wallpaper");
				try {
					localStorage.setItem("CurrentWallpaper", wallpaper);
				} catch {}
			},
			{
				x: e.clientX,
				y: e.clientY,
				duration: 2000,
			},
		).catch(() => {
			document.body.style.backgroundImage = `url('${wallpaper}')`;
		});
	};
}

/* ========== DARK/LIGHT MODE TOGGLE (FROM SWITCH) ========== */
export function revealThemeToggle(switchEl: HTMLElement, isDark: boolean) {
	const rect = switchEl.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;

	revealTransition(
		() => {
			document.documentElement.classList.toggle("dark", !isDark);
			localStorage.setItem("theme", isDark ? "light" : "dark");
		},
		{ x, y, duration: 1800 },
	).catch(() => {
		document.documentElement.classList.toggle("dark", !isDark);
	});
}

/* ========== COLOR TRANSITION (CLICK REVEALS ACCENT COLOR) ========== */
export function revealColorChange(newAccent: string, clickEvent: MouseEvent) {
	revealTransition(
		() => {
			document.documentElement.style.setProperty("--accent", newAccent);
		},
		{
			x: clickEvent.clientX,
			y: clickEvent.clientY,
			duration: 1200,
		},
	);
}

/* ========== PANEL/DIALOG BACKGROUND CHANGE ========== */
export function revealPanelBg(panelSelector: string, imageUrl: string) {
	const panel = document.querySelector(panelSelector) as HTMLElement;
	if (!panel) return;

	revealTransition(
		() => {
			panel.style.backgroundImage = `url('${imageUrl}')`;
			panel.classList.add("loaded");
		},
		{
			duration: 1800,
		},
	).catch(() => {
		panel.style.backgroundImage = `url('${imageUrl}')`;
	});
}

/* ========== BROADCAST WALLPAPER (RECEIVED FROM SYSTEM) ========== */
export function applyBroadcastWallpaper(url: string) {
	// Center reveal (no click origin) since it's system-initiated
	revealTransition(
		() => {
			document.body.style.backgroundImage = `url('${url}')`;
			document.body.classList.add("has-wallpaper");
			try {
				localStorage.setItem("CurrentWallpaper", url);
			} catch {}
		},
		{
			duration: 2500, // slow reveal for system broadcast
		},
	).catch(() => {
		document.body.style.backgroundImage = `url('${url}')`;
	});
}