import * as React from "react";
import { GripVerticalIcon } from "lucide-react";
import * as ResizablePrimitive from "react-resizable-panels";

import { cn } from "@/lib/utils";

function ResizablePanelGroup({
	direction = "horizontal",
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Group> & {
	direction?: "horizontal" | "vertical";
}) {
	// preserve any existing orientation prop but prefer the explicit `direction`
	const { orientation: _orientation, ...rest } = props as React.ComponentProps<
		typeof ResizablePrimitive.Group
	>;

	return (
		<ResizablePrimitive.Group
			data-slot="resizable-panel-group"
			orientation={direction}
			data-panel-group-direction={direction}
			className={cn(
				"flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
				className,
			)}
			{...rest}
		/>
	);
}

function ResizablePanel(
	props: React.ComponentProps<typeof ResizablePrimitive.Panel>,
) {
	// Allow numeric sizes for convenience (e.g. 30 -> "30%")
	const p = props as any;
	const normalizedProps = {
		...p,
		defaultSize:
			typeof p.defaultSize === "number" ? `${p.defaultSize}%` : p.defaultSize,
		minSize: typeof p.minSize === "number" ? `${p.minSize}%` : p.minSize,
		maxSize: typeof p.maxSize === "number" ? `${p.maxSize}%` : p.maxSize,
	};

	return (
		<ResizablePrimitive.Panel
			data-slot="resizable-panel"
			{...normalizedProps}
		/>
	);
}

function ResizableHandle({
	withHandle,
	className,
	...props
}: React.ComponentProps<typeof ResizablePrimitive.Separator> & {
	withHandle?: boolean;
}) {
	return (
		<ResizablePrimitive.Separator
			data-slot="resizable-handle"
			className={cn(
				"relative flex w-px items-center justify-center px-2 -mx-2 touch-none focus-visible:ring-ring focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden cursor-col-resize data-[panel-group-direction=vertical]:cursor-row-resize",
				className,
			)}
			{...props}
		>
			{/* visible 1px line centered; outer element provides generous hit-area */}
			<div
				aria-hidden
				className={cn(
					"absolute left-1/2 -translate-x-1/2 h-full w-px bg-border",
					"data-[panel-group-direction=vertical]:left-0 data-[panel-group-direction=vertical]:top-1/2 data-[panel-group-direction=vertical]:-translate-y-1/2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:h-px",
				)}
			/>

			{withHandle && (
				<div className="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border">
					<GripVerticalIcon className="size-2.5" />
				</div>
			)}
		</ResizablePrimitive.Separator>
	);
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
