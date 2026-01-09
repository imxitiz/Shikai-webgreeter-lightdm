/* revealTransition — universal reveal animation for ANY state change

Usage: revealTransition(callback, { x, y, duration, easing })
Works for backgrounds, themes, colors, ANY DOM change via View Transitions API.
The callback is executed inside the VT, so the browser animates the before/after.

Examples:
  revealTransition(() => { body.style.backgroundImage = url }, { x, y })
  revealTransition(() => { toggleTheme(); setMode(...) }, { x, y })
  revealTransition(() => { element.classList.toggle('active') })
*/

type RevealOpts = { 
	x?: number; 
	y?: number; 
	duration?: number; 
	easing?: string;
};

let _lastPointer = { x: 0, y: 0 };
let _isTransitioning = false;

if (typeof document !== "undefined") {
	document.addEventListener("pointermove", (e: PointerEvent) => {
		_lastPointer = { x: e.clientX, y: e.clientY };
	}, { passive: true });
}

export default async function revealTransition(
	callback: () => void,
	opts: RevealOpts = {},
): Promise<void> {
	// Prevent concurrent transitions
	if (_isTransitioning) return;
	_isTransitioning = true;

	try {
		const duration = opts.duration ?? 2000;
		const easing = opts.easing ?? "cubic-bezier(0.34, 0, 0.66, 1)";
		const vw = window.innerWidth || 1920;
		const vh = window.innerHeight || 1080;
		const cx = opts.x ?? _lastPointer.x ?? vw / 2;
		const cy = opts.y ?? _lastPointer.y ?? vh / 2;
		const xp = Math.min(100, Math.max(0, +(cx / vw * 100).toFixed(2)));
		const yp = Math.min(100, Math.max(0, +(cy / vh * 100).toFixed(2)));

		const root = document.documentElement;

		if (document.startViewTransition) {
			// Set animation origin vars
			root.style.setProperty('--x', `${xp}%`);
			root.style.setProperty('--y', `${yp}%`);
			root.style.setProperty('--reveal-duration', `${duration}ms`);
			root.style.setProperty('--reveal-easing', easing);

			const vt = document.startViewTransition(callback);
			
			await vt.finished;

			// Cleanup animation vars (keep DOM changes from callback)
			root.style.removeProperty('--x');
			root.style.removeProperty('--y');
			root.style.removeProperty('--reveal-duration');
			root.style.removeProperty('--reveal-easing');
		} else {
			// Fallback: immediate execution without animation
			callback();
		}
	} finally {
		_isTransitioning = false;
	}
}
