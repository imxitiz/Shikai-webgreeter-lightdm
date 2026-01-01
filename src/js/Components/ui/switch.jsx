/**
 * @license Shikai
 * ui/switch.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/js/lib/utils";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
	<SwitchPrimitives.Root
		className={cn(
			"peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-200",
			"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
			"disabled:cursor-not-allowed disabled:opacity-50",
			"data-[state=checked]:bg-primary data-[state=unchecked]:bg-white/20",
			className,
		)}
		{...props}
		ref={ref}
	>
		<SwitchPrimitives.Thumb
			className={cn(
				"pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
				"data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
			)}
		/>
	</SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
