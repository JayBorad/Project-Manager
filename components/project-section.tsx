"use client";

import * as React from "react";
import Link from "next/link";

import { useDashboard } from "@/lib/dashboard-context";
import {
  ISSUE_STATUSES,
  PROJECTS,
  USERS,
  type Issue,
  type IssueStatusId,
  type PullRequest,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LayoutIcon,
  FileIcon,
  LinkSquareIcon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

type ProjectSectionType = "tasks" | "issues" | "pull-requests" | "teams" | "members";

export type ProjectSectionProps = {
  projectId: string;
  section: ProjectSectionType;
};

export function ProjectSection({ projectId, section }: ProjectSectionProps) {
  const {
    issues,
    setIssues,
    pullRequests,
    teams,
    userDetails,
  } = useDashboard();

  const project = React.useMemo(
    () => PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0],
    [projectId]
  );

  const projectIssues = React.useMemo(
    () => issues.filter((i) => i.projectId === projectId),
    [issues, projectId]
  );

  const projectIssuesByStatus = React.useMemo(() => {
    const map: Record<IssueStatusId, Issue[]> = {
      "in-progress": [],
      "technical-review": [],
      completed: [],
      paused: [],
      todo: [],
      backlog: [],
    };
    projectIssues.forEach((issue) => {
      if (map[issue.statusId]) map[issue.statusId].push(issue);
    });
    return map;
  }, [projectIssues]);

  const projectPullRequests = React.useMemo(
    () => pullRequests.filter((pr: PullRequest) => pr.projectId === projectId),
    [pullRequests, projectId]
  );

  const projectTeams = React.useMemo(
    () => teams.filter((t) => t.projectIds.includes(projectId)),
    [teams, projectId]
  );

  const projectMembers = React.useMemo(() => {
    const memberIds = new Set<string>();
    projectTeams.forEach((t) => t.memberIds.forEach((id) => memberIds.add(id)));
    return userDetails.filter((u) => memberIds.has(u.id));
  }, [projectTeams, userDetails]);

  const changeStatus = (issueId: string, statusId: IssueStatusId) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, statusId, updatedAt: "Just now" } : i
      )
    );
  };

  const navItems: { id: ProjectSectionType; label: string; icon: any }[] = [
    { id: "tasks", label: "Tasks", icon: LayoutIcon },
    { id: "issues", label: "Issues", icon: FileIcon },
    { id: "pull-requests", label: "Pull requests", icon: LinkSquareIcon },
    { id: "teams", label: "Teams", icon: UserGroupIcon },
    { id: "members", label: "Members", icon: UserIcon },
  ];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 bg-card/80 flex h-12 shrink-0 items-center justify-between gap-3 border-b px-3 sm:h-14 sm:px-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded text-[10px] font-semibold text-white",
              project.color
            )}
          >
            {project.code.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold sm:text-sm">
              {project.name}
            </div>
            <div className="text-muted-foreground hidden text-[11px] sm:block">
              {project.code} · Project overview
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/dashboard/projects/${projectId}/${item.id}`}
              className={cn(
                "hover:bg-muted/80 text-muted-foreground flex items-center gap-1 rounded-full px-2 py-1 text-[10px] sm:text-xs",
                section === item.id &&
                  "bg-primary/10 text-primary hover:bg-primary/15"
              )}
            >
              <HugeiconsIcon icon={item.icon} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {section === "tasks" && (
          <div className="flex min-w-max gap-3 sm:gap-4">
            {ISSUE_STATUSES.map((status) => {
              const columnIssues = projectIssuesByStatus[status.id];
              return (
                <Card
                  key={status.id}
                  className="bg-card/80 ring-border/60 flex h-full w-[260px] shrink-0 flex-col overflow-hidden sm:w-[280px]"
                >
                  <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("h-2 w-2 shrink-0 rounded-full", status.iconColor)}
                      />
                      <CardTitle className="text-xs font-medium">
                        {status.title}
                      </CardTitle>
                    </div>
                    <span className="text-muted-foreground text-[11px]">
                      {columnIssues.length}
                    </span>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-2 p-2 overflow-y-auto">
                    {columnIssues.length === 0 && (
                      <p className="text-muted-foreground py-4 text-center text-[11px]">
                        No tasks
                      </p>
                    )}
                    {columnIssues.map((issue) => (
                      <ProjectIssueCard
                        key={issue.id}
                        issue={issue}
                        onStatusChange={(statusId) =>
                          changeStatus(issue.id, statusId)
                        }
                      />
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {section === "issues" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Issues · {projectIssues.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              {projectIssues.map((issue) => (
                <ProjectIssueRow key={issue.id} issue={issue} />
              ))}
              {projectIssues.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No issues for this project yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {section === "pull-requests" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Pull requests · {projectPullRequests.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              {projectPullRequests.map((pr) => {
                const author = USERS.find((u) => u.id === pr.authorId);
                return (
                  <div
                    key={pr.id}
                    className="hover:bg-muted/60 flex items-start justify-between gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="font-medium">
                        #{pr.number} · {pr.title}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-[11px]">
                        {pr.description}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{pr.status}</span>
                        <span>·</span>
                        <span>
                          Opened {pr.createdAt} · Updated {pr.updatedAt}
                        </span>
                      </div>
                    </div>
                    {author && (
                      <span
                        className={cn(
                          "bg-linear-to-br flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                          author.color
                        )}
                      >
                        {author.initials}
                      </span>
                    )}
                  </div>
                );
              })}
              {projectPullRequests.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No pull requests for this project yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {section === "teams" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Teams · {projectTeams.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              {projectTeams.map((team) => {
                const members = userDetails.filter((u) =>
                  team.memberIds.includes(u.id)
                );
                return (
                  <div
                    key={team.id}
                    className="hover:bg-muted/60 flex items-center justify-between gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs transition-colors"
                  >
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-muted-foreground text-[11px]">
                        Identifier · {team.identifier}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {members.slice(0, 3).map((m) => (
                        <span
                          key={m.id}
                          className={cn(
                            "bg-linear-to-br flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                            m.color
                          )}
                        >
                          {m.initials}
                        </span>
                      ))}
                      {members.length > 3 && (
                        <span className="text-muted-foreground text-[10px]">
                          +{members.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {projectTeams.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No teams linked to this project yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {section === "members" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Members · {projectMembers.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid flex-1 grid-cols-1 gap-2 overflow-y-auto p-2 sm:grid-cols-2">
              {projectMembers.map((member) => (
                <div
                  key={member.id}
                  className="hover:bg-muted/60 flex items-center gap-3 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs transition-colors"
                >
                  <span
                    className={cn(
                      "bg-linear-to-br flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold text-white",
                      member.color
                    )}
                  >
                    {member.initials}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium">{member.name}</div>
                    <div className="text-muted-foreground truncate text-[11px]">
                      {member.email}
                    </div>
                  </div>
                </div>
              ))}
              {projectMembers.length === 0 && (
                <p className="text-muted-foreground col-span-full py-4 text-center text-xs">
                  No members associated with this project yet.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function ProjectIssueCard({
  issue,
  onStatusChange,
}: {
  issue: Issue;
  onStatusChange: (statusId: IssueStatusId) => void;
}) {
  const assignee = USERS.find((u) => u.id === issue.assigneeId);
  const status = ISSUE_STATUSES.find((s) => s.id === issue.statusId);

  return (
    <div className="hover:bg-muted/80 flex flex-col gap-1.5 rounded-md border border-border/60 bg-background/80 p-2.5 text-left text-xs transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">
          {issue.key}
        </span>
        <Select
          value={issue.statusId}
          onValueChange={(v) => onStatusChange(v as IssueStatusId)}
        >
          <SelectTrigger className="h-6 w-auto gap-1 border-0 bg-transparent px-1.5 text-[10px] shadow-none hover:bg-muted/80">
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", status?.iconColor)} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ISSUE_STATUSES.map((s) => (
              <SelectItem key={s.id} value={s.id} className="text-xs">
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="line-clamp-2 text-xs font-medium">{issue.title}</p>
      <div className="flex flex-wrap gap-1">
        {issue.labels.slice(0, 3).map((l) => (
          <Badge
            key={l.name}
            variant="secondary"
            className={cn("text-[10px] font-normal", l.color)}
          >
            {l.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-1">
        <span className="text-muted-foreground text-[10px]">
          Updated {issue.updatedAt}
        </span>
        {assignee && (
          <span
            className={cn(
              "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
              assignee.color
            )}
          >
            {assignee.initials}
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectIssueRow({ issue }: { issue: Issue }) {
  const assignee = USERS.find((u) => u.id === issue.assigneeId);
  const status = ISSUE_STATUSES.find((s) => s.id === issue.statusId);

  return (
    <div className="hover:bg-muted/60 flex items-center gap-3 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs transition-colors">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">
          {issue.key}
        </span>
        <span
          className={cn("h-2 w-2 shrink-0 rounded-full", status?.iconColor)}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-medium">{issue.title}</p>
        <p className="text-muted-foreground line-clamp-1 text-[11px]">
          {issue.description}
        </p>
      </div>
      {assignee && (
        <span
          className={cn(
            "bg-linear-to-br flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
            assignee.color
          )}
        >
          {assignee.initials}
        </span>
      )}
    </div>
  );
}

