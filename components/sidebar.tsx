"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  MoonIcon,
  SunIcon,
  Mail01Icon,
  LinkSquareIcon,
  Shield01Icon,
  UserGroupIcon,
  MoreHorizontalIcon,
  ArrowRight01Icon,
  SettingsIcon,
  HelpCircleIcon,
  LayoutIcon,
  FileIcon,
} from "@hugeicons/core-free-icons";

export function Sidebar() {
  const pathname = usePathname();
  const {
    theme,
    setTheme,
    workspace,
    setWorkspace,
    workspaces,
    addWorkspace,
    projects,
    notifications,
  } = useDashboard();
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = React.useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = React.useState("");
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [openProjectId, setOpenProjectId] = React.useState<string | null>(null);

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      addWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName("");
      setCreateWorkspaceOpen(false);
    }
  };

  return (
    <aside className="border-border/80 bg-card/80 flex h-full w-64 shrink-0 flex-col border-r backdrop-blur-sm">
      {/* Workspace name + dropdown + theme */}
      <div className="flex h-14 items-center justify-between gap-2 px-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className="hover:bg-muted/80 flex flex-1 items-center gap-2 rounded-md px-2 py-2 text-left outline-none transition-colors cursor-pointer">
              <span className="bg-amber-500 flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold text-white">
                {workspace.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {workspace.name}
              </span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                className="h-4 w-4 shrink-0 text-muted-foreground"
              />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {workspaces.map((w) => (
              <DropdownMenuItem key={w.id} onClick={() => setWorkspace(w)}>
                {w.name}
                {w.id === workspace.id && " ✓"}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setCreateWorkspaceOpen(true);
              }}
            >
              Create new workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={theme === "light" ? "Switch to dark" : "Switch to light"}
        >
          <HugeiconsIcon
            icon={theme === "light" ? MoonIcon : SunIcon}
            className="h-4 w-4"
          />
        </Button>
      </div>

      {/* Create workspace inline form (simplified: could be a dialog) */}
      {createWorkspaceOpen && (
        <div className="border-border/80 flex gap-2 border-t px-3 py-2">
          <input
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            placeholder="Workspace name"
            className="border-input bg-background h-8 flex-1 rounded-md border px-2 text-xs outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleCreateWorkspace()}
          />
          <Button
            size="sm"
            className="h-8 text-xs"
            onClick={handleCreateWorkspace}
          >
            Create
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setCreateWorkspaceOpen(false);
              setNewWorkspaceName("");
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Inbox */}
      <div className="flex flex-col gap-1 px-2 py-1">
          <Link
            href="/dashboard/inbox"
            className={cn(
              "hover:bg-muted/80 flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
              pathname === "/dashboard/inbox" ? "bg-muted font-medium" : "",
            )}
          >
            <HugeiconsIcon
              icon={Mail01Icon}
              className="h-4 w-4 text-muted-foreground"
            />
            Inbox
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                {unreadCount}
              </span>
            )}
          </Link>

          <Link
            href="/dashboard/my-tasks"
            className={cn(
              "hover:bg-muted/80 flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
              pathname === "/dashboard/my-tasks" ? "bg-muted font-medium" : "",
            )}
          >
            <HugeiconsIcon
              icon={LinkSquareIcon}
              className="h-4 w-4 text-muted-foreground"
            />
            My tasks
          </Link>

          <Link
            href="/dashboard/pull-requests"
            className={cn(
              "hover:bg-muted/80 flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
              pathname === "/dashboard/pull-requests"
                ? "bg-muted font-medium"
                : "",
            )}
          >
            <HugeiconsIcon
              icon={LinkSquareIcon}
              className="h-4 w-4 text-muted-foreground"
            />
            Pull requests
          </Link>
      </div>

      {/* Workspace section */}
      <div className="mt-2 px-3">
        <div className="text-muted-foreground mb-1 text-[11px] font-medium uppercase tracking-wide">
          Workspace
        </div>
        <div className="space-y-0.5">
          <Link
            href="/dashboard/teams"
            className={cn(
              "hover:bg-muted/80 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              pathname === "/dashboard/teams" ? "bg-muted font-medium" : "",
            )}
          >
            <HugeiconsIcon
              icon={Shield01Icon}
              className="h-4 w-4 text-muted-foreground"
            />
            Teams
          </Link>
          <Link
            href="/dashboard/projects"
            className={cn(
              "hover:bg-muted/80 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              pathname === "/dashboard/projects" ? "bg-muted font-medium" : "",
            )}
          >
            <HugeiconsIcon
              icon={LinkSquareIcon}
              className="h-4 w-4 text-muted-foreground"
            />
            Projects
          </Link>
          <Link
            href="/dashboard/members"
            className={cn(
              "hover:bg-muted/80 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
              pathname === "/dashboard/members" ? "bg-muted font-medium" : "",
            )}
          >
            <HugeiconsIcon
              icon={UserGroupIcon}
              className="h-4 w-4 text-muted-foreground"
            />
            Members
          </Link>
          <button
            type="button"
            className="hover:bg-muted/80 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm"
          >
            <HugeiconsIcon
              icon={MoreHorizontalIcon}
              className="h-4 w-4 text-muted-foreground"
            />
            More
          </button>
        </div>
      </div>

      {/* Projects navigation */}
      <div className="mt-4 flex-1 overflow-auto px-3">
        <div className="text-muted-foreground mb-1 text-[11px] font-medium uppercase tracking-wide">
          Projects
        </div>
        <div className="space-y-1">
          {projects.map((project) => {
            const basePath = `/dashboard/projects/${project.id}`;
            const isAnyProjectRoute = pathname.startsWith(basePath);
            const isOpen = openProjectId === project.id;
            return (
              <div
                key={project.id}
                className={cn(
                  "border-border/60 hover:bg-muted/50 flex flex-col gap-1 rounded-md border px-2 py-1.5 text-xs transition-colors",
                  isAnyProjectRoute && "bg-muted/70",
                )}
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left"
                    onClick={() =>
                      setOpenProjectId((prev) =>
                        prev === project.id ? null : project.id,
                      )
                    }
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold text-white",
                        project.color,
                      )}
                    >
                      {project.code.slice(0, 1)}
                    </span>
                    <span className="flex-1 truncate text-[12px] font-medium">
                      {project.name}
                    </span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-6 w-6 shrink-0"
                          aria-label="Project menu"
                        />
                      }
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        className="h-3.5 w-3.5 text-muted-foreground"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 text-xs">
                      <DropdownMenuItem>Project settings</DropdownMenuItem>
                      <DropdownMenuItem>Copy link</DropdownMenuItem>
                      <DropdownMenuItem>Open archive</DropdownMenuItem>
                      <DropdownMenuItem>Subscribe</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Leave project…
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {isOpen && (
                  <div className="mt-1 space-y-0.5 pl-6">
                    <ProjectNavItem
                      href={`${basePath}/tasks`}
                      label="Tasks"
                      icon={LayoutIcon}
                      active={pathname === `${basePath}/tasks`}
                    />
                    <ProjectNavItem
                      href={`${basePath}/issues`}
                      label="Issues"
                      icon={FileIcon}
                      active={pathname === `${basePath}/issues`}
                    />
                    <ProjectNavItem
                      href={`${basePath}/pull-requests`}
                      label="Pull requests"
                      icon={LinkSquareIcon}
                      active={pathname === `${basePath}/pull-requests`}
                    />
                    <ProjectNavItem
                      href={`${basePath}/teams`}
                      label="Teams"
                      icon={Shield01Icon}
                      active={pathname === `${basePath}/teams`}
                    />
                    <ProjectNavItem
                      href={`${basePath}/members`}
                      label="Members"
                      icon={UserGroupIcon}
                      active={pathname === `${basePath}/members`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-border/80 flex items-center gap-2 border-t px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Help"
        >
          <HugeiconsIcon icon={HelpCircleIcon} className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          aria-label="Settings"
        >
          <HugeiconsIcon icon={SettingsIcon} className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}

function ProjectNavItem({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: any;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-muted/80 text-muted-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-sm",
        active && "bg-primary/10 text-primary hover:bg-primary/15",
      )}
    >
      <HugeiconsIcon icon={icon} className="h-3 w-3" />
      <span>{label}</span>
    </Link>
  );
}
