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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Mail01Icon,
  LinkSquareIcon,
  Shield01Icon,
  UserGroupIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  HelpCircleIcon,
  LayoutIcon,
  FileIcon,
  ArrowLeft01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

type HugeIconType = React.ComponentProps<typeof HugeiconsIcon>["icon"];

export function Sidebar() {
  const pathname = usePathname();
  const {
    workspace,
    setWorkspace,
    workspaces,
    addWorkspace,
    projects,
    notifications,
  } = useDashboard();
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = React.useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = React.useState("");
  const [openProjectId, setOpenProjectId] = React.useState<string | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleCreateWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    addWorkspace(newWorkspaceName.trim());
    setNewWorkspaceName("");
    setCreateWorkspaceOpen(false);
  };

  return (
    <aside
      className={cn(
        "border-border/80 bg-card/85 supports-[backdrop-filter]:bg-card/70 flex h-full min-h-0 shrink-0 flex-col border-r backdrop-blur-xl transition-all duration-300 ease-out",
        collapsed ? "w-18" : "w-72",
      )}
    >
      <div
        className={cn(
          "border-border/70 shrink-0 border-b px-3 py-2",
          collapsed && "px-2",
        )}
      >
        <div
          className={cn(
            "flex h-10 items-center gap-2",
            collapsed && "justify-center",
          )}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={cn(
                    "hover:bg-muted/80 flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left transition-all",
                    collapsed && "w-12 flex-none justify-center px-0 gap-0",
                  )}
                />
              }
            >
              <span className="bg-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-primary-foreground">
                {workspace.name.slice(0, 1).toUpperCase()}
              </span>
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-sm font-semibold transition-all",
                  collapsed ? "hidden" : "opacity-100",
                )}
              >
                {workspace.name}
              </span>
              {!collapsed && (
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60 rounded-xl p-1">
              {workspaces.map((w) => (
                <DropdownMenuItem
                  key={w.id}
                  onClick={() => setWorkspace(w)}
                  className="flex items-center justify-between rounded-lg text-xs"
                >
                  <span>{w.name}</span>
                  {w.id === workspace.id && (
                    <span className="text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setCreateWorkspaceOpen(true);
                }}
                className="flex items-center gap-2 rounded-lg text-xs"
              >
                <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
                Create new workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={cn(
          "grid shrink-0 transition-all duration-300",
          createWorkspaceOpen && !collapsed
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-border/80 flex gap-2 border-y px-3 py-2">
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
        </div>
      </div>

      <div className="flex flex-col gap-1 px-2 py-2">
        <SidebarLink
          href="/dashboard/inbox"
          label="Inbox"
          icon={Mail01Icon}
          active={pathname === "/dashboard/inbox"}
          collapsed={collapsed}
          rightBadge={unreadCount > 0 ? unreadCount : undefined}
        />
        <SidebarLink
          href="/dashboard/my-tasks"
          label="My tasks"
          icon={LayoutIcon}
          active={pathname === "/dashboard/my-tasks"}
          collapsed={collapsed}
        />
        <SidebarLink
          href="/dashboard/pull-requests"
          label="Pull requests"
          icon={LinkSquareIcon}
          active={pathname === "/dashboard/pull-requests"}
          collapsed={collapsed}
        />
      </div>

      <SectionTitle label="Workspace" collapsed={collapsed} />
      <div className="space-y-1 px-2">
        <SidebarLink
          href="/dashboard/teams"
          label="Teams"
          icon={Shield01Icon}
          active={pathname === "/dashboard/teams"}
          collapsed={collapsed}
        />
        <SidebarLink
          href="/dashboard/projects"
          label="Projects"
          icon={LinkSquareIcon}
          active={pathname === "/dashboard/projects"}
          collapsed={collapsed}
        />
        <SidebarLink
          href="/dashboard/members"
          label="Members"
          icon={UserGroupIcon}
          active={pathname === "/dashboard/members"}
          collapsed={collapsed}
        />
      </div>

      <SectionTitle label="Projects" collapsed={collapsed} />
      <div className="flex-1 overflow-auto px-2 pb-2">
        <div className="space-y-1">
          {projects.map((project) => {
            const basePath = `/dashboard/projects/${project.id}`;
            const isAnyProjectRoute = pathname.startsWith(basePath);
            const isOpen = openProjectId === project.id;

            if (collapsed) {
              return (
                <Tooltip key={project.id}>
                  <TooltipTrigger
                    render={
                      <Link
                        href={`${basePath}/tasks`}
                        className={cn(
                          "hover:bg-muted/70 w-12 mx-auto flex items-center justify-center rounded-xl border border-transparent px-2 py-2 transition-colors",
                          isAnyProjectRoute && "border-border/60 bg-muted/60",
                        )}
                      />
                    }
                  >
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold text-white",
                        project.color,
                      )}
                    >
                      {project.code.slice(0, 1)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="right">{project.name}</TooltipContent>
                </Tooltip>
              );
            }

            return (
              <div
                key={project.id}
                className={cn(
                  "border-border/60 rounded-xl border bg-background/30 px-2 py-1.5 transition-all",
                  isAnyProjectRoute && "bg-muted/60",
                )}
              >
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="hover:bg-muted/70 flex flex-1 items-center gap-2 rounded-lg px-1.5 py-1 text-left"
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
                          className="h-6 w-6 shrink-0 rounded-lg"
                          aria-label="Project menu"
                        />
                      }
                    >
                      <HugeiconsIcon
                        icon={MoreHorizontalIcon}
                        className="h-3.5 w-3.5 text-muted-foreground"
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-52 rounded-xl p-1 text-xs"
                    >
                      <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                        <HugeiconsIcon
                          icon={SettingsIcon}
                          className="h-3.5 w-3.5"
                        />
                        Project settings
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                        <HugeiconsIcon
                          icon={LinkSquareIcon}
                          className="h-3.5 w-3.5"
                        />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                        <HugeiconsIcon
                          icon={FileIcon}
                          className="h-3.5 w-3.5"
                        />
                        Open archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 rounded-lg">
                        <HugeiconsIcon
                          icon={Mail01Icon}
                          className="h-3.5 w-3.5"
                        />
                        Subscribe
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive flex items-center gap-2 rounded-lg">
                        Leave project…
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={cn(
          "border-border/70 shrink-0 border-t px-3 py-2",
          collapsed && "px-2",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-2",
            collapsed && "justify-center gap-1",
          )}
        >
          <SidebarIconButton
            icon={SettingsIcon}
            label="Settings"
            collapsed={collapsed}
          />
          <div
            className={cn(
              "transition-all duration-150 max-md:hidden",
              collapsed ? "fixed -right-4 z-50" : "ml-auto",
            )}
          >
            <SidebarIconButton
              icon={ArrowLeft01Icon}
              label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              collapsed={collapsed}
              className={cn("ml-auto", collapsed && "ml-0")}
              onClick={() => setCollapsed((prev) => !prev)}
              iconClassName={cn(
                "transition-transform duration-300",
                collapsed && "rotate-180 text-white",
              )}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({
  label,
  collapsed,
}: {
  label: string;
  collapsed: boolean;
}) {
  return (
    <div
      className={cn(
        "text-muted-foreground mb-1 mt-2 px-3 text-[11px] font-medium uppercase tracking-wide transition-all",
        collapsed && "text-center text-[10px]",
      )}
    >
      {collapsed ? "----" : label}
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
  collapsed,
  rightBadge,
}: {
  href: string;
  label: string;
  icon: HugeIconType;
  active: boolean;
  collapsed: boolean;
  rightBadge?: number;
}) {
  const linkNode = (
    <Link
      href={href}
      className={cn(
        "hover:bg-muted/80 group flex items-center gap-2 rounded-xl px-2 py-2 text-sm transition-all",
        active && "bg-muted font-medium",
        collapsed && "w-11 mx-auto justify-center",
      )}
    >
      <span className="bg-background/70 text-muted-foreground group-hover:text-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border/60 transition-colors">
        <HugeiconsIcon icon={icon} className="h-4 w-4" />
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && rightBadge && (
        <span className="bg-primary text-primary-foreground ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-medium">
          {rightBadge}
        </span>
      )}
    </Link>
  );

  if (!collapsed) return linkNode;

  return (
    <Tooltip>
      <TooltipTrigger render={linkNode} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
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
  icon: HugeIconType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-muted/80 text-muted-foreground flex items-center gap-1 rounded-full px-2 py-0.5 text-sm transition-colors",
        active && "bg-primary/10 text-primary hover:bg-primary/15",
      )}
    >
      <HugeiconsIcon icon={icon} className="h-3 w-3" />
      <span>{label}</span>
    </Link>
  );
}

function SidebarIconButton({
  icon,
  label,
  collapsed,
  className,
  onClick,
  iconClassName,
}: {
  icon: HugeIconType;
  label: string;
  collapsed: boolean;
  className?: string;
  onClick?: () => void;
  iconClassName?: string;
}) {
  const btn = (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8 rounded-xl", className)}
      aria-label={label}
      onClick={onClick}
    >
      <HugeiconsIcon icon={icon} className={cn("h-4 w-4", iconClassName)} />
    </Button>
  );

  if (!collapsed) return btn;

  return (
    <Tooltip>
      <TooltipTrigger render={btn} />
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
