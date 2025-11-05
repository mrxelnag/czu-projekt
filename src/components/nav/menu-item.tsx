import React from "react";
import { cn } from "@/lib/utils.ts";
import { buttonVariants } from "@/components/ui/button.tsx";
import { createLink } from "@tanstack/react-router";

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}
const MenuItem = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  (props, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className={cn(
          buttonVariants({
            variant: "outline",
            className: "data-[status=active]:text-primary grow",
          }),
        )}
      >
        <div className="p-2 text-center">{props.children}</div>
      </a>
    );
  },
);

export const MenuItemLink = createLink(MenuItem);
