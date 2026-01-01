/**
 * @license Shikai
 * ui/avatar.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/js/lib/utils";

const Avatar = React.forwardRef(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn(
			"relative flex h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white/10 transition-all duration-300 hover:ring-primary/50 hover:scale-105",
			className,
		)}
		{...props}
	/>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn("aspect-square h-full w-full object-cover", className)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-2xl font-semibold text-white",
			className,
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
