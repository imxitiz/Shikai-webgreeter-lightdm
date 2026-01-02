import { useStore } from "@/js/State/store"
import { Label } from "@/js/Components/ui/label"
import { Input } from "@/js/Components/ui/input"
import { Separator } from "@/js/Components/ui/separator"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/js/Components/ui/select"
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/js/Components/ui/card"
import { data } from "@/lang"

function ColorPicker({ label, value, onChange }) {
	return (
		<div className="flex items-center gap-3 py-2">
			<div
				className="w-10 h-10 rounded-lg border border-border/50 cursor-pointer overflow-hidden relative group shadow-sm"
				style={{ backgroundColor: value }}
			>
				<input
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
				/>
				<div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="2"
						role="img"
						aria-label="Edit"
					>
						<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
					</svg>
				</div>
			</div>
			<div className="flex-1">
				<Label className="text-sm text-foreground">{label}</Label>
				<p className="text-xs text-muted-foreground font-mono">{value}</p>
			</div>
		</div>
	);
}

function SettingSection({ title, description, children }) {
	return (
		<Card className="mb-4 bg-sidebar/30 border-sidebar-border/50 shadow-md">
			<CardHeader className="pb-3">
				<CardTitle className="text-base text-foreground">{title}</CardTitle>
				{description && (
					<CardDescription className="text-muted-foreground">
						{description}
					</CardDescription>
				)}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export default function ModernStyleTab() {
	const style = useStore((state) => state.settings?.style || {})
	const lang = useStore((state) => state.settings?.behaviour?.language || "english")
	const logos = useStore((state) => state.runtime?.logos || [])
	const setSetting = useStore((state) => state.setSetting)
	const saveSettings = useStore((state) => state.saveSettings)

	const set = (key, value) => {
		setSetting(`style.${key}`, value)
		saveSettings()
	}

	const currentLogoName =
		style.sidebar?.logo
			?.split("/")
			.pop()
			.replace(/\.[^/.]+$/, "") || "";

	return (
		<div className="space-y-4 pb-4">
			{/* Logo Section */}
			<SettingSection
				title={
					data.get(lang, "settings.style.sections.main.name") || "Appearance"
				}
				description="Customize the look and feel"
			>
				<div className="space-y-4">
					{/* Logo Preview */}
					<div className="flex items-center gap-4 p-4 rounded-xl bg-input/30 border border-border/30">
						<div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shadow-sm">
							{style.sidebar?.logo ? (
								<img
									src={style.sidebar.logo}
									alt="Logo"
									className="w-12 h-12 object-contain"
								/>
							) : (
								<div className="text-2xl text-muted-foreground">📷</div>
							)}
						</div>
						<div className="flex-1 no-wall-change">
							<Label className="text-sm mb-2 block text-foreground">Logo</Label>
							<Select
								value={currentLogoName}
								onValueChange={(v) => {
									const logo = logos.find((l) => l[0] === v);
									if (logo) set("sidebar.logo", logo[1]);
								}}
							>
								<SelectTrigger className="w-full h-10 bg-input/50 border-border/50 shadow-sm no-wall-change">
									<SelectValue placeholder="Select a logo" />
								</SelectTrigger>
								<SelectContent className="no-wall-change">
									{logos.map((logo) => (
										<SelectItem
											key={logo[0]}
											value={logo[0]}
											className="no-wall-change"
										>
											{logo[0]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</SettingSection>

			{/* Colors Section */}
			<SettingSection
				title={data.get(lang, "settings.style.colors") || "Colors"}
				description="Customize color scheme"
			>
				<div className="grid grid-cols-2 gap-4">
					<ColorPicker
						label={
							data.get(lang, "settings.style.sections.main.options.text") ||
							"Text Color"
						}
						value={style.main?.textcolor || "#ffffff"}
						onChange={(c) => set("main.textcolor", c)}
					/>
					<ColorPicker
						label={
							data.get(lang, "settings.style.sections.main.options.avatar") ||
							"Avatar Color"
						}
						value={style.userbar?.avatar?.color || "#3b82f6"}
						onChange={(c) => set("userbar.avatar.color", c)}
					/>
				</div>

				<Separator className="my-4 bg-border/30" />

				<div className="grid grid-cols-2 gap-4">
					<ColorPicker
						label={
							data.get(lang, "settings.style.sections.main.options.sidebar") ||
							"Sidebar"
						}
						value={style.sidebar?.background || "#1a1a1a"}
						onChange={(c) => set("sidebar.background", c)}
					/>
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.userbar_top",
							) || "Panel Top"
						}
						value={style.userbar?.background?.top || "#1a1a1a"}
						onChange={(c) => set("userbar.background.top", c)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4">
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.userbar_bottom",
							) || "Panel Bottom"
						}
						value={style.userbar?.background?.bottom || "#0a0a0a"}
						onChange={(c) => set("userbar.background.bottom", c)}
					/>
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.icon_background",
							) || "Icon Background"
						}
						value={style.main?.icons?.background || "#3b82f6"}
						onChange={(c) => set("main.icons.background", c)}
					/>
				</div>

				<Separator className="my-4 bg-border/30" />

				<div className="grid grid-cols-2 gap-4">
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.session_text",
							) || "Session Text"
						}
						value={style.userbar?.session?.color || "#ffffff"}
						onChange={(c) => set("userbar.session.color", c)}
					/>
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.session_background",
							) || "Session Background"
						}
						value={style.userbar?.session?.background || "#1a1a1a"}
						onChange={(c) => set("userbar.session.background", c)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4 mt-4">
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.password_text",
							) || "Password Text"
						}
						value={style.userbar?.password?.color || "#ffffff"}
						onChange={(c) => set("userbar.password.color", c)}
					/>
					<ColorPicker
						label={
							data.get(
								lang,
								"settings.style.sections.main.options.password_background",
							) || "Password Background"
						}
						value={style.userbar?.password?.background || "#1a1a1a"}
						onChange={(c) => set("userbar.password.background", c)}
					/>
				</div>
			</SettingSection>

			{/* Advanced Section */}
			<SettingSection
				title={
					data.get(lang, "settings.style.sections.misc.name") || "Advanced"
				}
				description="Fine-tune styling details"
			>
				<div className="space-y-4">
					<div>
						<Label className="text-xs text-muted-foreground mb-2 block">
							{data.get(
								lang,
								"settings.style.sections.misc.options.password",
							) || "Password Border Radius"}
						</Label>
						<Input
							value={style.userbar?.password?.border?.radius || "8px"}
							onChange={(e) =>
								set("userbar.password.border.radius", e.target.value)
							}
							className="h-10 bg-input/50 border-border/50 shadow-sm"
							placeholder="8px"
						/>
					</div>
					<div>
						<Label className="text-xs text-muted-foreground mb-2 block">
							{data.get(lang, "settings.style.sections.misc.options.session") ||
								"Session Border Radius"}
						</Label>
						<Input
							value={style.userbar?.session?.radius || "8px"}
							onChange={(e) => set("userbar.session.radius", e.target.value)}
							className="h-10 bg-input/50 border-border/50 shadow-sm"
							placeholder="8px"
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<Label className="text-xs text-muted-foreground mb-2 block">
								{data.get(
									lang,
									"settings.style.sections.misc.options.caret.left",
								) || "Caret Left"}
							</Label>
							<Input
								value={style.userbar?.password?.caret?.left || ">"}
								onChange={(e) =>
									set("userbar.password.caret.left", e.target.value)
								}
								className="h-10 bg-input/50 border-border/50 shadow-sm"
							/>
						</div>
						<div>
							<Label className="text-xs text-muted-foreground mb-2 block">
								{data.get(
									lang,
									"settings.style.sections.misc.options.caret.right",
								) || "Caret Right"}
							</Label>
							<Input
								value={style.userbar?.password?.caret?.right || "<"}
								onChange={(e) =>
									set("userbar.password.caret.right", e.target.value)
								}
								className="h-10 bg-input/50 border-border/50 shadow-sm"
							/>
						</div>
					</div>
				</div>
			</SettingSection>
		</div>
	);
}
