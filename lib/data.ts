// Shared types and dummy data for dashboard

export type Theme = "light" | "dark";

export type Workspace = {
  id: string;
  name: string;
};

export type Project = {
  id: string;
  name: string;
  code: string;
  team: string;
  color: string;
  workspaceId: string;
};

export type User = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type IssueStatusId =
  | "in-progress"
  | "technical-review"
  | "completed"
  | "paused"
  | "todo"
  | "backlog";

export type Issue = {
  id: string;
  key: string; // e.g. LNUI-524
  title: string;
  description: string;
  statusId: IssueStatusId;
  projectId: string;
  assigneeId: string;
  labels: { name: string; color: string }[];
  updatedAt: string;
  priority: "High" | "Medium" | "Low";
};

export type Notification = {
  id: string;
  type: "pull_request" | "issue_comment" | "mention" | "assign";
  title: string;
  body: string;
  projectKey: string;
  relatedId: string;
  createdAt: string; // ISO or "10h ago" style
  read: boolean;
  attachments: { id: string; name: string; url: string }[];
  comments: { id: string; authorId: string; text: string; createdAt: string }[];
};

export const ISSUE_STATUSES: { id: IssueStatusId; title: string; iconColor: string }[] = [
  { id: "in-progress", title: "In Progress", iconColor: "bg-amber-500" },
  { id: "technical-review", title: "Technical Review", iconColor: "bg-emerald-500" },
  { id: "completed", title: "Completed", iconColor: "bg-violet-500" },
  { id: "paused", title: "Paused", iconColor: "bg-sky-500" },
  { id: "todo", title: "Todo", iconColor: "bg-orange-500" },
  { id: "backlog", title: "Backlog", iconColor: "bg-zinc-500" },
];

export const WORKSPACES: Workspace[] = [
  { id: "ws-1", name: "Indev-ui" },
  { id: "ws-2", name: "LNDev Core" },
  { id: "ws-3", name: "Ryplix" },
];

export const PROJECTS: Project[] = [
  { id: "ln-ui", name: "LNDev UI", code: "LNUI", team: "Design System", color: "bg-emerald-500", workspaceId: "ws-1" },
  { id: "pm-core", name: "Project Manager Core", code: "PMC", team: "Platform", color: "bg-sky-500", workspaceId: "ws-1" },
  { id: "crm-sync", name: "CRM Sync Service", code: "CRM", team: "Integrations", color: "bg-violet-500", workspaceId: "ws-1" },
  { id: "ai-review", name: "AI Review Assistant", code: "AIR", team: "AI Research", color: "bg-amber-500", workspaceId: "ws-1" },
];

export const USERS: User[] = [
  { id: "u1", name: "Pavan Borad", initials: "PB", color: "from-emerald-500 to-sky-500" },
  { id: "u2", name: "Jane Doe", initials: "JD", color: "from-violet-500 to-amber-500" },
  { id: "u3", name: "Alex Kim", initials: "AK", color: "from-amber-500 to-rose-500" },
  { id: "u4", name: "Maria Singh", initials: "MS", color: "from-sky-500 to-emerald-500" },
];

export const LABEL_OPTIONS: { name: string; color: string }[] = [
  { name: "Bug", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  { name: "Testing", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  { name: "Documentation", color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400" },
  { name: "Design", color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400" },
  { name: "Performance", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  { name: "Accessibility", color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400" },
  { name: "Refactor", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  { name: "Feature", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  { name: "LNDev UI - Sidebar", color: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300" },
];

const LABEL_PRESETS = LABEL_OPTIONS;

function pickLabels(n: number): Issue["labels"] {
  return LABEL_PRESETS.slice(0, n).map((l) => ({ name: l.name, color: l.color }));
}

export function getInitialIssues(currentUserId: string): Issue[] {
  return [
    { id: "i1", key: "LNUI-524", title: "Implement Search bar with auto-complete", description: "Add search with suggestions and keyboard nav.", statusId: "in-progress", projectId: "ln-ui", assigneeId: currentUserId, labels: pickLabels(2), updatedAt: "Apr 02", priority: "High" },
    { id: "i2", key: "LNUI-520", title: "Enhance Loading indicator performance", description: "Reduce layout shift and improve perceived performance.", statusId: "in-progress", projectId: "ln-ui", assigneeId: "u2", labels: pickLabels(2), updatedAt: "Mar 29", priority: "Medium" },
    { id: "i3", key: "LNUI-525", title: "Update Alert system for critical notifications", description: "Support critical vs info styling and actions.", statusId: "technical-review", projectId: "ln-ui", assigneeId: currentUserId, labels: pickLabels(2), updatedAt: "Apr 03", priority: "High" },
    { id: "i4", key: "LNUI-513", title: "Refactor accordion for smoother transitions", description: "Use CSS transitions for expand/collapse.", statusId: "technical-review", projectId: "ln-ui", assigneeId: "u3", labels: pickLabels(1), updatedAt: "Mar 22", priority: "Low" },
    { id: "i5", key: "LNUI-518", title: "Design new icon set for better scalability", description: "SVG-based icons with consistent stroke.", statusId: "completed", projectId: "ln-ui", assigneeId: "u4", labels: pickLabels(1), updatedAt: "Mar 27", priority: "Medium" },
    { id: "i6", key: "LNUI-501", title: "Implement carousel with lazy loading", description: "Lazy load slides and support touch.", statusId: "completed", projectId: "ln-ui", assigneeId: currentUserId, labels: pickLabels(2), updatedAt: "Mar 23", priority: "Medium" },
    { id: "i7", key: "LNUI-511", title: "Integrate new select component behavior", description: "Align with design system select API.", statusId: "paused", projectId: "ln-ui", assigneeId: "u2", labels: pickLabels(1), updatedAt: "Mar 20", priority: "Low" },
    { id: "i8", key: "LNUI-507", title: "Fix form validation issues", description: "Show inline errors and prevent submit when invalid.", statusId: "paused", projectId: "ln-ui", assigneeId: currentUserId, labels: pickLabels(2), updatedAt: "Mar 16", priority: "High" },
    { id: "i9", key: "LNUI-530", title: "Add keyboard shortcuts for navigation", description: "Cmd+K search, arrow keys in lists.", statusId: "todo", projectId: "ln-ui", assigneeId: "u3", labels: pickLabels(1), updatedAt: "Apr 01", priority: "Medium" },
    { id: "i10", key: "LNUI-531", title: "Document component usage in Storybook", description: "Add stories for all public components.", statusId: "todo", projectId: "ln-ui", assigneeId: "u4", labels: pickLabels(2), updatedAt: "Mar 30", priority: "Low" },
    { id: "i11", key: "LNUI-532", title: "Explore virtualized list for long lists", description: "Research react-window vs custom.", statusId: "backlog", projectId: "ln-ui", assigneeId: currentUserId, labels: pickLabels(1), updatedAt: "Mar 28", priority: "Low" },
    { id: "i12", key: "LNUI-533", title: "Add dark mode tokens", description: "Define CSS variables for dark theme.", statusId: "backlog", projectId: "ln-ui", assigneeId: "u2", labels: pickLabels(2), updatedAt: "Mar 25", priority: "Medium" },
    // PMC issues for current user
    { id: "i13", key: "PMC-101", title: "Implement project permissions model", description: "Roles: owner, collaborator, viewer.", statusId: "in-progress", projectId: "pm-core", assigneeId: currentUserId, labels: pickLabels(2), updatedAt: "Today", priority: "High" },
    { id: "i14", key: "PMC-102", title: "Optimize dashboard queries", description: "Reduce N+1 on projects overview.", statusId: "technical-review", projectId: "pm-core", assigneeId: currentUserId, labels: pickLabels(1), updatedAt: "Yesterday", priority: "Medium" },
    { id: "i15", key: "PMC-103", title: "Ship new project creation flow", description: "Inline create from dashboard.", statusId: "completed", projectId: "pm-core", assigneeId: currentUserId, labels: pickLabels(2), updatedAt: "5d", priority: "Medium" },
  ];
}

export function getInitialNotifications(): Notification[] {
  return [
    { id: "n1", type: "pull_request", title: "Refactor button component for accessibility", body: "Updated contrast tokens and focus rings based on the new design spec.", projectKey: "LNUI-101", relatedId: "pr-1", createdAt: "10h ago", read: false, attachments: [], comments: [{ id: "c1", authorId: "u2", text: "LGTM, please add a story for focus state.", createdAt: "9h ago" }] },
    { id: "n2", type: "issue_comment", title: "Optimize animations for smoother UI transitions", body: "Performance metrics look good on desktop; need another pass on mobile.", projectKey: "LNUI-204", relatedId: "issue-2", createdAt: "4d ago", read: false, attachments: [{ id: "a1", name: "metrics.pdf", url: "#" }], comments: [] },
    { id: "n3", type: "pull_request", title: "Implement dark mode toggle with system preferences", body: "Follow-up to clean up legacy tokens and deprecated theme flags.", projectKey: "LNUI-309", relatedId: "pr-3", createdAt: "6d ago", read: true, attachments: [], comments: [] },
    { id: "n4", type: "assign", title: "Improve navbar responsiveness", body: "You have been assigned to this issue.", projectKey: "LNUI-501", relatedId: "issue-4", createdAt: "18d ago", read: false, attachments: [], comments: [] },
    { id: "n5", type: "mention", title: "Review needed: Modal focus trap", body: "@Pavan please review the focus trap implementation.", projectKey: "LNUI-415", relatedId: "pr-5", createdAt: "2d ago", read: false, attachments: [], comments: [] },
    { id: "n6", type: "pull_request", title: "Refactor button component for accessibility", body: "Updated contrast tokens and focus rings based on the new design spec.", projectKey: "LNUI-101", relatedId: "pr-1", createdAt: "10h ago", read: false, attachments: [], comments: [{ id: "c1", authorId: "u2", text: "LGTM, please add a story for focus state.", createdAt: "9h ago" }] },
    { id: "n7", type: "issue_comment", title: "Optimize animations for smoother UI transitions", body: "Performance metrics look good on desktop; need another pass on mobile.", projectKey: "LNUI-204", relatedId: "issue-2", createdAt: "4d ago", read: false, attachments: [{ id: "a1", name: "metrics.pdf", url: "#" }], comments: [] },
    { id: "n8", type: "pull_request", title: "Implement dark mode toggle with system preferences", body: "Follow-up to clean up legacy tokens and deprecated theme flags.", projectKey: "LNUI-309", relatedId: "pr-3", createdAt: "6d ago", read: true, attachments: [], comments: [] },
    { id: "n9", type: "assign", title: "Improve navbar responsiveness", body: "You have been assigned to this issue.", projectKey: "LNUI-501", relatedId: "issue-4", createdAt: "18d ago", read: false, attachments: [], comments: [] },
    { id: "n10", type: "mention", title: "Review needed: Modal focus trap", body: "@Pavan please review the focus trap implementation.", projectKey: "LNUI-415", relatedId: "pr-5", createdAt: "2d ago", read: false, attachments: [], comments: [] },
    { id: "n11", type: "pull_request", title: "Refactor button component for accessibility", body: "Updated contrast tokens and focus rings based on the new design spec.", projectKey: "LNUI-101", relatedId: "pr-1", createdAt: "10h ago", read: false, attachments: [], comments: [{ id: "c1", authorId: "u2", text: "LGTM, please add a story for focus state.", createdAt: "9h ago" }] },
    { id: "n12", type: "issue_comment", title: "Optimize animations for smoother UI transitions", body: "Performance metrics look good on desktop; need another pass on mobile.", projectKey: "LNUI-204", relatedId: "issue-2", createdAt: "4d ago", read: false, attachments: [{ id: "a1", name: "metrics.pdf", url: "#" }], comments: [] },
    { id: "n13", type: "pull_request", title: "Implement dark mode toggle with system preferences", body: "Follow-up to clean up legacy tokens and deprecated theme flags.", projectKey: "LNUI-309", relatedId: "pr-3", createdAt: "6d ago", read: true, attachments: [], comments: [] },
    { id: "n14", type: "assign", title: "Improve navbar responsiveness", body: "You have been assigned to this issue.", projectKey: "LNUI-501", relatedId: "issue-4", createdAt: "18d ago", read: false, attachments: [], comments: [] },
    { id: "n15", type: "mention", title: "Review needed: Modal focus trap", body: "@Pavan please review the focus trap implementation.", projectKey: "LNUI-415", relatedId: "pr-5", createdAt: "2d ago", read: false, attachments: [], comments: [] },
    { id: "n16", type: "pull_request", title: "Refactor button component for accessibility", body: "Updated contrast tokens and focus rings based on the new design spec.", projectKey: "LNUI-101", relatedId: "pr-1", createdAt: "10h ago", read: false, attachments: [], comments: [{ id: "c1", authorId: "u2", text: "LGTM, please add a story for focus state.", createdAt: "9h ago" }] },
    { id: "n17", type: "issue_comment", title: "Optimize animations for smoother UI transitions", body: "Performance metrics look good on desktop; need another pass on mobile.", projectKey: "LNUI-204", relatedId: "issue-2", createdAt: "4d ago", read: false, attachments: [{ id: "a1", name: "metrics.pdf", url: "#" }], comments: [] },
    { id: "n18", type: "pull_request", title: "Implement dark mode toggle with system preferences", body: "Follow-up to clean up legacy tokens and deprecated theme flags.", projectKey: "LNUI-309", relatedId: "pr-3", createdAt: "6d ago", read: true, attachments: [], comments: [] },
    { id: "n19", type: "assign", title: "Improve navbar responsiveness", body: "You have been assigned to this issue.", projectKey: "LNUI-501", relatedId: "issue-4", createdAt: "18d ago", read: false, attachments: [], comments: [] },
    { id: "n20", type: "mention", title: "Review needed: Modal focus trap", body: "@Pavan please review the focus trap implementation.", projectKey: "LNUI-415", relatedId: "pr-5", createdAt: "2d ago", read: false, attachments: [], comments: [] },
  ];
}

export function getProjectsByWorkspace(workspaceId: string): Project[] {
  return PROJECTS.filter((p) => p.workspaceId === workspaceId);
}

export function getIssueStatusId(statusTitle: string): IssueStatusId | undefined {
  return ISSUE_STATUSES.find((s) => s.title === statusTitle)?.id;
}

// Pull Request types
export type PullRequest = {
  id: string;
  number: number;
  title: string;
  description: string;
  projectId: string;
  authorId: string;
  status: "open" | "merged" | "closed";
  createdAt: string;
  updatedAt: string;
  labels: { name: string; color: string }[];
};

export function getInitialPullRequests(currentUserId: string): PullRequest[] {
  return [
    { id: "pr1", number: 524, title: "Implement Search bar with auto-complete", description: "Add search with suggestions", projectId: "ln-ui", authorId: currentUserId, status: "open", createdAt: "Apr 02", updatedAt: "Apr 02", labels: pickLabels(2) },
    { id: "pr2", number: 520, title: "Enhance Loading indicator performance", description: "Reduce layout shift", projectId: "ln-ui", authorId: currentUserId, status: "open", createdAt: "Mar 29", updatedAt: "Mar 29", labels: pickLabels(1) },
    { id: "pr3", number: 518, title: "Design new icon set", description: "SVG-based icons", projectId: "ln-ui", authorId: "u2", status: "merged", createdAt: "Mar 27", updatedAt: "Mar 27", labels: pickLabels(1) },
    { id: "pr4", number: 101, title: "Implement project permissions model", description: "Roles: owner, collaborator", projectId: "pm-core", authorId: currentUserId, status: "open", createdAt: "Today", updatedAt: "Today", labels: pickLabels(2) },
  ];
}

// Team types
export type Team = {
  id: string;
  name: string;
  identifier: string;
  memberIds: string[];
  projectIds: string[];
  workspaceId: string;
};

export const TEAMS: Team[] = [
  { id: "t1", name: "Design System Team", identifier: "DS", memberIds: ["u1", "u2", "u3"], projectIds: ["ln-ui"], workspaceId: "ws-1" },
  { id: "t2", name: "Platform Engineering", identifier: "PE", memberIds: ["u1", "u4"], projectIds: ["pm-core"], workspaceId: "ws-1" },
  { id: "t3", name: "Integrations Team", identifier: "IT", memberIds: ["u2", "u3", "u4"], projectIds: ["crm-sync"], workspaceId: "ws-1" },
  { id: "t4", name: "AI Research", identifier: "AIR", memberIds: ["u1", "u3"], projectIds: ["ai-review"], workspaceId: "ws-1" },
];

// Extended Project type for Projects page
export type ProjectDetail = Project & {
  title: string;
  priority: "urgent" | "high" | "medium" | "low" | "no-priority";
  leadId: string;
  targetDate: string | null;
  status: "active" | "on-hold" | "completed" | "archived";
};

export function getProjectDetails(): ProjectDetail[] {
  return [
    { id: "ln-ui", name: "LNDev UI", code: "LNUI", team: "Design System", color: "bg-emerald-500", workspaceId: "ws-1", title: "Design System Components", priority: "high", leadId: "u1", targetDate: "2024-06-30", status: "active" },
    { id: "pm-core", name: "Project Manager Core", code: "PMC", team: "Platform", color: "bg-sky-500", workspaceId: "ws-1", title: "Core Project Management", priority: "urgent", leadId: "u1", targetDate: "2024-05-15", status: "active" },
    { id: "crm-sync", name: "CRM Sync Service", code: "CRM", team: "Integrations", color: "bg-violet-500", workspaceId: "ws-1", title: "CRM Integration", priority: "medium", leadId: "u2", targetDate: "2024-07-20", status: "on-hold" },
    { id: "ai-review", name: "AI Review Assistant", code: "AIR", team: "AI Research", color: "bg-amber-500", workspaceId: "ws-1", title: "AI Code Review", priority: "low", leadId: "u3", targetDate: null, status: "active" },
  ];
}

// Extended User type for Members page
export type UserDetail = User & {
  email: string;
  status: "member" | "admin" | "guest" | "joined";
  teamIds: string[];
};

export function getUserDetails(): UserDetail[] {
  return [
    { id: "u1", name: "Pavan Borad", initials: "PB", color: "from-emerald-500 to-sky-500", email: "pavan.borad@example.com", status: "admin", teamIds: ["t1", "t2", "t4"] },
    { id: "u2", name: "Jane Doe", initials: "JD", color: "from-violet-500 to-amber-500", email: "jane.doe@example.com", status: "member", teamIds: ["t1", "t3"] },
    { id: "u3", name: "Alex Kim", initials: "AK", color: "from-amber-500 to-rose-500", email: "alex.kim@example.com", status: "member", teamIds: ["t1", "t3", "t4"] },
    { id: "u4", name: "Maria Singh", initials: "MS", color: "from-sky-500 to-emerald-500", email: "maria.singh@example.com", status: "guest", teamIds: ["t2", "t3"] },
  ];
}
