"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { DashboardProvider, useDashboard } from "@/lib/dashboard-context";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SearchIcon,
  NotificationIcon,
  LayoutIcon,
  Cancel01Icon,
  ArrowRight01Icon,
  MoonIcon,
  SunIcon,
} from "@hugeicons/core-free-icons";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <DashboardProvider>
      <div className="bg-muted/40 text-foreground flex h-screen w-full overflow-hidden text-xs">
        {/* Desktop sidebar */}
        <div className="relative z-30 hidden h-full shrink-0 md:block">
          {sidebarOpen && <Sidebar />}
        </div>
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="h-full w-64">
              <Sidebar />
            </div>
            <button
              type="button"
              className="bg-black/40 h-full w-full"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <DashboardHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/dashboard/my-tasks")) return "My tasks";
  if (pathname.startsWith("/dashboard/inbox")) return "Inbox";
  if (pathname.startsWith("/dashboard/projects")) return "Projects";
  if (pathname.startsWith("/dashboard/teams")) return "Teams";
  if (pathname.startsWith("/dashboard/members")) return "Members";
  if (pathname.startsWith("/dashboard/pull-requests")) return "Pull requests";
  return "Dashboard";
}

function DashboardHeader({
  sidebarOpen,
  onToggleSidebar,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const { notifications } = useDashboard();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  const unreadCount = React.useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const pageTitle = getPageTitle(pathname);
  const { theme, setTheme } = useDashboard();

  return (
    <>
      <header className="border-border/80 bg-card/80 flex h-12 shrink-0 items-center gap-3 border-b px-3 sm:h-14 sm:px-4">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={onToggleSidebar}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <HugeiconsIcon
              icon={LayoutIcon}
              className={cn("h-4 w-4 transition-transform")}
            />
          </Button>
          <span className="truncate text-xs font-semibold sm:text-sm">
            {pageTitle}
          </span>
        </div>

        {/* Search input (desktop) */}
        <div className="relative ml-2 hidden flex-1 items-center gap-2 sm:flex">
          <div
            className={cn(
              "pointer-events-none absolute inset-y-1 left-1.5 flex items-center text-muted-foreground transition-opacity",
              searchOpen ? "opacity-100" : "opacity-0",
            )}
          >
            <HugeiconsIcon icon={SearchIcon} className="h-3.5 w-3.5" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues, pull requests, notifications..."
            className={cn(
              "h-8 w-full rounded-md border border-border/80 bg-background/80 pl-7 pr-8 text-xs transition-[max-width,opacity] duration-200",
              searchOpen
                ? "pointer-events-auto max-w-md opacity-100"
                : "pointer-events-none max-w-0 opacity-0",
            )}
          />
          {searchOpen && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground pointer-events-auto absolute right-2 flex h-5 w-5 items-center justify-center rounded-full bg-background/80"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
              }}
              aria-label="Close search"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7 sm:hidden"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Toggle search"
          >
            <HugeiconsIcon icon={SearchIcon} className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-xl"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={
              theme === "light" ? "Switch to dark" : "Switch to light"
            }
          >
            <HugeiconsIcon
              icon={theme === "light" ? MoonIcon : SunIcon}
              className="h-4 w-4"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative h-7 w-7 sm:h-8 sm:w-8"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Open notifications"
          >
            <HugeiconsIcon icon={NotificationIcon} className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>
      </header>

      {/* Mobile search bar overlay */}
      {searchOpen && (
        <div className="border-border/80 bg-card/95 flex items-center gap-2 border-b px-3 py-2 sm:hidden">
          <div className="flex-1 flex items-center gap-2 rounded-md border border-border/80 bg-background/80 px-2">
            <HugeiconsIcon
              icon={SearchIcon}
              className="h-3.5 w-3.5 text-muted-foreground"
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-8 border-0 bg-transparent px-0 text-xs shadow-none focus-visible:ring-0"
            />
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
            aria-label="Close search"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
          </Button>
        </div>
      )}

      <NotificationDrawer
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </>
  );
}

function NotificationDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { notifications } = useDashboard();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <button
        type="button"
        className="bg-black/40 h-full w-full"
        onClick={onClose}
        aria-label="Close notifications"
      />
      <div className="border-border/80 bg-card/95 flex h-full w-full max-w-sm flex-col border-l px-3 py-3 text-xs shadow-lg sm:px-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold">Notifications</h2>
            <p className="text-muted-foreground mt-0.5 text-[11px]">
              Latest activity across your workspace
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={onClose}
            aria-label="Close notifications"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              No notifications
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "hover:bg-muted/70 flex flex-col gap-1 rounded-md border border-border/60 bg-background/80 p-2.5 transition-colors",
                  !item.read && "ring-1 ring-primary/40",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-xs font-medium">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-[11px]">
                      {item.body}
                    </p>
                  </div>
                  <span className="text-muted-foreground shrink-0 text-[10px]">
                    {item.createdAt}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-muted-foreground inline-flex items-center gap-1 text-[11px]">
                    <Badge
                      variant="outline"
                      className="border-border/70 bg-muted/40 px-1.5 text-[10px]"
                    >
                      {item.projectKey}
                    </Badge>
                    <span className="truncate">
                      {item.type.replace("_", " ")}
                    </span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="h-6 w-6 shrink-0"
                    aria-label="Open in inbox"
                  >
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="h-3.5 w-3.5"
                    />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
