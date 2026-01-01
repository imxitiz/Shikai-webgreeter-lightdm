/**
 * @license Shikai
 * SettingsWindow/Modern/tabs/ModernBehaviourTab.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useSelector, useDispatch } from "react-redux";
import { Label } from "@/js/Components/ui/label";
import { Switch } from "@/js/Components/ui/switch";
import { Button } from "@/js/Components/ui/button";
import { Input } from "@/js/Components/ui/input";
import { Separator } from "@/js/Components/ui/separator";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/js/Components/ui/select";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/js/Components/ui/card";
import { data, names as languageNames } from "@/lang";
import { types, notify } from "@/js/Greeter/Notifications";

function SettingRow({ label, description, children }) {
	return (
		<div className="flex items-center justify-between py-3">
			<div className="space-y-0.5">
				<Label className="text-sm font-medium">{label}</Label>
				{description && (
					<p className="text-xs text-muted-foreground">{description}</p>
				)}
			</div>
			{children}
		</div>
	);
}

function SettingSection({ title, description, children }) {
	return (
		<Card className="mb-4 bg-white/5 border-white/10">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-1">{children}</CardContent>
		</Card>
	);
}

export default function ModernBehaviourTab() {
	const dispatch = useDispatch();

	const { behaviour, lang } = useSelector((state) => ({
		behaviour: state.settings.behaviour,
		lang: state.settings.behaviour.language,
	}));

	const toggle = (key) => {
		dispatch({ type: "Setting_Toggle", key: `behaviour.${key}` });
		dispatch({ type: "Settings_Save" });
	};

	const set = (key, value) => {
		dispatch({ type: "Setting_Set", key: `behaviour.${key}`, value });
		dispatch({ type: "Settings_Save" });
	};

	const handleClearStorage = () => {
		localStorage.clear();
		notify(
			data.get(lang, "notifications.delete_local") || "Local storage cleared!",
			types.Success,
		);
	};

	return (
		<div className="space-y-4">
			{/* General Section */}
			<SettingSection
				title={
					data.get(lang, "settings.behaviour.sections.general.name") ||
					"General"
				}
				description="Configure visibility of UI elements"
			>
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.general.options.logo",
						) || "Show Logo"
					}
				>
					<Switch
						checked={behaviour.logo}
						onCheckedChange={() => toggle("logo")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.general.options.hostname",
						) || "Show Hostname"
					}
				>
					<Switch
						checked={behaviour.hostname}
						onCheckedChange={() => toggle("hostname")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.general.options.avatar",
						) || "Show Avatar"
					}
				>
					<Switch
						checked={behaviour.avatar}
						onCheckedChange={() => toggle("avatar")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.general.options.dark_mode",
						) || "Dark Mode"
					}
				>
					<Switch
						checked={behaviour.dark_mode}
						onCheckedChange={() => toggle("dark_mode")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.general.options.username",
						) || "Show Username"
					}
				>
					<Switch
						checked={behaviour.user}
						onCheckedChange={() => toggle("user")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.general.options.session",
						) || "Show Session"
					}
				>
					<Switch
						checked={behaviour.session}
						onCheckedChange={() => toggle("session")}
					/>
				</SettingRow>
			</SettingSection>

			{/* Language Section */}
			<SettingSection
				title={
					data.get(lang, "settings.behaviour.sections.lang.name") || "Language"
				}
				description="Select your preferred language"
			>
				<Select
					value={behaviour.language}
					onValueChange={(v) => set("language", v)}
				>
					<SelectTrigger className="w-full h-10 bg-white/5">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{languageNames.map((name) => (
							<SelectItem key={name} value={name}>
								{name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</SettingSection>

			{/* Commands Section */}
			<SettingSection
				title={
					data.get(lang, "settings.behaviour.sections.commands.name") ||
					"Commands"
				}
				description="Enable or disable power commands"
			>
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.commands.options.shutdown",
						) || "Shutdown"
					}
				>
					<Switch
						checked={behaviour.commands.shutdown}
						onCheckedChange={() => toggle("commands.shutdown")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.commands.options.reboot",
						) || "Reboot"
					}
				>
					<Switch
						checked={behaviour.commands.reboot}
						onCheckedChange={() => toggle("commands.reboot")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.commands.options.sleep",
						) || "Sleep"
					}
				>
					<Switch
						checked={behaviour.commands.sleep}
						onCheckedChange={() => toggle("commands.sleep")}
					/>
				</SettingRow>
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.commands.options.hibernate",
						) || "Hibernate"
					}
				>
					<Switch
						checked={behaviour.commands.hibernate}
						onCheckedChange={() => toggle("commands.hibernate")}
					/>
				</SettingRow>
			</SettingSection>

			{/* Time Section */}
			<SettingSection
				title={
					data.get(lang, "settings.behaviour.sections.time.name") ||
					"Time & Date"
				}
				description="Configure clock and date display"
			>
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.time.options.clock.enabled",
						) || "Show Clock"
					}
				>
					<Switch
						checked={behaviour.clock.enabled}
						onCheckedChange={() => toggle("clock.enabled")}
					/>
				</SettingRow>
				{behaviour.clock.enabled && (
					<div className="py-2">
						<Label className="text-xs text-muted-foreground mb-2 block">
							{data.get(
								lang,
								"settings.behaviour.sections.time.options.clock.format",
							) || "Clock Format"}
						</Label>
						<Input
							value={behaviour.clock.format}
							onChange={(e) => set("clock.format", e.target.value)}
							className="h-9 bg-white/5"
							placeholder="HH:mm:ss"
						/>
					</div>
				)}
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.time.options.date.enabled",
						) || "Show Date"
					}
				>
					<Switch
						checked={behaviour.date.enabled}
						onCheckedChange={() => toggle("date.enabled")}
					/>
				</SettingRow>
				{behaviour.date.enabled && (
					<div className="py-2">
						<Label className="text-xs text-muted-foreground mb-2 block">
							{data.get(
								lang,
								"settings.behaviour.sections.time.options.date.format",
							) || "Date Format"}
						</Label>
						<Input
							value={behaviour.date.format}
							onChange={(e) => set("date.format", e.target.value)}
							className="h-9 bg-white/5"
							placeholder="dddd, MMMM Do"
						/>
					</div>
				)}
			</SettingSection>

			{/* Misc Section */}
			<SettingSection
				title={
					data.get(lang, "settings.behaviour.sections.misc.name") ||
					"Miscellaneous"
				}
				description="Other settings"
			>
				<SettingRow
					label={
						data.get(
							lang,
							"settings.behaviour.sections.misc.options.idle.enabled",
						) || "Enable Idle"
					}
				>
					<Switch
						checked={behaviour.idle.enabled}
						onCheckedChange={() => toggle("idle.enabled")}
					/>
				</SettingRow>
				{behaviour.idle.enabled && (
					<div className="py-2">
						<Label className="text-xs text-muted-foreground mb-2 block">
							{data.get(
								lang,
								"settings.behaviour.sections.misc.options.idle.value",
							) || "Idle Timeout (ms)"}
						</Label>
						<Input
							type="number"
							value={behaviour.idle.timeout}
							onChange={(e) => set("idle.timeout", e.target.value)}
							className="h-9 bg-white/5"
							placeholder="60000"
						/>
					</div>
				)}
				<Separator className="my-1" />
				<SettingRow
					label={
						data.get(lang, "settings.behaviour.sections.misc.options.evoker") ||
						"Show Settings Button"
					}
				>
					<Switch
						checked={behaviour.evoker}
						onCheckedChange={() => toggle("evoker")}
					/>
				</SettingRow>
			</SettingSection>

			{/* Danger Zone */}
			<Card className="mb-4 bg-destructive/10 border-destructive/20">
				<CardHeader className="pb-3">
					<CardTitle className="text-base text-destructive">
						{data.get(lang, "settings.danger.title") || "Danger Zone"}
					</CardTitle>
					<CardDescription className="text-destructive/80">
						{data.get(lang, "settings.danger.description") ||
							"These actions are irreversible"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						variant="destructive"
						onClick={handleClearStorage}
						className="w-full"
					>
						{data.get(lang, "buttons.delete_local") || "Clear Local Storage"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
