/* eslint-disable @next/next/no-img-element */
"use client";

import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoonIcon, SunIcon, PlusSignIcon } from "@hugeicons/core-free-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type View = "inbox" | "pull-requests" | "issues" | "tasks";

type Project = {
  id: string;
  name: string;
  code: string;
  team: string;
  color: string;
};

const projects: Project[] = [
  {
    id: "ln-ui",
    name: "LNDev UI",
    code: "LNU",
    team: "Design System",
    color: "bg-emerald-500",
  },
  {
    id: "pm-core",
    name: "Project Manager Core",
    code: "PMC",
    team: "Platform",
    color: "bg-sky-500",
  },
  {
    id: "crm-sync",
    name: "CRM Sync Service",
    code: "CRM",
    team: "Integrations",
    color: "bg-violet-500",
  },
  {
    id: "ai-review",
    name: "AI Review Assistant",
    code: "AIR",
    team: "AI Research",
    color: "bg-amber-500",
  },
];

const views: { id: View; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "pull-requests", label: "Pull Requests" },
  { id: "issues", label: "Issues" },
  { id: "tasks", label: "Tasks" },
];

const inboxItems = [
  {
    id: "inbox-1",
    type: "Pull request",
    title: "Refactor button component for accessibility",
    project: "LNUI-101",
    ago: "10h",
    status: "Open",
    badgeColor: "bg-emerald-100 text-emerald-700",
    description:
      "Updated contrast tokens and focus rings based on the new design spec.",
  },
  {
    id: "inbox-2",
    type: "Issue comment",
    title: "Optimize animations for smoother UI transitions",
    project: "LNUI-204",
    ago: "4d",
    status: "Review",
    badgeColor: "bg-indigo-100 text-indigo-700",
    description:
      "Performance metrics look good on desktop; need another pass on mobile.",
  },
  {
    id: "inbox-3",
    type: "Pull request",
    title: "Implement dark mode toggle with system preferences",
    project: "LNUI-309",
    ago: "6d",
    status: "Merged",
    badgeColor: "bg-slate-100 text-slate-700",
    description:
      "Follow-up to clean up legacy tokens and deprecated theme flags.",
  },
  {
    id: "inbox-4",
    type: "Issue comment",
    title: "Improve navbar responsiveness",
    project: "LNUI-501",
    ago: "18d",
    status: "In progress",
    badgeColor: "bg-amber-100 text-amber-700",
    description:
      "QA found a regression on Safari; captured details in the issue thread.",
  },
];

const pullRequestColumns = [
  {
    id: "in-progress",
    title: "In Progress",
    count: 4,
    items: [
      {
        id: "PR-524",
        key: "LNU-524",
        title: "Implement search bar with auto-complete",
        tags: ["Performance", "Sidebar"],
        updatedAt: "Apr 02",
      },
      {
        id: "PR-520",
        key: "LNU-520",
        title: "Enhance loading indicator performance",
        tags: ["Testing", "Navigation"],
        updatedAt: "Mar 29",
      },
      {
        id: "PR-508",
        key: "LNU-508",
        title: "Update modal animations",
        tags: ["Dropdowns"],
        updatedAt: "Mar 17",
      },
      {
        id: "PR-517",
        key: "LNU-517",
        title: "Enhance breadcrumb navigation usability",
        tags: ["Data tables"],
        updatedAt: "Mar 21",
      },
    ],
  },
  {
    id: "review",
    title: "Technical Review",
    count: 6,
    items: [
      {
        id: "PR-525",
        key: "LNU-525",
        title: "Update alert system for critical notifications",
        tags: ["Sidebar"],
        updatedAt: "Apr 03",
      },
      {
        id: "PR-513",
        key: "LNU-513",
        title: "Refactor accordion for smoother transitions",
        tags: ["Core components"],
        updatedAt: "Mar 22",
      },
      {
        id: "PR-505",
        key: "LNU-505",
        title: "Improve tooltip interactivity",
        tags: ["Cards"],
        updatedAt: "Mar 14",
      },
      {
        id: "PR-415",
        key: "LNU-415",
        title: "Design new modal system with focus trapping",
        tags: ["Modals"],
        updatedAt: "Mar 09",
      },
    ],
  },
  {
    id: "completed",
    title: "Completed",
    count: 8,
    items: [
      {
        id: "PR-518",
        key: "LNU-518",
        title: "Design new icon set for better scalability",
        tags: ["Theming"],
        updatedAt: "Mar 27",
      },
      {
        id: "PR-501",
        key: "LNU-501",
        title: "Implement carousel with lazy loading",
        tags: ["Core components"],
        updatedAt: "Mar 23",
      },
      {
        id: "PR-510",
        key: "LNU-510",
        title: "Optimize animations for smoother UI transitions",
        tags: ["Bug fix"],
        updatedAt: "Mar 19",
      },
    ],
  },
  {
    id: "paused",
    title: "Paused",
    count: 3,
    items: [
      {
        id: "PR-511",
        key: "LNU-511",
        title: "Integrate new select component behavior",
        tags: ["Refactor"],
        updatedAt: "Mar 20",
      },
      {
        id: "PR-507",
        key: "LNU-507",
        title: "Fix form validation issues",
        tags: ["Internationalization"],
        updatedAt: "Mar 16",
      },
    ],
  },
];

const issueGroups = [
  {
    id: "backlog",
    title: "Backlog",
    count: 5,
    muted: true,
  },
  {
    id: "today",
    title: "Today",
    count: 3,
    highlighted: true,
  },
  {
    id: "up-next",
    title: "Up next",
    count: 6,
  },
  {
    id: "waiting",
    title: "Waiting on review",
    count: 2,
  },
];

const taskColumns = [
  { id: "in-progress", title: "In Progress", count: 4 },
  { id: "review", title: "Technical Review", count: 6 },
  { id: "completed", title: "Completed", count: 8 },
  { id: "paused", title: "Paused", count: 3 },
];

type TaskColumnId = "in-progress" | "review" | "completed" | "paused";

type Task = {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  priority: "High" | "Medium" | "Low";
  assigneeInitials: string;
  columnId: TaskColumnId;
};
type ProjectTasks = Record<Project["id"], Task[]>;

const initialProjectTasks: ProjectTasks = {
  "ln-ui": [
    {
      id: "T-1",
      title: "Wire up GitHub webhooks",
      description: "Listen for new comments on issues and pull requests.",
      updatedAt: "Today",
      priority: "High",
      assigneeInitials: "PB",
      columnId: "in-progress",
    },
    {
      id: "T-2",
      title: "Design CRM sync mapping",
      description: "Define how CRM deals map to project tasks.",
      updatedAt: "Yesterday",
      priority: "Medium",
      assigneeInitials: "JD",
      columnId: "in-progress",
    },
    {
      id: "T-3",
      title: "Polish Linear-inspired layout",
      description: "Tighten spacing and hover interactions for dashboard.",
      updatedAt: "3d",
      priority: "Low",
      assigneeInitials: "AK",
      columnId: "review",
    },
    {
      id: "T-4",
      title: "Add portfolio demo copy",
      description: "Explain that this dashboard is a UI-only showcase.",
      updatedAt: "1w",
      priority: "Medium",
      assigneeInitials: "MS",
      columnId: "completed",
    },
    {
      id: "T-5",
      title: "Schedule usability review",
      description: "Review the dashboard with a designer for feedback.",
      updatedAt: "2w",
      priority: "High",
      assigneeInitials: "PB",
      columnId: "paused",
    },
  ],
  "pm-core": [
    {
      id: "T-1",
      title: "Implement project permissions model",
      description: "Define roles for owners, collaborators, and viewers.",
      updatedAt: "Today",
      priority: "High",
      assigneeInitials: "PB",
      columnId: "in-progress",
    },
    {
      id: "T-2",
      title: "Optimize dashboard queries",
      description: "Reduce N+1 queries on the main projects overview.",
      updatedAt: "Yesterday",
      priority: "Medium",
      assigneeInitials: "JD",
      columnId: "in-progress",
    },
    {
      id: "T-3",
      title: "Refine activity timeline",
      description: "Group related events to feel more like Linear.",
      updatedAt: "3d",
      priority: "Low",
      assigneeInitials: "AK",
      columnId: "review",
    },
    {
      id: "T-4",
      title: "Ship new project creation flow",
      description: "Inline project creation directly from the dashboard.",
      updatedAt: "5d",
      priority: "Medium",
      assigneeInitials: "MS",
      columnId: "completed",
    },
  ],
  "crm-sync": [
    {
      id: "T-1",
      title: "Configure deal pipeline mapping",
      description: "Align CRM pipeline stages with project statuses.",
      updatedAt: "Today",
      priority: "High",
      assigneeInitials: "PB",
      columnId: "in-progress",
    },
    {
      id: "T-2",
      title: "Add retry policy for webhooks",
      description: "Prevent lost updates when the CRM is unavailable.",
      updatedAt: "2d",
      priority: "Medium",
      assigneeInitials: "JD",
      columnId: "review",
    },
    {
      id: "T-3",
      title: "Document sync edge cases",
      description: "Cover deleted records and reassigned owners.",
      updatedAt: "4d",
      priority: "Low",
      assigneeInitials: "AK",
      columnId: "completed",
    },
  ],
  "ai-review": [
    {
      id: "T-1",
      title: "Tune PR summary prompts",
      description: "Make summaries shorter and more actionable.",
      updatedAt: "Today",
      priority: "High",
      assigneeInitials: "PB",
      columnId: "in-progress",
    },
    {
      id: "T-2",
      title: "Highlight risky changes",
      description: "Flag migrations, auth changes, and deletions.",
      updatedAt: "1d",
      priority: "High",
      assigneeInitials: "JD",
      columnId: "in-progress",
    },
    {
      id: "T-3",
      title: "Improve onboarding walkthrough",
      description: "Explain how AI review fits into the workflow.",
      updatedAt: "3d",
      priority: "Medium",
      assigneeInitials: "AK",
      columnId: "review",
    },
    {
      id: "T-4",
      title: "Ship portfolio demo presets",
      description: "Provide canned examples for this dashboard.",
      updatedAt: "1w",
      priority: "Low",
      assigneeInitials: "MS",
      columnId: "completed",
    },
  ],
};

type Theme = "light" | "dark";

function useTheme() {
  const [theme, setTheme] = React.useState<Theme>("light");

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("pm-theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return;
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    window.localStorage.setItem("pm-theme", theme);
  }, [theme]);

  return { theme, setTheme };
}

export function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [selectedProject, setSelectedProject] = React.useState<Project>(
    projects[0],
  );
  const [projectTasks, setProjectTasks] = React.useState<ProjectTasks>(
    () => initialProjectTasks,
  );
  const [view, setView] = React.useState<View>("inbox");
  const [quickCreateOpen, setQuickCreateOpen] = React.useState(false);

  return (
    <div className="bg-muted/40 text-xs text-foreground flex min-h-screen flex-col md:flex-row">
      <aside className="border-border/80 bg-card/80 w-full shrink-0 border-b backdrop-blur-sm md:h-auto md:w-64 md:border-b-0 md:border-r">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="bg-foreground/90 inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-semibold text-background shadow-sm">
              PM
            </span>
            <div>
              <div className="text-xs font-medium leading-tight">
                Linear-style Manager
              </div>
              <div className="text-muted-foreground text-[11px]">
                Portfolio dashboard UI
              </div>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-border/70 text-[10px] font-normal"
          >
            {theme === "light" ? "Light mode" : "Dark mode"}
          </Badge>
        </div>
        <Separator />
        <div className="px-3 py-3">
          <div className="text-muted-foreground mb-1 text-[11px] font-medium">
            Projects
          </div>
          <div className="space-y-1">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedProject(project)}
                className={cn(
                  "hover:bg-muted/80 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[11px] transition-colors",
                  selectedProject.id === project.id &&
                    "bg-muted/90 ring-1 ring-border/80",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-4 w-4 items-center justify-center rounded-sm text-[9px] font-semibold text-background",
                    project.color,
                  )}
                >
                  {project.code[0]}
                </span>
                <div className="flex-1 truncate">
                  <div className="truncate font-medium">{project.name}</div>
                  <div className="text-muted-foreground truncate text-[10px]">
                    {project.team}
                  </div>
                </div>
                {selectedProject.id === project.id && (
                  <span className="bg-emerald-500/80 h-1.5 w-1.5 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
        <Separator />
        <div className="px-3 py-3">
          <div className="text-muted-foreground mb-1 text-[11px] font-medium">
            Views
          </div>
          <div className="space-y-0.5">
            {views.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={cn(
                  "hover:bg-muted/80 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[11px] transition-colors",
                  view === item.id && "bg-foreground text-background",
                )}
              >
                <span
                  className={cn(
                    "truncate",
                    view === item.id && "font-medium",
                  )}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-border/80 bg-card/80 sticky top-0 z-10 flex h-14 items-center gap-3 border-b px-5 backdrop-blur-sm">
          <div className="flex flex-1 items-center gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Project
              </div>
              <div className="flex items-baseline gap-2">
                <div className="truncate text-sm font-medium">
                  {selectedProject.name}
                </div>
                <Badge
                  variant="outline"
                  className="border-dashed px-1.5 py-0 text-[10px] font-normal uppercase tracking-wide"
                >
                  {selectedProject.code}
                </Badge>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <nav className="hidden items-center gap-1 sm:flex">
              {views.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={cn(
                    "hover:bg-muted/80 text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium transition-colors",
                    view === item.id &&
                      "bg-foreground text-background shadow-sm",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center rounded-full border bg-background/80 px-2 text-[11px] sm:flex">
              <span className="text-muted-foreground pr-1">⌘K</span>
              <span className="text-muted-foreground/80 text-[10px]">
                Search issues, PRs, tasks
              </span>
            </div>
            <Input
              placeholder="Quick search"
              className="bg-background/80 h-8 w-28 rounded-full border border-border/80 px-3 text-[11px] placeholder:text-muted-foreground/60 sm:hidden"
            />
            <Separator orientation="vertical" className="hidden h-6 sm:block" />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="h-8 rounded-full px-2.5 text-[11px] font-normal inline-flex items-center gap-1"
              >
                <HugeiconsIcon
                  icon={theme === "light" ? MoonIcon : SunIcon}
                  strokeWidth={2}
                  className="h-3 w-3"
                />
                <span className="hidden sm:inline">
                  {theme === "light" ? "Dark mode" : "Light mode"}
                </span>
                <span className="sm:hidden">
                  {theme === "light" ? "Dark" : "Light"}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuickCreateOpen((open) => !open)}
                className="hidden h-8 rounded-full border-dashed px-3 text-[11px] font-normal sm:inline-flex"
              >
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  className="mr-1 h-3 w-3"
                />
                {quickCreateOpen ? "Close quick create" : "Quick create"}
              </Button>
              <div className="bg-linear-to-tr from-emerald-500/80 via-sky-500/80 to-violet-500/80 flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white shadow-sm">
                PB
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-4 py-4 sm:px-5">
          {quickCreateOpen && (
            <QuickCreateBanner
              view={view}
              onClose={() => setQuickCreateOpen(false)}
            />
          )}
          {view === "inbox" && <InboxView />}
          {view === "pull-requests" && <PullRequestsView />}
          {view === "issues" && <IssuesView />}
          {view === "tasks" && (
            <TasksView
              tasks={projectTasks[selectedProject.id] ?? []}
              onTasksChange={(updatedTasks) =>
                setProjectTasks((current) => ({
                  ...current,
                  [selectedProject.id]: updatedTasks,
                }))
              }
            />
          )}
        </main>
      </div>
    </div>
  );
}

type QuickCreateBannerProps = {
  view: View;
  onClose: () => void;
};

function QuickCreateBanner({ view, onClose }: QuickCreateBannerProps) {
  const label =
    view === "inbox"
      ? "Inbox notification"
      : view === "pull-requests"
        ? "Pull request"
        : view === "issues"
          ? "Issue"
          : "Task";

  return (
    <Card className="mb-4 bg-card/80 ring-border/60 border border-dashed">
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="space-y-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Quick create
          </div>
          <p className="text-muted-foreground text-[11px]">
            This is a portfolio-only surface. In a real app this would open a
            full form to create a new {label.toLowerCase()}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 rounded-full px-3 text-[11px] font-medium"
            onClick={onClose}
          >
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              className="mr-1 h-3 w-3"
            />
            Create {label}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-full text-[12px]"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function InboxView() {
  const [selectedId, setSelectedId] = React.useState<string | null>(
    inboxItems[0]?.id ?? null,
  );

  const selected = inboxItems.find((item) => item.id === selectedId);

  return (
    <div className="grid min-h-[520px] gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.8fr)]">
      <Card className="bg-card/80 ring-border/60 flex flex-col">
        <CardHeader className="border-b border-dashed pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>
                Daily comments across issues and pull requests.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-[10px] font-medium text-emerald-700"
            >
              {inboxItems.length} unread
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto px-0 py-0">
          <ul className="divide-border/80">
            {inboxItems.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "hover:bg-muted/60 flex cursor-pointer gap-3 px-4 py-3 transition-colors",
                  selectedId === item.id && "bg-muted",
                )}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full border border-dashed text-[10px] font-semibold text-muted-foreground">
                  {item.project.split("-")[1]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[12px] font-medium">
                      {item.title}
                    </div>
                    <span className="text-muted-foreground text-[10px]">
                      {item.ago}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground">{item.type}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="font-medium">{item.project}</span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        item.badgeColor,
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-[11px]">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-card/80 ring-border/60 flex flex-col">
        <CardHeader className="border-b border-dashed pb-3">
          <CardTitle>Conversation</CardTitle>
          <CardDescription>
            Focused view of the selected thread.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4 py-4">
          {selected ? (
            <>
              <div className="flex items-start gap-3">
                <div className="bg-linear-to-tr from-emerald-500/80 via-sky-500/80 to-violet-500/80 mt-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white">
                  PB
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">{selected.title}</h3>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                        selected.badgeColor,
                      )}
                    >
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{selected.type}</span>
                    <span>•</span>
                    <span className="font-medium">{selected.project}</span>
                    <span>•</span>
                    <span>Updated {selected.ago} ago</span>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  This is a mock conversation preview tailored for your
                  portfolio. In a real integration, this panel would stream
                  comments from GitHub issues, pull requests, or your CRM so you
                  can triage everything in one place.
                </p>
                <div className="space-y-3 rounded-lg border border-dashed bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Next actions
                    </span>
                    <Badge
                      variant="outline"
                      className="border-amber-200 bg-amber-50 text-[10px] font-medium text-amber-700"
                    >
                      Portfolio-only UI
                    </Badge>
                  </div>
                  <ul className="space-y-1 text-[11px] text-muted-foreground">
                    <li>• Clarify scope and capture feedback in a comment.</li>
                    <li>• Assign owner and estimate effort.</li>
                    <li>• Move linked task or issue to the next column.</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground/80 flex h-full items-center justify-center text-[12px]">
              Select an item from the inbox to see details.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PullRequestsView() {
  const [showOnlyInProgress, setShowOnlyInProgress] = React.useState(false);

  const columnsToRender = React.useMemo(() => {
    const baseColumns = showOnlyInProgress
      ? pullRequestColumns.filter((column) => column.id === "in-progress")
      : pullRequestColumns;

    return baseColumns;
  }, [showOnlyInProgress]);

  function handleToggleFilter() {
    setShowOnlyInProgress((current) => !current);
  }

  function handleNewPullRequest() {
    // For portfolio purposes we simply toggle the filter to focus on in-progress
    // PRs and rely on static data. This keeps the interaction lightweight but
    // obviously interactive.
    setShowOnlyInProgress(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">Pull requests</h2>
          <p className="text-muted-foreground text-[11px]">
            Linear-style board showing all PRs for the active project.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleFilter}
            className="h-8 rounded-full border-dashed px-3 text-[11px] font-normal"
          >
            {showOnlyInProgress ? "Show all columns" : "Filter: In progress"}
          </Button>
          <Button
            size="sm"
            onClick={handleNewPullRequest}
            className="h-8 rounded-full px-3 text-[11px] font-medium"
          >
            New pull request
          </Button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columnsToRender.map((column) => (
          <Card key={column.id} className="bg-card/80 ring-border/60 flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/80" />
                  <CardTitle className="text-[12px] font-medium">
                    {column.title}
                  </CardTitle>
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {column.items.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              {column.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="hover:bg-muted/80 w-full rounded-md border border-transparent bg-background/60 px-2.5 py-2 text-left text-[11px] transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.key}</span>
                    <span className="text-muted-foreground text-[10px]">
                      {item.updatedAt}
                    </span>
                  </div>
                  <div className="mt-0.5 line-clamp-2 text-[11px]">
                    {item.title}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-muted text-muted-foreground inline-flex rounded-full px-1.5 py-0.5 text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IssuesView() {
  const [compact, setCompact] = React.useState(false);

  function handleToggleView() {
    setCompact((current) => !current);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">Issues</h2>
          <p className="text-muted-foreground text-[11px]">
            Focused list of issues grouped by urgency.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleView}
            className="h-8 rounded-full border-dashed px-3 text-[11px] font-normal"
          >
            {compact ? "Expanded view" : "Compact view"}
          </Button>
          <Button
            size="sm"
            className="h-8 rounded-full px-3 text-[11px] font-medium"
          >
            New issue
          </Button>
        </div>
      </div>

      <Card className="bg-card/80 ring-border/60">
        <CardContent className="px-0 py-0">
          <div
            className={cn(
              "grid gap-x-4 gap-y-1 border-b border-dashed px-4 py-2 text-[10px] text-muted-foreground",
              compact
                ? "md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,68px)]"
                : "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,80px)]",
            )}
          >
            <span>Title</span>
            <span>Owner</span>
            <span className="text-right">Status</span>
          </div>
          <div className="divide-y divide-border/80">
            {issueGroups.map((group) => (
              <React.Fragment key={group.id}>
                <div className="bg-muted/40 flex items-center justify-between px-4 py-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="h-1 w-6 rounded-full bg-foreground/20" />
                    {group.title}
                  </div>
                  <span>{group.count}</span>
                </div>
                {Array.from({ length: group.count }).map((_, index) => (
                  <div
                    key={`${group.id}-${index}`}
                    className={cn(
                      "hover:bg-muted/60 grid cursor-pointer gap-x-4 px-4 py-2 text-[11px] transition-colors",
                      compact
                        ? "md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,68px)]"
                        : "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,80px)]",
                    )}
                  >
                    <div className="truncate">
                      <span className="font-medium">LNUI-{100 + index}</span>{" "}
                      <span className="text-muted-foreground">
                        Sample issue title for {group.title.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="bg-linear-to-tr from-emerald-500/80 via-sky-500/80 to-violet-500/80 inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white">
                        {["PB", "JD", "AK", "MS"][index % 4]}
                      </div>
                      <span className="truncate">
                        {["Pavan Borad", "Jane Doe", "Alex Kim", "Maria Singh"][
                          index % 4
                        ]}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="bg-muted text-muted-foreground inline-flex rounded-full px-1.5 py-0.5 text-[10px]">
                        {group.id === "backlog"
                          ? "Todo"
                          : group.id === "today"
                            ? "Today"
                            : group.id === "up-next"
                              ? "This week"
                              : "Waiting"}
                      </span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type TasksViewProps = {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
};

function TasksView({ tasks, onTasksChange }: TasksViewProps) {
  const [groupByStatus, setGroupByStatus] = React.useState(true);
  const [newTaskOpen, setNewTaskOpen] = React.useState(false);
  const [newTaskTitle, setNewTaskTitle] = React.useState("");
  const [newTaskDescription, setNewTaskDescription] = React.useState("");
  const [newTaskPriority, setNewTaskPriority] = React.useState<
    Task["priority"]
  >("Medium");
  const [dragTaskId, setDragTaskId] = React.useState<string | null>(null);

  function handleMoveTask(id: string, direction: "left" | "right") {
    onTasksChange(
      tasks.map((task) => {
        if (task.id !== id) return task;

        const currentIndex = taskColumns.findIndex(
          (column) => column.id === task.columnId,
        );
        const nextIndex =
          direction === "left"
            ? Math.max(0, currentIndex - 1)
            : Math.min(taskColumns.length - 1, currentIndex + 1);

        const nextColumnId = taskColumns[nextIndex].id as TaskColumnId;

        return {
          ...task,
          columnId: nextColumnId,
        };
      }),
    );
  }

  function handleNewTask() {
    setNewTaskOpen(true);
  }

  function handleCreateTask() {
    if (!newTaskTitle.trim()) {
      return;
    }

    const nextNumber = tasks.length + 1;
    const nextTasks: Task[] = [
      {
        id: `T-${nextNumber}`,
        title: newTaskTitle.trim(),
        description:
          newTaskDescription.trim() ||
          "This task was created from the New task button for your portfolio demo.",
        updatedAt: "Just now",
        priority: newTaskPriority,
        assigneeInitials: "PB",
        columnId: "in-progress",
      },
      ...tasks,
    ];

    onTasksChange(nextTasks);

    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("Medium");
    setNewTaskOpen(false);
  }

  function handleToggleGrouping() {
    setGroupByStatus((value) => !value);
  }

  function handleTogglePriority(id: string) {
    onTasksChange(
      tasks.map((task) => {
        if (task.id !== id) return task;
        const order: Task["priority"][] = ["High", "Medium", "Low"];
        const index = order.indexOf(task.priority);
        const next = order[(index + 1) % order.length];
        return { ...task, priority: next };
      }),
    );
  }

  function handleDragStart(taskId: string) {
    setDragTaskId(taskId);
  }

  function handleDragEnd() {
    setDragTaskId(null);
  }

  function handleDropOnColumn(columnId: TaskColumnId) {
    if (!dragTaskId) return;
    onTasksChange(
      tasks.map((task) =>
        task.id === dragTaskId ? { ...task, columnId } : task,
      ),
    );
    setDragTaskId(null);
  }

  const tasksByColumn = taskColumns.map((column) => ({
    column,
    tasks: tasks.filter((task) => task.columnId === column.id),
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium">Tasks</h2>
          <p className="text-muted-foreground text-[11px]">
            Lightweight CRM-style view for project execution.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleGrouping}
            className="h-8 rounded-full border-dashed px-3 text-[11px] font-normal"
          >
            {groupByStatus ? "Show as list" : "Group by status"}
          </Button>
          <Button
            size="sm"
            onClick={handleNewTask}
            className="h-8 rounded-full px-3 text-[11px] font-medium"
          >
            New task
          </Button>
        </div>
      </div>

      <AlertDialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Create new task</AlertDialogTitle>
            <AlertDialogDescription>
              This is a portfolio-only dialog. Use it to demonstrate how tasks
              would be created in a real integration.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2 text-[11px]">
            <div className="space-y-1">
              <label className="text-xs font-medium" htmlFor="new-task-title">
                Title
              </label>
              <Input
                id="new-task-title"
                value={newTaskTitle}
                onChange={(event) => setNewTaskTitle(event.target.value)}
                placeholder="Add a short, descriptive title"
                className="h-8 text-[11px]"
              />
            </div>
            <div className="space-y-1">
              <label
                className="text-xs font-medium"
                htmlFor="new-task-description"
              >
                Description
              </label>
              <textarea
                id="new-task-description"
                value={newTaskDescription}
                onChange={(event) =>
                  setNewTaskDescription(event.target.value)
                }
                placeholder="Optional details for this task"
                className="bg-background border-input focus-visible:ring-ring/50 min-h-[72px] w-full rounded-md border px-2 py-1 text-[11px] outline-none"
              />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium">Priority</span>
              <div className="flex gap-1.5">
                {(["High", "Medium", "Low"] as Task["priority"][]).map(
                  (level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setNewTaskPriority(level)}
                      className={cn(
                        "hover:bg-muted/80 border-input text-muted-foreground inline-flex flex-1 items-center justify-center rounded-full border px-2 py-1 text-[10px] transition-colors",
                        newTaskPriority === level &&
                          "bg-foreground text-background",
                      )}
                    >
                      {level}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              size="sm"
              onClick={handleCreateTask}
              disabled={!newTaskTitle.trim()}
            >
              Create task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        className={cn(
          "grid gap-3",
          groupByStatus ? "md:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-1",
        )}
      >
        {tasksByColumn.map(({ column, tasks: columnTasks }, columnIndex) => (
          <Card
            key={column.id}
            className="bg-card/80 ring-border/60 flex flex-col"
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={() => handleDropOnColumn(column.id as TaskColumnId)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      [
                        "bg-sky-500/80",
                        "bg-amber-500/80",
                        "bg-emerald-500/80",
                        "bg-slate-400/80",
                      ][columnIndex % 4],
                    )}
                  />
                  <CardTitle className="text-[12px] font-medium">
                    {column.title}
                  </CardTitle>
                </div>
                <span className="text-muted-foreground text-[10px]">
                  {columnTasks.length}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
              {columnTasks.map((task) => {
                const columnIndexForTask = taskColumns.findIndex(
                  (c) => c.id === task.columnId,
                );
                const isFirstColumn = columnIndexForTask === 0;
                const isLastColumn =
                  columnIndexForTask === taskColumns.length - 1;
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "hover:bg-muted/80 w-full rounded-md border border-transparent bg-background/60 px-2.5 py-2 text-left text-[11px] transition-colors",
                      dragTaskId === task.id && "opacity-60",
                    )}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium">{task.title}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {task.updatedAt}
                      </span>
                    </div>
                    <div className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                      {task.description}
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePriority(task.id)}
                          className="bg-muted text-muted-foreground inline-flex rounded-full px-1.5 py-0.5 text-[10px]"
                        >
                          Priority: {task.priority}
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="bg-linear-to-tr from-emerald-500/80 via-sky-500/80 to-violet-500/80 inline-flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white">
                          {task.assigneeInitials}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isFirstColumn}
                            onClick={() => handleMoveTask(task.id, "left")}
                            className="h-6 w-6 rounded-full border-dashed text-[11px]"
                          >
                            ←
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            disabled={isLastColumn}
                            onClick={() => handleMoveTask(task.id, "right")}
                            className="h-6 w-6 rounded-full border-dashed text-[11px]"
                          >
                            →
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

