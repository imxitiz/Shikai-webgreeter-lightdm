/**
 * ui/badge.jsx
 *
 *
 */

import { cva } from "class-variance-authority";
import { cn } from "@/js/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground shadow-lg shadow-primary/25",
				secondary: "bg-secondary text-secondary-foreground",
				destructive:
					"bg-destructive text-destructive-foreground shadow-lg shadow-destructive/25",
				outline: "border border-input bg-transparent text-foreground",
				glass: "glass text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({ className, variant, ...props }) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
