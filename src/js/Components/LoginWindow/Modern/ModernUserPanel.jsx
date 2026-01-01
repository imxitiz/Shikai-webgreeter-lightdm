/**
 * @license Shikai
 * LoginWindow/Modern/ModernUserPanel.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/js/lib/utils";
import { Button } from "@/js/Components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/js/Components/ui/avatar";
import { Badge } from "@/js/Components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/js/Components/ui/select";
// Separator import removed - not currently used
import { data } from "@/lang";
import { getUserImage, getSessions } from "@/js/Greeter/Operations";
import { types, notify } from "@/js/Greeter/ModernNotifications";
import { date } from "@/js/Tools/Formatter";

// Icons
const LockIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Lock"
	>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</svg>
);

const UnlockIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="18"
		height="18"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Unlock"
	>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 9.9-1" />
	</svg>
);

const ChevronLeftIcon = () => (
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
		aria-label="Previous"
	>
		<path d="m15 18-6-6 6-6" />
	</svg>
);

const ChevronRightIcon = () => (
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
		aria-label="Next"
	>
		<path d="m9 18 6-6-6-6" />
	</svg>
);

const GripIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		role="img"
		aria-label="Drag"
	>
		<circle cx="9" cy="12" r="1" />
		<circle cx="9" cy="5" r="1" />
		<circle cx="9" cy="19" r="1" />
		<circle cx="15" cy="12" r="1" />
		<circle cx="15" cy="5" r="1" />
		<circle cx="15" cy="19" r="1" />
	</svg>
);

export default function ModernUserPanel({ onRecenter }) {
	const dispatch = useDispatch();
	const passwordRef = useRef(null);
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [shake, setShake] = useState(false);

	// Use individual selectors to avoid creating new object references
	const user = useSelector((state) => state.runtime?.user || { username: 'user', display_name: 'User' });
	const session = useSelector((state) => state.runtime?.session || { key: 'plasma', name: 'Plasma' });
	const lang = useSelector((state) => state.settings?.behaviour?.language || 'english');
	const dateEnabled = useSelector((state) => state.settings?.behaviour?.date?.enabled ?? true);
	const dateFormat = useSelector((state) => state.settings?.behaviour?.date?.format || '%B %D, %Y');
	const showAvatar = useSelector((state) => state.settings?.behaviour?.avatar ?? true);
	const inactive = useSelector((state) => state.runtime?.events?.inactivity ?? false);

	const sessions = getSessions();

	// Keep rendering directly from store 'user' so UI updates mirror Redux state
	// (removed localUser workaround)


	// Get users from lightdm or provide debug fallback
	const users = window.__is_debug
		? (typeof lightdm !== 'undefined' ? lightdm.users : [{ username: 'user', display_name: 'User' }])
		: (typeof lightdm !== 'undefined' ? lightdm.users : []);

	const [currentDate, setCurrentDate] = useState("");

	useEffect(() => {
		if (!dateEnabled) return;
		setCurrentDate(date(dateFormat));
		const interval = setInterval(() => setCurrentDate(date(dateFormat)), 60000);
		return () => clearInterval(interval);
	}, [dateEnabled, dateFormat]);

	useEffect(() => {
		passwordRef.current?.focus();
	}, []);

	useEffect(() => {
		console.info('ModernUserPanel observed user change', user);
	}, [user]);

	// LightDM authentication handler
	// biome-ignore lint/correctness/useExhaustiveDependencies: ...
	useEffect(() => {
		if (window.__is_debug) return;

		const handlePrompt = () => {
			lightdm.respond(password);
			setTimeout(() => {
				if (!lightdm.is_authenticated) {
					handleLoginFailure();
				}
			}, 250);
		};

		lightdm?.show_prompt?.connect(handlePrompt);
		return () => lightdm?.show_prompt?.disconnect(handlePrompt);
	}, [password]);

	const handleLogin = () => {
		if (isLoading || !password) return;

		setIsLoading(true);

		if (window.__is_debug) {
			setTimeout(() => {
				if (password === "password") {
					handleLoginSuccess();
				} else {
					handleLoginFailure();
				}
			}, 1000);
		} else {
			lightdm.cancel_authentication();
			lightdm.authenticate(user.username);
		}
	};

	const handleLoginSuccess = () => {
		notify(
			data.get(lang, "notifications.logged_in") + " " + user.username + "!",
			types.Success,
		);
		dispatch({ type: "Start_Event", key: "loginSuccess" });
		setIsLoading(false);
	};

	const handleLoginFailure = () => {
		notify(data.get(lang, "notifications.wrong_password"), types.Error);
		dispatch({ type: "Start_Event", key: "loginFailure" });
		setPassword("");
		setShake(true);
		setTimeout(() => setShake(false), 500);
		setIsLoading(false);
		passwordRef.current?.focus();
	};

	const handleUserSwitch = (direction) => {
		const currentIndex = users.findIndex((u) => u.username === user.username);
		const newIndex =
			direction === "next"
				? (currentIndex + 1) % users.length
				: (currentIndex - 1 + users.length) % users.length;
		console.debug('ModernUserPanel: switching user', {currentIndex, newIndex, from: user, to: users[newIndex]});
		dispatch({ type: "Switch_User", value: users[newIndex] });
		setPassword("");
	};

	const handleSessionChange = (sessionKey) => {
		const newSession = sessions.find((s) => s.key === sessionKey);
		if (newSession) {
			dispatch({ type: "Switch_Session", value: newSession });
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleLogin();
		}
	};

	const userInitials =
		user?.display_name
			?.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2) ||
		user?.username?.slice(0, 2).toUpperCase() ||
		"??";

	return (
		<form
			className="flex-1 flex flex-col relative no-wall-change"
			aria-label="Login form"
		>
			{/* Drag Handle */}
			<button
				type="button"
				className="login-handle absolute top-0 left-0 right-0 h-12 flex items-center justify-center cursor-grab active:cursor-grabbing group"
				onDoubleClick={onRecenter}
				onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRecenter(); } }}
			>
				<div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
					<GripIcon />
					<span className="text-xs text-muted-foreground">Drag to move</span>
				</div>
			</button>

			{/* Main Content */}
			<div className="flex-1 flex flex-col items-center justify-center px-12 py-8">
				{/* User Avatar & Navigation */}
				<div className="flex items-center gap-6 mb-6">
					{users?.length > 1 && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleUserSwitch("prev")}
							className="opacity-60 hover:opacity-100"
						>
							<ChevronLeftIcon />
						</Button>
					)}

					{showAvatar && (
						<div className="relative group">
							<div className="absolute inset-0 bg-primary/40 rounded-full blur-2xl group-hover:bg-primary/60 transition-all duration-300" />
							<Avatar className="w-28 h-28 ring-4 ring-white/20 group-hover:ring-primary/50 transition-all duration-300">
								<AvatarImage
									src={getUserImage(user)}
									alt={user?.display_name}
								/>
								<AvatarFallback className="text-3xl bg-gradient-to-br from-primary/30 to-purple-500/30">
									{userInitials}
								</AvatarFallback>
							</Avatar>
						</div>
					)}

					{users.length > 1 && (
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleUserSwitch("next")}
							className="opacity-60 hover:opacity-100"
						>
							<ChevronRightIcon />
						</Button>
					)}
				</div>

				{/* User Info */}
				<div className="text-center mb-8">
					<h2 className="text-2xl font-semibold text-gradient mb-1">
				{user?.display_name || user?.username || "Unknown User"}
				</h2>
				<p className="text-sm text-muted-foreground">
					@{user?.username || "unknown"}
					</p>
				</div>

				{/* Password Input */}
				<div
					className={cn(
						"w-full max-w-sm mb-6",
						shake && "animate-[shake_0.5s_ease-in-out]",
					)}
				>
					<div className="relative group">
						<div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
						<div className="relative flex items-center">
							<div
								className="absolute left-4 text-muted-foreground"
								aria-hidden
							>
								<LockIcon />
							</div>
							<label className="sr-only" htmlFor="password-input">
								{data.get(lang, "login.password") || "Password"}
							</label>
							<input
								id="password-input"
								ref={passwordRef}
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								onKeyDown={handleKeyDown}
								disabled={inactive || isLoading}
								aria-label={data.get(lang, "login.password") || "Password"}
								placeholder={data.get(lang, "login.password") || "Password"}
								className={cn(
									"w-full h-14 pl-16 pr-4 rounded-xl py-2 leading-normal",
									"bg-card border-default",
									"text-foreground placeholder:text-muted-foreground",
									"focus:outline-none focus-ring",
									"transition-all duration-300",
									"disabled:opacity-50 disabled:cursor-not-allowed",
								)}
							/>
						</div>
					</div>
				</div>

				<Button
					onClick={handleLogin}
					disabled={!password || isLoading}
					className={cn(
						"w-full max-w-sm h-12 text-base font-medium",
						"bg-gradient-to-r from-primary to-primary/80",
						"hover:from-primary/90 hover:to-primary/70",
						"shadow-lg shadow-primary/25 hover:shadow-primary/40",
						"transition-all duration-300",
						isLoading && "animate-pulse",
					)}
				>
					{isLoading ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							<span>
								{data.get(lang, "login.logging_in") || "Signing in..."}
							</span>
						</div>
					) : (
						<div className="flex items-center gap-2">
							<UnlockIcon />
							<span>{data.get(lang, "login.button") || "Sign In"}</span>
						</div>
					)}
				</Button>

				{/* Session Selector */}
				<div className="mt-8 w-full max-w-sm">
					<Select value={session?.key} onValueChange={handleSessionChange}>
						<SelectTrigger className="w-full h-11 bg-card border-default px-4 rounded-xl">
							<SelectValue
								placeholder={
									data.get(lang, "login.session") || "Select session"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{sessions.map((s) => (
							<SelectItem key={s.key} value={s.key} aria-label={`${s.type?.toUpperCase() || "X11"} ${s.name}`}>
								<span className="inline-flex items-center gap-2" aria-hidden>
									<Badge variant="outline" className="text-[10px]">
										{s.type?.toUpperCase() || "X11"}
									</Badge>{'\u00A0'}
									<span>{s.name}</span>
								</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="px-8 py-4 border-t border-white/10 flex items-center justify-between">
				<div className="text-xs text-muted-foreground">
					{users.length > 1 && (
						<span>
							{users.length} {data.get(lang, "login.users") || "users"}
						</span>
					)}
				</div>

				{dateEnabled && (
					<div className="text-sm text-muted-foreground">{currentDate}</div>
				)}
			</div>

			{/* CSS for shake animation */}
			<style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
		</form>
	);
}
