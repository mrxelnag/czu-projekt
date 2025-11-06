import {
  DollarSignIcon,
  ForkKnife,
  GamepadIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";
import { Link, linkOptions } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/ui/theme-toggle.tsx";

import { useIsMobile } from "@/hooks/use-mobile.tsx";
import SidebarLink from "@/components/ui/sidebar-link.tsx";
import { PWAInstallPrompt } from "@/components/pwa-prompt.tsx";
import { Button } from "@/components/ui/button.tsx";
import { version } from "../../package.json";
import { AuthUser } from "@/lib/authentication.ts";
import { useLogout } from "@/api/auth.ts";

const desktopLinks = linkOptions([
  {
    to: "/app",
    icon: HomeIcon,
    title: "Domů",
  },
  {
    to: "/app/hry",
    icon: GamepadIcon,
    title: "Hry",
    isActive: true,
    items: [
      {
        to: "/app/hry/ruleta",
        title: "Ruleta",
      },
      {
        to: "/app/hry/automat",
        title: "Automat",
      },
    ],
  },
  {
    to: "/app/nastaveni",
    icon: SettingsIcon,
    title: "Nastavení",
    isActive: true,
    items: [
      {
        to: "/app/nastaveni/zakladni",
        title: "Nastavení",
      },
      {
        to: "/app/nastaveni/limity/",
        title: "Limity",
      },
    ],
  },
  {
    to: "/app/transakce",
    icon: DollarSignIcon,
    title: "Transakce",
  },
]);

export function AppSidebar({ user }: { user: AuthUser }) {
  const isMobile = useIsMobile();
  const logout = useLogout();
  return (
    <Sidebar side={isMobile ? "right" : "left"}>
      <SidebarHeader>
        <div className="flex items-center space-x-3 border-b border-gray-300 p-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 font-bold text-white transition-all duration-300 ease-in-out group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8">
            {user.auth_user
              .email!.split("@")
              .map((name) => name[0])
              .join("")}
          </div>

          <div className="flex flex-1 items-center overflow-hidden transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
            <div className="w-full min-w-0">
              <div className="truncate text-sm font-medium">
                {user.auth_user.email!.split("@")[0]}
              </div>
            </div>
            <Link to={"/uzivatel/" + user.auth_user.id}>
              <Button variant="ghost" size={"icon"} className="ml-auto">
                <SettingsIcon />
              </Button>
            </Link>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {desktopLinks.map((link) => (
                <SidebarLink
                  // disabled={user.restaurant === ""}
                  key={link.to}
                  {...link}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <p className="text-center text-sm text-gray-500">Verze: {version}</p>
        <div className="group-data-[collapsible=icon]:hidden">
          <PWAInstallPrompt />
        </div>
        <div className="flex items-center justify-between border-t border-gray-300 p-2 pb-4 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:justify-center">
          <button
            className="flex items-center space-x-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:w-8"
            onClick={logout}
          >
            <LogOutIcon className="mr-4 h-5 w-5" />
            Odhlásit se
          </button>
        </div>
        <button
          className="hidden items-center space-x-2 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center"
          onClick={logout}
        >
          <LogOutIcon className="h-5 w-5" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
