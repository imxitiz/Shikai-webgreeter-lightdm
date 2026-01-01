/**
 * @license Shikai
 * ui/separator.jsx
 *
 * Copyright (c) 2026, imxitiz.
 *
 * This source code is licensed under the GNU license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { cn } from "@/js/lib/utils";

const Separator = React.forwardRef(
	(
		{ className, orientation = "horizontal", decorative = true, ...props },
		ref,
	) => (
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"shrink-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
				orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
				className,
			)}
			{...props}
		/>
	),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
