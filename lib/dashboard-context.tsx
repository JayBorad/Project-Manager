"use client";

import * as React from "react";
import type { Theme, Workspace, Project, User, Notification, Issue, PullRequest, Team, ProjectDetail, UserDetail } from "./data";
import {
  WORKSPACES,
  TEAMS,
  getProjectsByWorkspace,
  getInitialIssues,
  getInitialNotifications,
  getInitialPullRequests,
  getProjectDetails,
  getUserDetails,
} from "./data";

type DashboardContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  workspace: Workspace;
  setWorkspace: (w: Workspace) => void;
  workspaces: Workspace[];
  projects: Project[];
  currentUser: User;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  pullRequests: PullRequest[];
  setPullRequests: React.Dispatch<React.SetStateAction<PullRequest[]>>;
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  projectDetails: ProjectDetail[];
  setProjectDetails: React.Dispatch<React.SetStateAction<ProjectDetail[]>>;
  userDetails: UserDetail[];
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetail[]>>;
  addWorkspace: (name: string) => void;
};

const CurrentUser: User = {
  id: "u1",
  name: "Pavan Borad",
  initials: "PB",
  color: "from-emerald-500 to-sky-500",
};

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("dark");
  const [workspace, setWorkspace] = React.useState<Workspace>(WORKSPACES[0]);
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>(WORKSPACES);
  const [notifications, setNotifications] = React.useState<Notification[]>(() =>
    getInitialNotifications()
  );
  const [issues, setIssues] = React.useState<Issue[]>(() =>
    getInitialIssues(CurrentUser.id)
  );
  const [pullRequests, setPullRequests] = React.useState<PullRequest[]>(() =>
    getInitialPullRequests(CurrentUser.id)
  );
  const [teams, setTeams] = React.useState<Team[]>(TEAMS);
  const [projectDetails, setProjectDetails] = React.useState<ProjectDetail[]>(getProjectDetails);
  const [userDetails, setUserDetails] = React.useState<UserDetail[]>(getUserDetails);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("pm-theme");
    if (stored === "light" || stored === "dark") setThemeState(stored);
    else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setThemeState("dark");
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("pm-theme", theme);
  }, [theme]);

  const setTheme = React.useCallback((t: Theme) => setThemeState(t), []);

  const projects = React.useMemo(
    () => getProjectsByWorkspace(workspace.id),
    [workspace.id]
  );

  const addWorkspace = React.useCallback((name: string) => {
    const id = `ws-${Date.now()}`;
    setWorkspaces((prev) => [...prev, { id, name }]);
    setWorkspace({ id, name });
  }, []);

  const value: DashboardContextValue = {
    theme,
    setTheme,
    workspace,
    setWorkspace,
    workspaces,
    projects,
    currentUser: CurrentUser,
    notifications,
    setNotifications,
    issues,
    setIssues,
    pullRequests,
    setPullRequests,
    teams,
    setTeams,
    projectDetails,
    setProjectDetails,
    userDetails,
    setUserDetails,
    addWorkspace,
  };

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
