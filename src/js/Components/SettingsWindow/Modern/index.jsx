/**
 * @license Shikai
 * SettingsWindow/Modern/index.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { cn } from "@/js/lib/utils";
import { Button } from "@/js/Components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/js/Components/ui/dialog";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/js/Components/ui/tabs";
import { ScrollArea } from "@/js/Components/ui/scroll-area";
import { data } from "@/lang";

import ModernBehaviourTab from "./tabs/ModernBehaviourTab";
import ModernStyleTab from "./tabs/ModernStyleTab";
import ModernThemesTab from "./tabs/ModernThemesTab";

// Settings Icon
const SettingsIcon = () => (
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
		aria-label="Settings"
	>
		<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
);

export default function ModernSettings() {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("behaviour");

	// Use individual selectors to avoid creating new object references
	const inactive = useSelector((state) => state.runtime?.events?.inactivity ?? false);
	const showEvoker = useSelector((state) => state.settings?.behaviour?.evoker ?? true);
	const lang = useSelector((state) => state.settings?.behaviour?.language ?? "english");

	// Update settings from storage on mount
	useEffect(() => {
		dispatch({ type: "Settings_Update" });
	}, [dispatch]);

	const handleOpenChange = (newOpen) => {
		if (!inactive) {
			setOpen(newOpen);
			if (!newOpen) {
				dispatch({ type: "Settings_Save" });
			}
		}
	};

	return (
		<>
			{/* Settings Evoker Button */}
			{showEvoker && (
				<Button
					variant="glass"
					size="icon"
					onClick={() => handleOpenChange(true)}
					className={cn(
						"fixed bottom-6 right-6 z-40",
						"w-12 h-12 rounded-full",
						"opacity-60 hover:opacity-100",
						"transition-all duration-300",
						"hover:scale-110 hover:rotate-90",
						"shadow-lg shadow-black/20",
					)}
				>
					<SettingsIcon />
				</Button>
			)}

			{/* Settings Dialog */}
			<Dialog open={open && !inactive} onOpenChange={handleOpenChange}>
				<DialogContent className="max-w-2xl h-[600px] p-0 gap-0 overflow-hidden no-wall-change">
					<DialogHeader className="px-6 pt-6 pb-4">
						<DialogTitle className="text-xl flex items-center gap-3">
							<div className="p-2 rounded-lg bg-primary/20">
								<SettingsIcon />
							</div>
							{data.get(lang, "settings.title") || "Settings"}
						</DialogTitle>
					</DialogHeader>

					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col"
					>
						<div className="px-6">
							<TabsList className="w-full grid grid-cols-3">
								<TabsTrigger value="behaviour">
									{data.get(lang, "settings.behaviour.name") || "Behaviour"}
								</TabsTrigger>
								<TabsTrigger value="style">
									{data.get(lang, "settings.style.name") || "Style"}
								</TabsTrigger>
								<TabsTrigger value="themes">
									{data.get(lang, "settings.themes.name") || "Themes"}
								</TabsTrigger>
							</TabsList>
						</div>

						<ScrollArea className="flex-1 px-6 pb-6">
							<TabsContent value="behaviour" className="mt-4">
								<ModernBehaviourTab />
							</TabsContent>

							<TabsContent value="style" className="mt-4">
								<ModernStyleTab />
							</TabsContent>

							<TabsContent value="themes" className="mt-4">
								<ModernThemesTab />
							</TabsContent>
						</ScrollArea>
					</Tabs>
				</DialogContent>
			</Dialog>
		</>
	);
}
