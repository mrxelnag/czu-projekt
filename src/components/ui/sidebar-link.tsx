import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";

interface SidebarMenuProps {
  title: string;
  icon: React.ElementType;
  to: string;
  items?: readonly { readonly title: string; readonly to: string }[];
  isActive?: boolean;
  disabled?: boolean;
}

export default function SidebarLink({
  title,
  icon: Icon,
  to,
  items,
  isActive,
  disabled,
}: SidebarMenuProps) {
  if (!items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link
            to={to}
            activeProps={{
              className:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            }}
            disabled={disabled}
            className="hover:border-primary transition-all hover:border aria-disabled:pointer-events-none aria-disabled:opacity-20"
          >
            <Icon />
            <span className="text-md">{title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={title}>
            <Icon />
            <span>{title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <Link
                    to={subItem.to}
                    activeProps={{
                      className:
                        "!bg-primary !text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                    }}
                    disabled={disabled}
                    className="hover:border-primary transition-all hover:border aria-disabled:pointer-events-none aria-disabled:opacity-20"
                  >
                    <span>{subItem.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
