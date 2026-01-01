/**
 * @license Shikai
 * ui/input.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { cn } from "@/js/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				"flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-base text-foreground transition-all duration-200",
				"placeholder:text-muted-foreground",
				"focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"file:border-0 file:bg-transparent file:text-sm file:font-medium",
				className,
			)}
			ref={ref}
			{...props}
		/>
	);
});
Input.displayName = "Input";

export { Input };
