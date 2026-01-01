/**
 * @license Shikai
 * LoginWindow/Modern/index.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useCallback, useEffect } from "react";
import Draggable from "react-draggable";

import ModernSidebar from "./ModernSidebar";
import ModernUserPanel from "./ModernUserPanel";
import { cn } from "@/js/lib/utils";

// Define your desired aspect ratio (3:2 = 1.5)
const ASPECT_RATIO = 920 / 620; // 1.4838...

const getWindowSize = () => {
	const screenWidth = screen?.availWidth || 1024;
	const screenHeight = screen?.availHeight || 768;

	// 1. Determine target width (90% of screen, capped at 920)
	let width = Math.min(920, Math.floor(screenWidth * 0.9));

	// 2. Calculate height based on the ratio
	let height = Math.floor(width / ASPECT_RATIO);

	// 3. Safety Check: If calculated height is too tall for the screen,
	// scale down based on height instead
	if (height > screenHeight * 0.9) {
		height = Math.floor(screenHeight * 0.9);
		width = Math.floor(height * ASPECT_RATIO);
	}

	return { width, height };
};

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = getWindowSize();

function clamp(v, a, b) {
	return Math.max(a, Math.min(b, v));
}

export default function ModernLoginWindow() {
	// safe screen sizes (greeter env may not expose full screen.* info)
	const availWidth =
		typeof screen !== "undefined" && screen.availWidth
			? screen.availWidth
			: window.innerWidth || 800;
	const availHeight =
		typeof screen !== "undefined" && screen.availHeight
			? screen.availHeight
			: window.innerHeight || 600;

	const bounds = {
		left: -(availWidth / 2 - WINDOW_WIDTH / 2),
		right: availWidth / 2 - WINDOW_WIDTH / 2,
		top: -(availHeight / 2 - WINDOW_HEIGHT / 2),
		bottom: availHeight / 2 - WINDOW_HEIGHT / 2,
	};

	const [position, setPosition] = useState(() => {
		try {
			const saved = localStorage.getItem("LoginDrag");
			if (saved) {
				const parsed = JSON.parse(saved);
				const x = Number(parsed.x) || 0;
				const y = Number(parsed.y) || 0;
				// clamp into bounds to avoid off-screen positions
				return {
					x: clamp(x, bounds.left, bounds.right),
					y: clamp(y, bounds.top, bounds.bottom),
				};
			}
		} catch (err) {
			console.warn(
				"Failed to read LoginDrag from storage, using default position",
				err,
			);
		}
		return { x: 0, y: 0 };
	});

	const [isAnimating, setIsAnimating] = useState(false);

	const handleDrag = useCallback(
		(_, data) => {
			setPosition({
				x: clamp(data.x, bounds.left, bounds.right),
				y: clamp(data.y, bounds.top, bounds.bottom),
			});
		},
		[bounds.left, bounds.right, bounds.top, bounds.bottom],
	);

	const handleDragStop = useCallback(
		(_, data) => {
			const x = clamp(data.x, bounds.left, bounds.right);
			const y = clamp(data.y, bounds.top, bounds.bottom);
			localStorage.setItem("LoginDrag", JSON.stringify({ x, y }));
			setPosition({ x, y });
		},
		[bounds.left, bounds.right, bounds.top, bounds.bottom],
	);

	const handleRecenter = useCallback(() => {
		setIsAnimating(true);
		setPosition({ x: 0, y: 0 });
		localStorage.setItem("LoginDrag", JSON.stringify({ x: 0, y: 0 }));
		setTimeout(() => setIsAnimating(false), 400);
	}, []);

	// Keep position clamped after resize (some greeter environments change viewport)
	useEffect(() => {
		const onResize = () => {
			const availW =
				typeof screen !== "undefined" && screen.availWidth
					? screen.availWidth
					: window.innerWidth || 800;
			const availH =
				typeof screen !== "undefined" && screen.availHeight
					? screen.availHeight
					: window.innerHeight || 600;
			const left = -(availW / 2 - WINDOW_WIDTH / 2);
			const right = availW / 2 - WINDOW_WIDTH / 2;
			const top = -(availH / 2 - WINDOW_HEIGHT / 2);
			const bottom = availH / 2 - WINDOW_HEIGHT / 2;
			const x = clamp(position.x, left, right);
			const y = clamp(position.y, top, bottom);
			if (x !== position.x || y !== position.y) {
				setPosition({ x, y });
				localStorage.setItem("LoginDrag", JSON.stringify({ x, y }));
			}
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [position]);

	// Dynamic corner radius based on position
	const getCornerRadius = () => {
		const atLeft = position.x === bounds.left;
		const atRight = position.x === bounds.right;
		const atTop = position.y === bounds.top;
		const atBottom = position.y === bounds.bottom;

		return {
			borderTopLeftRadius: atLeft || atTop ? "0px" : undefined,
			borderTopRightRadius: atRight || atTop ? "0px" : undefined,
			borderBottomLeftRadius: atLeft || atBottom ? "0px" : undefined,
			borderBottomRightRadius: atRight || atBottom ? "0px" : undefined,
		};
	};

	return (
		<Draggable
			axis="both"
			handle=".login-handle"
			bounds={bounds}
			position={position}
			onDrag={handleDrag}
			onStop={handleDragStop}
			id="login-drag"
		>
			<div
				className={cn(
					"fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 no-wall-change",
					isAnimating && "transition-transform duration-400 ease-out",
				)}
				style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT }}
			>
				{/* Main Window Container */}
				<div
					className={cn(
						"relative w-full h-full flex overflow-hidden text-base",
						"rounded-3xl shadow-2xl",
						"border border-border/50",
						"bg-card/70 backdrop-blur-sm",
						"animate-scale-in",
					)}
					style={getCornerRadius()}
				>
					{/* Ambient Glow Effects */}
					<div className="absolute -top-32 -left-32 w-64 h-64 -z-10 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
					<div className="absolute -bottom-32 -right-32 w-64 h-64 -z-10 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

					{/* Sidebar */}
					<ModernSidebar />

					{/* User Panel */}
					<ModernUserPanel onRecenter={handleRecenter} />
				</div>
			</div>
		</Draggable>
	);
}
