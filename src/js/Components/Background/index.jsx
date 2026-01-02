/**
 * Background/index.jsx
 *
 * Modern animated background component
 *  
 */

import { useState, useEffect } from "react";
import { cn } from "@/js/lib/utils";

export default function ModernBackground({ children }) {
	const [mounted, setMounted] = useState(false);
	const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'dark');

	useEffect(() => {
		setMounted(true);

		// Observe theme changes on <html data-theme="..."> and update local state so overlay adapts
		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				if (m.attributeName === 'data-theme') {
					setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
				}
			}
		});
		mo.observe(document.documentElement, { attributes: true });
		return () => mo.disconnect();
	}, []);

	return (
		<div className="relative w-full h-full overflow-hidden">
			{/* Gradient Overlay (theme aware) */}
			<div
				className={cn(
					"absolute inset-0",
					theme === 'dark' ? "bg-gradient-to-br from-black/40 via-transparent to-black/60" : "bg-gradient-to-br from-white/6 via-transparent to-white/10",
					"transition-opacity duration-1000",
					mounted ? "opacity-100" : "opacity-0",
				)}
			/>

			{/* Noise Texture */}
			<div
				className="absolute inset-0 opacity-[0.015] pointer-events-none"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Ambient Light Effects */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{/* Top-left glow */}
				<div
					className={cn(
						"absolute -top-1/4 -left-1/4 w-1/2 h-1/2",
						"bg-gradient-radial from-primary/10 via-transparent to-transparent",
						"rounded-full blur-3xl",
						"animate-pulse",
						"transition-all duration-[3000ms]",
						mounted ? "opacity-60 scale-100" : "opacity-0 scale-50",
					)}
					style={{ animationDuration: "8s" }}
				/>

				{/* Bottom-right glow */}
				<div
					className={cn(
						"absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2",
						"bg-gradient-radial from-purple-500/10 via-transparent to-transparent",
						"rounded-full blur-3xl",
						"animate-pulse",
						"transition-all duration-[3000ms] delay-500",
						mounted ? "opacity-60 scale-100" : "opacity-0 scale-50",
					)}
					style={{ animationDuration: "10s" }}
				/>

				{/* Center subtle glow */}
				<div
					className={cn(
						"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full",
						"bg-gradient-radial from-cyan-500/5 via-transparent to-transparent",
						"rounded-full blur-3xl",
						"transition-all duration-[2000ms] delay-1000",
						mounted ? "opacity-40" : "opacity-0",
					)}
				/>
			</div>

			{/* Vignette Effect */}
			<div
				className="absolute inset-0 pointer-events-none"
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
				}}
			/>

			{/* Content */}
			<div className="relative z-10 w-full h-full">{children}</div>
		</div>
	);
}
