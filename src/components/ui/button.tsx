import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-sm text-sm font-semibold tracking-[-0.01em]",
    "cursor-pointer select-none",
    "transition-[color,background-color,border-color,transform,box-shadow] duration-200",
    "ease-[cubic-bezier(0.22,1,0.36,1)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "active:scale-[0.985]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_0_rgb(255_255_255/0.12)_inset,0_10px_28px_-16px_rgb(17_17_17/0.55)] hover:bg-[#1c1c1c] hover:shadow-[0_1px_0_rgb(255_255_255/0.14)_inset,0_14px_36px_-14px_rgb(17_17_17/0.6)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-foreground/18 bg-background text-foreground shadow-[0_1px_0_rgb(17_17_17/0.03)] hover:border-foreground/35 hover:bg-secondary",
        secondary:
          "bg-secondary text-secondary-foreground border border-transparent hover:bg-[#e8eef2] hover:border-border",
        ghost: "font-medium hover:bg-secondary hover:text-foreground",
        link: "font-medium text-accent underline-offset-4 hover:underline",
        inverse:
          "bg-ink-foreground text-ink shadow-[0_10px_28px_-16px_rgb(255_255_255/0.35)] hover:bg-white",
        accent:
          "bg-accent text-accent-foreground shadow-[0_1px_0_rgb(255_255_255/0.18)_inset,0_12px_32px_-18px_rgb(26_58_143/0.65)] hover:brightness-110",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-sm px-3.5 text-xs tracking-[0.01em]",
        lg: "h-12 rounded-sm px-8 text-[0.9375rem]",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
