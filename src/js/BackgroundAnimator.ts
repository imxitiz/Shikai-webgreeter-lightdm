/* revealElement — minimal reveal animation for any element

Usage: revealElement(target, cssValue, { x, y, duration, easing })
Works for backgrounds, themes, colors, anything CSS-driven via View Transitions API.
Key: CSS vars (--x, --y) must be set as inline style before VT snapshot.
*/

type RevealOpts = { x?: number; y?: number; duration?: number; easing?: string };

let lastPointer = { x: 0, y: 0 };
let isTransitioning = false;

if (typeof document !== "undefined") {
	document.addEventListener("pointermove", (e: PointerEvent) => {
		lastPointer = { x: e.clientX, y: e.clientY };
	}, { passive: true });
}

export default async function revealElement(
	target: HTMLElement | string,
	cssValue: string,
	opts: RevealOpts = {},
): Promise<void> {
	// Prevent concurrent transitions (VT API blocks them anyway)
	if (isTransitioning) return;
	isTransitioning = true;

	try {
		const el = typeof target === "string" ? document.querySelector(target) as HTMLElement : target;
		if (!el) return;

		const duration = opts.duration ?? 2000; // 2 second reveal
		const easing = opts.easing ?? "cubic-bezier(0.34, 0, 0.66, 1)"; // ease-in-out: slow start, fast middle, slow end
		const vw = window.innerWidth || 1920;
		const vh = window.innerHeight || 1080;
		const cx = opts.x ?? lastPointer.x ?? vw / 2;
		const cy = opts.y ?? lastPointer.y ?? vh / 2;
		const xp = Math.min(100, Math.max(0, +(cx / vw * 100).toFixed(2)));
		const yp = Math.min(100, Math.max(0, +(cy / vh * 100).toFixed(2)));

		const root = document.documentElement;
		const prevInline = root.getAttribute("style") || "";
		const newStyle = `${prevInline}; --x: ${xp}%; --y: ${yp}%; --reveal-duration: ${duration}ms; --reveal-easing: ${easing}`;
		root.setAttribute("style", newStyle);

		if (document.startViewTransition) {
			const vt = document.startViewTransition(() => {
				el.style.backgroundImage = cssValue.startsWith("url") ? cssValue : `url('${cssValue}')`;
				el.classList.add("has-bg");
			});
			
			await vt.finished;
		}

		// Brief delay then restore style
		// await new Promise(r => setTimeout(r, 50));
		root.setAttribute("style", prevInline);
	} finally {
		isTransitioning = false;
	}
}
