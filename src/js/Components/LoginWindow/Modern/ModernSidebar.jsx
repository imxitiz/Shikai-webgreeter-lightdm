/**
 * @license Shikai
 * LoginWindow/Modern/ModernSidebar.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch } from "@/js/Components/ui/switch";
import { cn } from "@/js/lib/utils";
import { Button } from "@/js/Components/ui/button";
import { Separator } from "@/js/Components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
	TooltipProvider,
} from "@/js/Components/ui/tooltip";
import { data } from "@/lang";
import { shutdown, restart, sleep, hibernate } from "@/js/Greeter/Commands";
import { time } from "@/js/Tools/Formatter";

// Icons (using lucide-react style SVGs)
const PowerIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Power"
	>
		<path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
		<line x1="12" x2="12" y1="2" y2="12" />
	</svg>
);

const RestartIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Restart"
	>
		<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
		<path d="M21 3v5h-5" />
		<path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
		<path d="M8 16H3v5" />
	</svg>
);

const SleepIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Sleep"
	>
		<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
	</svg>
);

const HibernateIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Hibernate"
	>
		<path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
	</svg>
);

const commandOptions = [
	{
		key: "sleep",
		icon: SleepIcon,
		func: sleep,
	},
	{
		key: "reboot",
		icon: RestartIcon,
		func: restart,
	},
	{
		key: "shutdown",
		icon: PowerIcon,
		func: shutdown,
	},
	{
		key: "hibernate",
		icon: HibernateIcon,
		func: hibernate,
	},
];

export default function ModernSidebar() {
	const [currentTime, setCurrentTime] = useState("--:--");
	// Prevent wallpaper changes when clicking inside the sidebar
	const sidebarRef = useRef(null);

	// Use individual selectors to avoid creating new object references
	const dispatch = useDispatch();
	const commands = useSelector(
		(state) => state.settings?.behaviour?.commands || {},
	);
	const clockEnabled = useSelector(
		(state) => state.settings?.behaviour?.clock?.enabled ?? true,
	);
	const clockFormat = useSelector(
		(state) => state.settings?.behaviour?.clock?.format || "%H:%K:%S",
	);
	const lang = useSelector(
		(state) => state.settings?.behaviour?.language || "english",
	);
	const logoSrc = useSelector(
		(state) =>
			state.settings?.style?.sidebar?.logo ||
			"./assets/media/logos/archlinux.png",
	);
	const darkMode = useSelector(
		(state) => state.settings?.behaviour?.dark_mode ?? true,
	);
	// Respect behaviour toggles
	const showLogo = useSelector(
		(state) => state.settings?.behaviour?.logo ?? true,
	);
	const showHostname = useSelector(
		(state) => state.settings?.behaviour?.hostname ?? true,
	);

	useEffect(() => {
		if (!clockEnabled) return;

		const updateTime = () => setCurrentTime(time(clockFormat));
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, [clockEnabled, clockFormat]);

	const hostname = window.__is_debug
		? "hostname"
		: lightdm?.hostname || "Unknown";

	return (
		<div
			ref={sidebarRef}
			className="relative w-[280px] h-full flex flex-col p-6 bg-card/40 border-r border-border/30 no-wall-change backdrop-blur-sm"
		>
			{/* Logo Section */}
			{showLogo && (
				<div className="flex items-center justify-center py-8">
					<div className="relative">
						<div className="absolute inset-0 bg-primary/30 rounded-full blur-xl" />
						<img
							src={logoSrc || "/assets/media/logos/shikai.png"}
							alt="Logo"
							className="relative w-20 h-20 object-contain drop-shadow-2xl"
						/>
					</div>
				</div>
			)}
			{/* Branding */}
			<div className="text-center mb-8">
				<h1 className="text-2xl font-semibold text-gradient">Shikai</h1>
				<p className="text-sm text-foreground mt-1">Modern Greeter</p>
				<div className="mt-3 flex items-center justify-center gap-2">
					<span className="text-sm text-foreground font-medium">Theme</span>

					<Switch
						checked={darkMode}
						onCheckedChange={() => {
							dispatch({ type: "Setting_Toggle", key: "behaviour.dark_mode" });
							dispatch({ type: "Settings_Save" });
						}}
					/>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="flex-1">
				<p className="text-sm text-foreground uppercase tracking-wider m-4">
					{data.get(lang, "commands.title") || "Quick Actions"}
				</p>

				<TooltipProvider delayDuration={200}>
					<div className="grid grid-cols-2 gap-3">
						{commandOptions
							.filter((cmd) => commands[cmd.key])
							.map((cmd) => (
								<Tooltip key={cmd.key}>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											className={cn(
												"w-full h-14 flex flex-col gap-1 transition-all duration-300",
												"hover:scale-105 active:scale-95",
												"bg-muted/50 hover:bg-muted border-border/50 hover:border-primary/50",
												"text-foreground hover:text-primary",
											)}
											onClick={cmd.func}
										>
											<cmd.icon />
											<span className="text-[12px] opacity-90">
												{data.get(lang, `commands.names.${cmd.key}`)}
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent side="right">
										<p>{data.get(lang, `commands.names.${cmd.key}`)}</p>
									</TooltipContent>
								</Tooltip>
							))}
					</div>
				</TooltipProvider>
			</div>

			{/* Bottom Info Section */}
			<div className="mt-auto space-y-4">
				<Separator className="bg-border/30" />

				{/* Hostname */}
				{showHostname && (
					<div className="flex items-center justify-between text-sm">
						<span className="text-foreground font-medium">Host</span>
						<span className="font-mono text-foreground">{hostname}</span>
					</div>
				)}
				{/* Clock */}
				{clockEnabled && (
					<div className="text-center">
						<div className="text-3xl font-light tracking-wide text-gradient">
							{currentTime}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
