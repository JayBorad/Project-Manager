"use client";

import * as React from "react";
import Link from "next/link";

import { useDashboard } from "@/lib/dashboard-context";
import {
  ISSUE_STATUSES,
  LABEL_OPTIONS,
  PROJECTS,
  USERS,
  type Issue,
  type IssueStatusId,
  type PullRequest,
  type Team,
  type UserDetail,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { CreateIssueDialog } from "@/components/create-issue-dialog";
import { IssueDetailDialog } from "@/components/issue-detail-dialog";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  MoreHorizontalCircle01Icon,
  PlusSignIcon,
  SearchIcon,
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
    setPullRequests,
    projects,
    teams,
    setTeams,
    userDetails,
    setUserDetails,
    currentUser,
  } = useDashboard();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createDefaultStatusId, setCreateDefaultStatusId] = React.useState<IssueStatusId>("todo");
  const [statusFilter, setStatusFilter] = React.useState<IssueStatusId[]>([]);
  const [assigneeFilter, setAssigneeFilter] = React.useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = React.useState<Issue["priority"][]>([]);
  const [labelFilter, setLabelFilter] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<"board" | "list">("board");
  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);
  const [filterPanel, setFilterPanel] = React.useState<
    "root" | "status" | "assignee" | "priority" | "labels"
  >("root");
  const [filterSearch, setFilterSearch] = React.useState("");
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [detailIssue, setDetailIssue] = React.useState<Issue | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [issueHeaderSearch, setIssueHeaderSearch] = React.useState("");
  const [issueFilterMenuOpen, setIssueFilterMenuOpen] = React.useState(false);
  const [issueFilterPanel, setIssueFilterPanel] = React.useState<
    "root" | "creator" | "status" | "date"
  >("root");
  const [issueFilterSearch, setIssueFilterSearch] = React.useState("");
  const [creatorFilter, setCreatorFilter] = React.useState<string[]>([]);
  const [issueStatusFilter, setIssueStatusFilter] = React.useState<IssueStatusId[]>([]);
  const [issueDateFilter, setIssueDateFilter] = React.useState<string[]>([]);
  const [projectIssueCreateOpen, setProjectIssueCreateOpen] = React.useState(false);
  const [projectIssueTitle, setProjectIssueTitle] = React.useState("");
  const [projectIssueDescription, setProjectIssueDescription] = React.useState("");
  const [projectIssuePriority, setProjectIssuePriority] = React.useState<Issue["priority"]>("Medium");
  const [prHeaderSearch, setPrHeaderSearch] = React.useState("");
  const [prFilterMenuOpen, setPrFilterMenuOpen] = React.useState(false);
  const [prFilterPanel, setPrFilterPanel] = React.useState<"root" | "author" | "status" | "date" | "project">("root");
  const [prFilterSearch, setPrFilterSearch] = React.useState("");
  const [prAuthorFilter, setPrAuthorFilter] = React.useState<string[]>([]);
  const [prStatusFilter, setPrStatusFilter] = React.useState<PullRequest["status"][]>([]);
  const [prDateFilter, setPrDateFilter] = React.useState<string[]>([]);
  const [prProjectFilter, setPrProjectFilter] = React.useState<string>(projectId);
  const [projectPrCreateOpen, setProjectPrCreateOpen] = React.useState(false);
  const [projectPrTitle, setProjectPrTitle] = React.useState("");
  const [projectPrDescription, setProjectPrDescription] = React.useState("");
  const [projectPrStatus, setProjectPrStatus] = React.useState<PullRequest["status"]>("open");
  const [detailPullRequest, setDetailPullRequest] = React.useState<PullRequest | null>(null);
  const [detailPullRequestOpen, setDetailPullRequestOpen] = React.useState(false);
  const [teamHeaderSearch, setTeamHeaderSearch] = React.useState("");
  const [teamFilterMenuOpen, setTeamFilterMenuOpen] = React.useState(false);
  const [teamFilterPanel, setTeamFilterPanel] = React.useState<"root" | "member">("root");
  const [teamFilterSearch, setTeamFilterSearch] = React.useState("");
  const [teamMemberFilter, setTeamMemberFilter] = React.useState<string[]>([]);
  const [teamCreateOpen, setTeamCreateOpen] = React.useState(false);
  const [teamCreateName, setTeamCreateName] = React.useState("");
  const [teamCreateIdentifier, setTeamCreateIdentifier] = React.useState("");
  const [teamCreateMemberIds, setTeamCreateMemberIds] = React.useState<string[]>([]);
  const [detailTeam, setDetailTeam] = React.useState<Team | null>(null);
  const [detailTeamOpen, setDetailTeamOpen] = React.useState(false);
  const [teamDeleteConfirmOpen, setTeamDeleteConfirmOpen] = React.useState(false);
  const [memberHeaderSearch, setMemberHeaderSearch] = React.useState("");
  const [memberFilterMenuOpen, setMemberFilterMenuOpen] = React.useState(false);
  const [memberFilterPanel, setMemberFilterPanel] = React.useState<"root" | "team" | "status">("root");
  const [memberFilterSearch, setMemberFilterSearch] = React.useState("");
  const [memberTeamFilter, setMemberTeamFilter] = React.useState<string[]>([]);
  const [memberStatusFilter, setMemberStatusFilter] = React.useState<UserDetail["status"][]>([]);
  const [memberCreateOpen, setMemberCreateOpen] = React.useState(false);
  const [memberCreateName, setMemberCreateName] = React.useState("");
  const [memberCreateEmail, setMemberCreateEmail] = React.useState("");
  const [memberCreateStatus, setMemberCreateStatus] = React.useState<UserDetail["status"]>("member");
  const [memberCreateTeamIds, setMemberCreateTeamIds] = React.useState<string[]>([]);
  const [memberCreateJoinedDate, setMemberCreateJoinedDate] = React.useState("");
  const [detailMember, setDetailMember] = React.useState<(UserDetail & { joinedAt?: string }) | null>(null);
  const [detailMemberOpen, setDetailMemberOpen] = React.useState(false);
  const [memberDeleteConfirmOpen, setMemberDeleteConfirmOpen] = React.useState(false);

  const project = React.useMemo(
    () => PROJECTS.find((p) => p.id === projectId) ?? PROJECTS[0],
    [projectId]
  );

  const projectIssues = React.useMemo(
    () => issues.filter((i) => i.projectId === projectId),
    [issues, projectId]
  );

  const getIssueCreatorId = React.useCallback(
    (issue: Issue) => (issue as Issue & { creatorId?: string }).creatorId ?? issue.assigneeId,
    []
  );

  const getIssueDateValue = React.useCallback(
    (issue: Issue) => (issue as Issue & { createdAt?: string }).createdAt ?? issue.updatedAt,
    []
  );

  const issueDateOptions = React.useMemo(() => {
    const values = Array.from(new Set(projectIssues.map((issue) => getIssueDateValue(issue))));
    return values;
  }, [projectIssues, getIssueDateValue]);

  const filteredIssuesPage = React.useMemo(() => {
    let list = projectIssues;

    if (issueHeaderSearch.trim()) {
      const q = issueHeaderSearch.toLowerCase();
      list = list.filter(
        (issue) =>
          issue.title.toLowerCase().includes(q) ||
          issue.description.toLowerCase().includes(q)
      );
    }

    if (creatorFilter.length) {
      list = list.filter((issue) => creatorFilter.includes(getIssueCreatorId(issue)));
    }

    if (issueStatusFilter.length) {
      list = list.filter((issue) => issueStatusFilter.includes(issue.statusId));
    }

    if (issueDateFilter.length) {
      list = list.filter((issue) => issueDateFilter.includes(getIssueDateValue(issue)));
    }

    return list;
  }, [
    projectIssues,
    issueHeaderSearch,
    creatorFilter,
    issueStatusFilter,
    issueDateFilter,
    getIssueCreatorId,
    getIssueDateValue,
  ]);

  const filteredProjectIssues = React.useMemo(() => {
    let list = projectIssues;

    if (statusFilter.length) {
      list = list.filter((i) => statusFilter.includes(i.statusId));
    }

    if (assigneeFilter.length) {
      list = list.filter((i) => assigneeFilter.includes(i.assigneeId));
    }

    if (priorityFilter.length) {
      list = list.filter((i) => priorityFilter.includes(i.priority));
    }

    if (labelFilter.length) {
      list = list.filter((i) =>
        i.labels.some((l) => labelFilter.includes(l.name))
      );
    }

    return list;
  }, [projectIssues, statusFilter, assigneeFilter, priorityFilter, labelFilter]);

  const projectIssuesByStatus = React.useMemo(() => {
    const map: Record<IssueStatusId, Issue[]> = {
      "in-progress": [],
      "technical-review": [],
      completed: [],
      paused: [],
      todo: [],
      backlog: [],
    };
    filteredProjectIssues.forEach((issue) => {
      if (map[issue.statusId]) map[issue.statusId].push(issue);
    });
    return map;
  }, [filteredProjectIssues]);

  const projectPullRequests = React.useMemo(
    () => pullRequests.filter((pr: PullRequest) => pr.authorId === currentUser.id),
    [pullRequests, currentUser.id]
  );

  const prDateOptions = React.useMemo(
    () => Array.from(new Set(projectPullRequests.map((pr) => pr.createdAt))),
    [projectPullRequests]
  );

  const filteredProjectPullRequests = React.useMemo(() => {
    let list = projectPullRequests;

    if (prHeaderSearch.trim()) {
      const q = prHeaderSearch.toLowerCase();
      list = list.filter(
        (pr) =>
          pr.title.toLowerCase().includes(q) ||
          pr.description.toLowerCase().includes(q)
      );
    }

    if (prAuthorFilter.length) {
      list = list.filter((pr) => prAuthorFilter.includes(pr.authorId));
    }

    if (prStatusFilter.length) {
      list = list.filter((pr) => prStatusFilter.includes(pr.status));
    }

    if (prDateFilter.length) {
      list = list.filter((pr) => prDateFilter.includes(pr.createdAt));
    }

    if (prProjectFilter !== "all") {
      list = list.filter((pr) => pr.projectId === prProjectFilter);
    }

    return list;
  }, [projectPullRequests, prHeaderSearch, prAuthorFilter, prStatusFilter, prDateFilter, prProjectFilter]);

  const projectTeams = React.useMemo(
    () => teams.filter((t) => t.projectIds.includes(projectId)),
    [teams, projectId]
  );

  const filteredProjectTeams = React.useMemo(() => {
    let list = projectTeams;

    if (teamHeaderSearch.trim()) {
      const q = teamHeaderSearch.toLowerCase();
      list = list.filter(
        (team) =>
          team.name.toLowerCase().includes(q) ||
          team.identifier.toLowerCase().includes(q)
      );
    }

    if (teamMemberFilter.length) {
      list = list.filter((team) =>
        teamMemberFilter.some((memberId) => team.memberIds.includes(memberId))
      );
    }

    return list;
  }, [projectTeams, teamHeaderSearch, teamMemberFilter]);

  const projectMembers = React.useMemo(() => {
    const memberIds = new Set<string>();
    projectTeams.forEach((t) => t.memberIds.forEach((id) => memberIds.add(id)));
    return userDetails.filter((u) => memberIds.has(u.id));
  }, [projectTeams, userDetails]);

  const getMemberJoinedDate = React.useCallback((member: UserDetail) => {
    return (member as UserDetail & { joinedAt?: string }).joinedAt ?? "Not set";
  }, []);

  const filteredProjectMembers = React.useMemo(() => {
    let list = projectMembers;

    if (memberHeaderSearch.trim()) {
      const q = memberHeaderSearch.toLowerCase();
      list = list.filter(
        (member) =>
          member.name.toLowerCase().includes(q) ||
          member.email.toLowerCase().includes(q)
      );
    }

    if (memberTeamFilter.length) {
      list = list.filter((member) =>
        memberTeamFilter.some((teamId) => member.teamIds.includes(teamId))
      );
    }

    if (memberStatusFilter.length) {
      list = list.filter((member) => memberStatusFilter.includes(member.status));
    }

    return list;
  }, [projectMembers, memberHeaderSearch, memberTeamFilter, memberStatusFilter]);

  const changeStatus = (issueId: string, statusId: IssueStatusId) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, statusId, updatedAt: "Just now" } : i
      )
    );
  };

  const assignTo = (issueId: string, userId: string) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, assigneeId: userId, updatedAt: "Just now" } : i
      )
    );
  };

  const changePriority = (issueId: string, priority: Issue["priority"]) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId ? { ...i, priority, updatedAt: "Just now" } : i
      )
    );
  };

  const openCreate = (statusId: IssueStatusId) => {
    setCreateDefaultStatusId(statusId);
    setCreateOpen(true);
  };

  const openDetail = (issue: Issue) => {
    setDetailIssue(issue);
    setDetailOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, issueId: string) => {
    setDraggingId(issueId);
    e.dataTransfer.setData("text/plain", issueId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => setDraggingId(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, statusId: IssueStatusId) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;
    setIssues((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, statusId, updatedAt: "Just now" } : task
      )
    );
    setDraggingId(null);
  };

  const activeFilterCount =
    statusFilter.length +
    assigneeFilter.length +
    priorityFilter.length +
    labelFilter.length;

  const resetFilterPanel = () => {
    setFilterPanel("root");
    setFilterSearch("");
  };

  const issueActiveFilterCount =
    creatorFilter.length +
    issueStatusFilter.length +
    issueDateFilter.length;

  const resetIssueFilterPanel = () => {
    setIssueFilterPanel("root");
    setIssueFilterSearch("");
  };

  const handleCreateProjectIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectIssueTitle.trim() || !projectIssueDescription.trim() || !projectIssuePriority) {
      return;
    }

    const existingKeys = issues.filter((i) => i.projectId === projectId).map((i) => i.key);
    const maxNum = existingKeys.reduce((acc, key) => {
      const n = parseInt(key.split("-")[1], 10);
      return Number.isNaN(n) ? acc : Math.max(acc, n);
    }, 0);

    const newIssue: Issue & { creatorId?: string; createdAt?: string } = {
      id: `i-${Date.now()}`,
      key: `${project.code}-${maxNum + 1}`,
      title: projectIssueTitle.trim(),
      description: projectIssueDescription.trim(),
      statusId: "todo",
      projectId,
      assigneeId: currentUser.id,
      labels: [],
      updatedAt: "Just now",
      priority: projectIssuePriority,
      creatorId: currentUser.id,
      createdAt: "Just now",
    };

    setIssues((prev) => [...prev, newIssue]);
    setProjectIssueTitle("");
    setProjectIssueDescription("");
    setProjectIssuePriority("Medium");
    setProjectIssueCreateOpen(false);
  };

  const prActiveFilterCount =
    prAuthorFilter.length + prStatusFilter.length + prDateFilter.length + (prProjectFilter !== "all" ? 1 : 0);

  const resetPrFilterPanel = () => {
    setPrFilterPanel("root");
    setPrFilterSearch("");
  };

  const handleCreateProjectPullRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectPrTitle.trim() || !projectPrDescription.trim()) return;

    const maxNumber = projectPullRequests.reduce(
      (acc, pr) => Math.max(acc, pr.number),
      0
    );

    const newPr: PullRequest = {
      id: `pr-${Date.now()}`,
      number: maxNumber + 1,
      title: projectPrTitle.trim(),
      description: projectPrDescription.trim(),
      projectId,
      authorId: currentUser.id,
      status: projectPrStatus,
      createdAt: "Just now",
      updatedAt: "Just now",
      labels: [],
    };

    setPullRequests((prev) => [...prev, newPr]);
    setProjectPrTitle("");
    setProjectPrDescription("");
    setProjectPrStatus("open");
    setProjectPrCreateOpen(false);
  };

  const openPullRequestDetail = (pr: PullRequest) => {
    setDetailPullRequest(pr);
    setDetailPullRequestOpen(true);
  };

  const updatePullRequest = (id: string, patch: Partial<PullRequest>) => {
    setPullRequests((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, ...patch, updatedAt: "Just now" } : pr))
    );
  };

  const confirmPullRequestChanges = () => {
    if (!detailPullRequest) return;
    updatePullRequest(detailPullRequest.id, {
      title: detailPullRequest.title.trim(),
      description: detailPullRequest.description.trim(),
      status: detailPullRequest.status,
    });
    setDetailPullRequestOpen(false);
    setDetailPullRequest(null);
  };

  const teamActiveFilterCount = teamMemberFilter.length;

  const resetTeamFilterPanel = () => {
    setTeamFilterPanel("root");
    setTeamFilterSearch("");
  };

  const toggleTeamMemberSelection = (
    memberId: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamCreateName.trim() || !teamCreateIdentifier.trim()) return;

    const normalizedIdentifier = teamCreateIdentifier.trim().toUpperCase();
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name: teamCreateName.trim(),
      identifier: normalizedIdentifier,
      memberIds: teamCreateMemberIds,
      projectIds: [projectId],
      workspaceId: project.workspaceId,
    };

    setTeams((prev) => [...prev, newTeam]);
    setTeamCreateName("");
    setTeamCreateIdentifier("");
    setTeamCreateMemberIds([]);
    setTeamCreateOpen(false);
  };

  const updateTeam = (teamId: string, patch: Partial<Team>) => {
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, ...patch } : team))
    );
  };

  const deleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    setTeamDeleteConfirmOpen(false);
    setDetailTeamOpen(false);
    setDetailTeam(null);
  };

  const confirmTeamChanges = () => {
    if (!detailTeam) return;
    updateTeam(detailTeam.id, {
      name: detailTeam.name.trim(),
      identifier: detailTeam.identifier.trim().toUpperCase(),
      memberIds: detailTeam.memberIds,
    });
    setDetailTeamOpen(false);
    setDetailTeam(null);
  };

  const memberActiveFilterCount =
    memberTeamFilter.length +
    memberStatusFilter.length;

  const resetMemberFilterPanel = () => {
    setMemberFilterPanel("root");
    setMemberFilterSearch("");
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberCreateName.trim() || !memberCreateEmail.trim()) return;

    const initials = memberCreateName
      .trim()
      .split(/\s+/)
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);

    const colorPool = [
      "from-emerald-500 to-sky-500",
      "from-violet-500 to-amber-500",
      "from-amber-500 to-rose-500",
      "from-sky-500 to-emerald-500",
    ] as const;

    const newMember: UserDetail & { joinedAt?: string } = {
      id: `u-${Date.now()}`,
      name: memberCreateName.trim(),
      initials: initials || "NA",
      color: colorPool[Math.floor(Math.random() * colorPool.length)],
      email: memberCreateEmail.trim(),
      status: memberCreateStatus,
      teamIds: memberCreateTeamIds,
      joinedAt: memberCreateJoinedDate || "Just now",
    };

    setUserDetails((prev) => [...prev, newMember]);
    if (memberCreateTeamIds.length) {
      setTeams((prev) =>
        prev.map((team) =>
          memberCreateTeamIds.includes(team.id)
            ? { ...team, memberIds: team.memberIds.includes(newMember.id) ? team.memberIds : [...team.memberIds, newMember.id] }
            : team
        )
      );
    }

    setMemberCreateName("");
    setMemberCreateEmail("");
    setMemberCreateStatus("member");
    setMemberCreateTeamIds([]);
    setMemberCreateJoinedDate("");
    setMemberCreateOpen(false);
  };

  const updateMember = (
    memberId: string,
    patch: Partial<UserDetail & { joinedAt?: string }>
  ) => {
    setUserDetails((prev) =>
      prev.map((member) =>
        member.id === memberId
          ? ({ ...member, ...patch } as UserDetail)
          : member
      )
    );
  };

  const syncMemberTeams = (memberId: string, nextTeamIds: string[]) => {
    setTeams((prev) =>
      prev.map((team) => {
        const shouldHaveMember = nextTeamIds.includes(team.id);
        const hasMember = team.memberIds.includes(memberId);
        if (shouldHaveMember && !hasMember) {
          return { ...team, memberIds: [...team.memberIds, memberId] };
        }
        if (!shouldHaveMember && hasMember) {
          return { ...team, memberIds: team.memberIds.filter((id) => id !== memberId) };
        }
        return team;
      })
    );
  };

  const deleteMember = (memberId: string) => {
    setUserDetails((prev) => prev.filter((member) => member.id !== memberId));
    setTeams((prev) =>
      prev.map((team) => ({
        ...team,
        memberIds: team.memberIds.filter((id) => id !== memberId),
      }))
    );
    setMemberDeleteConfirmOpen(false);
    setDetailMemberOpen(false);
    setDetailMember(null);
  };

  const confirmMemberChanges = () => {
    if (!detailMember) return;
    updateMember(detailMember.id, {
      name: detailMember.name.trim(),
      email: detailMember.email.trim(),
      status: detailMember.status,
      teamIds: detailMember.teamIds,
      joinedAt: (detailMember as UserDetail & { joinedAt?: string }).joinedAt ?? "",
    });
    syncMemberTeams(detailMember.id, detailMember.teamIds);
    setDetailMemberOpen(false);
    setDetailMember(null);
  };

  const navItems: { id: ProjectSectionType; label: string; icon: typeof LayoutIcon }[] = [
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

      {section === "tasks" && (
        <section className="border-border/80 bg-card/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:h-12 sm:px-4">
          <DropdownMenu
            open={filterMenuOpen}
            onOpenChange={(open) => {
              setFilterMenuOpen(open);
              if (!open) resetFilterPanel();
            }}
          >
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-muted/80 h-8 gap-1 rounded-full border-dashed border-border/80 px-3 text-[11px]"
                />
              }
            >
              <HugeiconsIcon icon={SearchIcon} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {activeFilterCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-0 sm:w-80">
              {filterPanel === "root" && (
                <div className="flex flex-col gap-0.5 py-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Filter
                    </span>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter([]);
                          setAssigneeFilter([]);
                          setPriorityFilter([]);
                          setLabelFilter([]);
                          resetFilterPanel();
                        }}
                        className="text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setFilterPanel("status")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={LayoutIcon} className="h-3.5 w-3.5 text-amber-400" />
                      <span>Status</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setFilterPanel("assignee")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5 text-sky-400" />
                      <span>Assignee</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setFilterPanel("priority")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={LayoutIcon} className="h-3.5 w-3.5 text-violet-400" />
                      <span>Priority</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setFilterPanel("labels")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={FileIcon} className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Labels</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}

              {filterPanel !== "root" && (
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-1 px-3 pb-1">
                    <button
                      type="button"
                      className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-full"
                      onClick={resetFilterPanel}
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 rotate-180" />
                    </button>
                    <span className="text-xs font-medium">
                      {filterPanel === "status" && "Status"}
                      {filterPanel === "assignee" && "Assignee"}
                      {filterPanel === "priority" && "Priority"}
                      {filterPanel === "labels" && "Labels"}
                    </span>
                  </div>
                  <div className="px-3 pb-1">
                    <Input
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                      placeholder={
                        filterPanel === "status"
                          ? "Search status..."
                          : filterPanel === "assignee"
                            ? "Search assignee..."
                            : filterPanel === "priority"
                              ? "Search priority..."
                              : "Search labels..."
                      }
                      className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                    />
                  </div>

                  <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                    {filterPanel === "status" &&
                      ISSUE_STATUSES.filter((s) =>
                        s.title.toLowerCase().includes(filterSearch.toLowerCase())
                      ).map((s) => {
                        const count = projectIssuesByStatus[s.id]?.length ?? 0;
                        const active = statusFilter.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              setStatusFilter((prev) =>
                                active ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                              )
                            }
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-2 w-2 shrink-0 rounded-full",
                                  s.iconColor
                                )}
                              />
                              <span>{s.title}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              {count}
                            </span>
                          </button>
                        );
                      })}

                    {filterPanel === "assignee" &&
                      USERS.filter((u) =>
                        u.name.toLowerCase().includes(filterSearch.toLowerCase())
                      ).map((u) => {
                        const count = projectIssues.filter((i) => i.assigneeId === u.id).length;
                        const active = assigneeFilter.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() =>
                              setAssigneeFilter((prev) =>
                                active ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                              )
                            }
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                  u.color
                                )}
                              >
                                {u.initials}
                              </span>
                              <span>{u.name}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              {count}
                            </span>
                          </button>
                        );
                      })}

                    {filterPanel === "priority" &&
                      (["High", "Medium", "Low"] as Issue["priority"][])
                        .filter((p) =>
                          p.toLowerCase().includes(filterSearch.toLowerCase())
                        )
                        .map((p) => {
                          const count = projectIssues.filter((i) => i.priority === p).length;
                          const active = priorityFilter.includes(p);
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() =>
                                setPriorityFilter((prev) =>
                                  active ? prev.filter((val) => val !== p) : [...prev, p]
                                )
                              }
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span>{p}</span>
                              <span className="text-muted-foreground text-[11px]">
                                {count}
                              </span>
                            </button>
                          );
                        })}

                    {filterPanel === "labels" &&
                      LABEL_OPTIONS.filter((l) =>
                        l.name.toLowerCase().includes(filterSearch.toLowerCase())
                      ).map((l) => {
                        const count = projectIssues.filter((i) =>
                          i.labels.some((lbl) => lbl.name === l.name)
                        ).length;
                        const active = labelFilter.includes(l.name);
                        return (
                          <button
                            key={l.name}
                            type="button"
                            onClick={() =>
                              setLabelFilter((prev) =>
                                active
                                  ? prev.filter((val) => val !== l.name)
                                  : [...prev, l.name]
                              )
                            }
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span>{l.name}</span>
                            <span className="text-muted-foreground text-[11px]">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden text-[11px] sm:inline">
              {filteredProjectIssues.length} task{filteredProjectIssues.length !== 1 ? "s" : ""}
            </span>

            <div className="border-border/80 bg-background/80 flex items-center rounded-full border px-0.5 py-0.5">
              <Button
                type="button"
                variant={viewMode === "board" ? "default" : "ghost"}
                size="icon-sm"
                className="h-7 w-7 rounded-full text-[11px]"
                onClick={() => setViewMode("board")}
                aria-label="Board view"
              >
                <HugeiconsIcon icon={LayoutIcon} className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon-sm"
                className="h-7 w-7 rounded-full text-[11px]"
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <HugeiconsIcon icon={MoreHorizontalCircle01Icon} className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {section === "issues" && (
        <section className="border-border/80 bg-card/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:h-12 sm:px-4">
          <DropdownMenu
            open={issueFilterMenuOpen}
            onOpenChange={(open) => {
              setIssueFilterMenuOpen(open);
              if (!open) resetIssueFilterPanel();
            }}
          >
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-muted/80 h-8 gap-1 rounded-full border-dashed border-border/80 px-3 text-[11px]"
                />
              }
            >
              <HugeiconsIcon icon={SearchIcon} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">Filters</span>
              {issueActiveFilterCount > 0 && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {issueActiveFilterCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-0 sm:w-80">
              {issueFilterPanel === "root" && (
                <div className="flex flex-col gap-0.5 py-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Filter
                    </span>
                    {issueActiveFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setCreatorFilter([]);
                          setIssueStatusFilter([]);
                          setIssueDateFilter([]);
                          resetIssueFilterPanel();
                        }}
                        className="text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setIssueFilterPanel("creator")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5 text-sky-400" />
                      <span>Created by</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setIssueFilterPanel("status")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={LayoutIcon} className="h-3.5 w-3.5 text-amber-400" />
                      <span>Status</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setIssueFilterPanel("date")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={FileIcon} className="h-3.5 w-3.5 text-violet-400" />
                      <span>Date</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}

              {issueFilterPanel !== "root" && (
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-1 px-3 pb-1">
                    <button
                      type="button"
                      className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-full"
                      onClick={resetIssueFilterPanel}
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 rotate-180" />
                    </button>
                    <span className="text-xs font-medium">
                      {issueFilterPanel === "creator" && "Created by"}
                      {issueFilterPanel === "status" && "Status"}
                      {issueFilterPanel === "date" && "Date"}
                    </span>
                  </div>
                  <div className="px-3 pb-1">
                    <Input
                      value={issueFilterSearch}
                      onChange={(e) => setIssueFilterSearch(e.target.value)}
                      placeholder={
                        issueFilterPanel === "creator"
                          ? "Search creator..."
                          : issueFilterPanel === "status"
                            ? "Search status..."
                            : "Search date..."
                      }
                      className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                    />
                  </div>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                    {issueFilterPanel === "creator" &&
                      USERS.filter((u) =>
                        u.name.toLowerCase().includes(issueFilterSearch.toLowerCase())
                      ).map((u) => {
                        const count = projectIssues.filter((issue) => getIssueCreatorId(issue) === u.id).length;
                        const active = creatorFilter.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() =>
                              setCreatorFilter((prev) =>
                                active ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                              )
                            }
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                  u.color
                                )}
                              >
                                {u.initials}
                              </span>
                              <span>{u.name}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}

                    {issueFilterPanel === "status" &&
                      ISSUE_STATUSES.filter((s) =>
                        s.title.toLowerCase().includes(issueFilterSearch.toLowerCase())
                      ).map((s) => {
                        const count = projectIssues.filter((issue) => issue.statusId === s.id).length;
                        const active = issueStatusFilter.includes(s.id);
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              setIssueStatusFilter((prev) =>
                                active ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                              )
                            }
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span className={cn("h-2 w-2 shrink-0 rounded-full", s.iconColor)} />
                              <span>{s.title}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}

                    {issueFilterPanel === "date" &&
                      issueDateOptions
                        .filter((date) => date.toLowerCase().includes(issueFilterSearch.toLowerCase()))
                        .map((date) => {
                          const count = projectIssues.filter((issue) => getIssueDateValue(issue) === date).length;
                          const active = issueDateFilter.includes(date);
                          return (
                            <button
                              key={date}
                              type="button"
                              onClick={() =>
                                setIssueDateFilter((prev) =>
                                  active ? prev.filter((value) => value !== date) : [...prev, date]
                                )
                              }
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span>{date}</span>
                              <span className="text-muted-foreground text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 sm:max-w-sm">
            <Input
              value={issueHeaderSearch}
              onChange={(e) => setIssueHeaderSearch(e.target.value)}
              placeholder="Search title or description..."
              className="h-8 border-border/70 bg-background/80 px-2 text-[11px]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden text-[11px] sm:inline">
              {filteredIssuesPage.length} issue{filteredIssuesPage.length !== 1 ? "s" : ""}
            </span>
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-full px-3 text-[11px]"
              onClick={() => setProjectIssueCreateOpen(true)}
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
              Create Issue
            </Button>
          </div>
        </section>
      )}

      {section === "pull-requests" && (
        <section className="border-border/80 bg-card/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:h-12 sm:px-4">
          <DropdownMenu
            open={prFilterMenuOpen}
            onOpenChange={(open) => {
              setPrFilterMenuOpen(open);
              if (!open) resetPrFilterPanel();
            }}
          >
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-muted/80 h-8 gap-1 rounded-full border-dashed border-border/80 px-3 text-[11px]"
                />
              }
            >
              <HugeiconsIcon icon={SearchIcon} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">Filters</span>
              {prActiveFilterCount > 0 && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {prActiveFilterCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-0 sm:w-80">
              {prFilterPanel === "root" && (
                <div className="flex flex-col gap-0.5 py-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Filter
                    </span>
                    {prActiveFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPrAuthorFilter([]);
                          setPrStatusFilter([]);
                          setPrDateFilter([]);
                          setPrProjectFilter(projectId);
                          resetPrFilterPanel();
                        }}
                        className="text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setPrFilterPanel("author")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5 text-sky-400" />
                      <span>Created by</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setPrFilterPanel("status")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={LayoutIcon} className="h-3.5 w-3.5 text-amber-400" />
                      <span>Status</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setPrFilterPanel("date")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={FileIcon} className="h-3.5 w-3.5 text-violet-400" />
                      <span>Date</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setPrFilterPanel("project")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserGroupIcon} className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Project</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}

              {prFilterPanel !== "root" && (
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-1 px-3 pb-1">
                    <button
                      type="button"
                      className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-full"
                      onClick={resetPrFilterPanel}
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 rotate-180" />
                    </button>
                    <span className="text-xs font-medium">
                      {prFilterPanel === "author" && "Created by"}
                      {prFilterPanel === "status" && "Status"}
                      {prFilterPanel === "date" && "Date"}
                      {prFilterPanel === "project" && "Project"}
                    </span>
                  </div>
                  <div className="px-3 pb-1">
                    <Input
                      value={prFilterSearch}
                      onChange={(e) => setPrFilterSearch(e.target.value)}
                      placeholder={
                        prFilterPanel === "author"
                          ? "Search creator..."
                          : prFilterPanel === "status"
                            ? "Search status..."
                            : prFilterPanel === "date"
                              ? "Search date..."
                              : "Search project..."
                      }
                      className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                    />
                  </div>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                    {prFilterPanel === "author" &&
                      USERS.filter((u) =>
                        u.name.toLowerCase().includes(prFilterSearch.toLowerCase())
                      ).map((u) => {
                        const count = projectPullRequests.filter((pr) => pr.authorId === u.id).length;
                        const active = prAuthorFilter.includes(u.id);
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() =>
                              setPrAuthorFilter((prev) =>
                                active ? prev.filter((id) => id !== u.id) : [...prev, u.id]
                              )
                            }
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                  u.color
                                )}
                              >
                                {u.initials}
                              </span>
                              <span>{u.name}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}
                    {prFilterPanel === "status" &&
                      (["open", "merged", "closed"] as PullRequest["status"][])
                        .filter((status) => status.toLowerCase().includes(prFilterSearch.toLowerCase()))
                        .map((status) => {
                          const count = projectPullRequests.filter((pr) => pr.status === status).length;
                          const active = prStatusFilter.includes(status);
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setPrStatusFilter((prev) =>
                                  active ? prev.filter((value) => value !== status) : [...prev, status]
                                )
                              }
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span className="capitalize">{status}</span>
                              <span className="text-muted-foreground text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                    {prFilterPanel === "date" &&
                      prDateOptions
                        .filter((date) => date.toLowerCase().includes(prFilterSearch.toLowerCase()))
                        .map((date) => {
                          const count = projectPullRequests.filter((pr) => pr.createdAt === date).length;
                          const active = prDateFilter.includes(date);
                          return (
                            <button
                              key={date}
                              type="button"
                              onClick={() =>
                                setPrDateFilter((prev) =>
                                  active ? prev.filter((value) => value !== date) : [...prev, date]
                                )
                              }
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span>{date}</span>
                              <span className="text-muted-foreground text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                    {prFilterPanel === "project" &&
                      projects
                        .filter((project) => project.name.toLowerCase().includes(prFilterSearch.toLowerCase()))
                        .map((project) => {
                          const count = projectPullRequests.filter((pr) => pr.projectId === project.id).length;
                          const active = prProjectFilter === project.id;
                          return (
                            <button
                              key={project.id}
                              type="button"
                              onClick={() => setPrProjectFilter((prev) => (prev === project.id ? "all" : project.id))}
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span>{project.name}</span>
                              <span className="text-muted-foreground text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 sm:max-w-sm">
            <Input
              value={prHeaderSearch}
              onChange={(e) => setPrHeaderSearch(e.target.value)}
              placeholder="Search title or description..."
              className="h-8 border-border/70 bg-background/80 px-2 text-[11px]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden text-[11px] sm:inline">
              {filteredProjectPullRequests.length} pull request{filteredProjectPullRequests.length !== 1 ? "s" : ""}
            </span>
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-full px-3 text-[11px]"
              onClick={() => setProjectPrCreateOpen(true)}
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
              Create PR
            </Button>
          </div>
        </section>
      )}

      {section === "teams" && (
        <section className="border-border/80 bg-card/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:h-12 sm:px-4">
          <DropdownMenu
            open={teamFilterMenuOpen}
            onOpenChange={(open) => {
              setTeamFilterMenuOpen(open);
              if (!open) resetTeamFilterPanel();
            }}
          >
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-muted/80 h-8 gap-1 rounded-full border-dashed border-border/80 px-3 text-[11px]"
                />
              }
            >
              <HugeiconsIcon icon={SearchIcon} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">Filters</span>
              {teamActiveFilterCount > 0 && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {teamActiveFilterCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-0 sm:w-80">
              {teamFilterPanel === "root" && (
                <div className="flex flex-col gap-0.5 py-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Filter
                    </span>
                    {teamActiveFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setTeamMemberFilter([]);
                          resetTeamFilterPanel();
                        }}
                        className="text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setTeamFilterPanel("member")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5 text-sky-400" />
                      <span>Member</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}
              {teamFilterPanel === "member" && (
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-1 px-3 pb-1">
                    <button
                      type="button"
                      className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-full"
                      onClick={resetTeamFilterPanel}
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 rotate-180" />
                    </button>
                    <span className="text-xs font-medium">Member</span>
                  </div>
                  <div className="px-3 pb-1">
                    <Input
                      value={teamFilterSearch}
                      onChange={(e) => setTeamFilterSearch(e.target.value)}
                      placeholder="Search member..."
                      className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                    />
                  </div>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                    {userDetails
                      .filter((user) =>
                        user.name.toLowerCase().includes(teamFilterSearch.toLowerCase())
                      )
                      .map((user) => {
                        const count = projectTeams.filter((team) => team.memberIds.includes(user.id)).length;
                        const active = teamMemberFilter.includes(user.id);
                        return (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => toggleTeamMemberSelection(user.id, setTeamMemberFilter)}
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                  user.color
                                )}
                              >
                                {user.initials}
                              </span>
                              <span>{user.name}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 sm:max-w-sm">
            <Input
              value={teamHeaderSearch}
              onChange={(e) => setTeamHeaderSearch(e.target.value)}
              placeholder="Search team name or identifier..."
              className="h-8 border-border/70 bg-background/80 px-2 text-[11px]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden text-[11px] sm:inline">
              {filteredProjectTeams.length} team{filteredProjectTeams.length !== 1 ? "s" : ""}
            </span>
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-full px-3 text-[11px]"
              onClick={() => setTeamCreateOpen(true)}
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
              Create Team
            </Button>
          </div>
        </section>
      )}

      {section === "members" && (
        <section className="border-border/80 bg-card/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:h-12 sm:px-4">
          <DropdownMenu
            open={memberFilterMenuOpen}
            onOpenChange={(open) => {
              setMemberFilterMenuOpen(open);
              if (!open) resetMemberFilterPanel();
            }}
          >
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-muted/80 h-8 gap-1 rounded-full border-dashed border-border/80 px-3 text-[11px]"
                />
              }
            >
              <HugeiconsIcon icon={SearchIcon} className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">Filters</span>
              {memberActiveFilterCount > 0 && (
                <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                  {memberActiveFilterCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-0 sm:w-80">
              {memberFilterPanel === "root" && (
                <div className="flex flex-col gap-0.5 py-1">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Filter
                    </span>
                    {memberActiveFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setMemberTeamFilter([]);
                          setMemberStatusFilter([]);
                          resetMemberFilterPanel();
                        }}
                        className="text-muted-foreground hover:text-foreground text-[11px]"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setMemberFilterPanel("team")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserGroupIcon} className="h-3.5 w-3.5 text-sky-400" />
                      <span>Team</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setMemberFilterPanel("status")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={UserIcon} className="h-3.5 w-3.5 text-violet-400" />
                      <span>Status</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              )}
              {memberFilterPanel !== "root" && (
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex items-center gap-1 px-3 pb-1">
                    <button
                      type="button"
                      className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-full"
                      onClick={resetMemberFilterPanel}
                    >
                      <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 rotate-180" />
                    </button>
                    <span className="text-xs font-medium">
                      {memberFilterPanel === "team" && "Team"}
                      {memberFilterPanel === "status" && "Status"}
                    </span>
                  </div>
                  <div className="px-3 pb-1">
                    <Input
                      value={memberFilterSearch}
                      onChange={(e) => setMemberFilterSearch(e.target.value)}
                      placeholder={
                        memberFilterPanel === "team"
                          ? "Search team..."
                          : "Search status..."
                      }
                      className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                    />
                  </div>
                  <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                    {memberFilterPanel === "team" &&
                      projectTeams
                        .filter((team) =>
                          team.name.toLowerCase().includes(memberFilterSearch.toLowerCase())
                        )
                        .map((team) => {
                          const count = projectMembers.filter((member) => member.teamIds.includes(team.id)).length;
                          const active = memberTeamFilter.includes(team.id);
                          return (
                            <button
                              key={team.id}
                              type="button"
                              onClick={() => toggleTeamMemberSelection(team.id, setMemberTeamFilter)}
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span>{team.name}</span>
                              <span className="text-muted-foreground text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                    {memberFilterPanel === "status" &&
                      (["member", "admin", "guest", "joined"] as UserDetail["status"][])
                        .filter((status) =>
                          status.toLowerCase().includes(memberFilterSearch.toLowerCase())
                        )
                        .map((status) => {
                          const count = projectMembers.filter((member) => member.status === status).length;
                          const active = memberStatusFilter.includes(status);
                          return (
                            <button
                              key={status}
                              type="button"
                              onClick={() =>
                                setMemberStatusFilter((prev) =>
                                  active ? prev.filter((value) => value !== status) : [...prev, status]
                                )
                              }
                              className={cn(
                                "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                                active && "bg-primary/10 text-primary"
                              )}
                            >
                              <span className="capitalize">{status}</span>
                              <span className="text-muted-foreground text-[11px]">{count}</span>
                            </button>
                          );
                        })}
                  </div>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1 sm:max-w-sm">
            <Input
              value={memberHeaderSearch}
              onChange={(e) => setMemberHeaderSearch(e.target.value)}
              placeholder="Search name or email..."
              className="h-8 border-border/70 bg-background/80 px-2 text-[11px]"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-muted-foreground hidden text-[11px] sm:inline">
              {filteredProjectMembers.length} member{filteredProjectMembers.length !== 1 ? "s" : ""}
            </span>
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-full px-3 text-[11px]"
              onClick={() => setMemberCreateOpen(true)}
            >
              <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
              Create Member
            </Button>
          </div>
        </section>
      )}

      <div className="flex-1 overflow-auto p-3 sm:p-4">
        {section === "tasks" && (
          viewMode === "board" ? (
            <div className="flex h-full min-w-max gap-3 sm:gap-4">
              {ISSUE_STATUSES.map((status) => {
                const columnIssues = projectIssuesByStatus[status.id];
                return (
                  <Card
                    key={status.id}
                    className="bg-card/80 ring-border/60 flex h-full w-[260px] shrink-0 flex-col overflow-hidden sm:w-[280px] py-2"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status.id)}
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
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-[11px]">
                          {columnIssues.length}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => openCreate(status.id)}
                          aria-label={`Add task to ${status.title}`}
                        >
                          <HugeiconsIcon icon={PlusSignIcon} className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <ScrollArea className="flex-1">
                      <CardContent className="flex flex-col gap-2 p-2">
                        {columnIssues.map((issue) => (
                          <ProjectTaskCard
                            key={issue.id}
                            task={issue}
                            isDragging={draggingId === issue.id}
                            onDragStart={(e) => handleDragStart(e, issue.id)}
                            onDragEnd={handleDragEnd}
                            onStatusChange={(statusId) => changeStatus(issue.id, statusId)}
                            onAssignTo={(userId) => assignTo(issue.id, userId)}
                            onClick={() => openDetail(issue)}
                          />
                        ))}
                      </CardContent>
                    </ScrollArea>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-card/80 ring-border/60 flex h-full min-w-full flex-col overflow-hidden">
              <CardHeader className="border-border/80 flex flex-row items-center justify-between gap-2 border-b py-2.5 px-3">
                <CardTitle className="text-xs font-medium">Project tasks</CardTitle>
                <span className="text-muted-foreground text-[11px]">
                  {filteredProjectIssues.length} task{filteredProjectIssues.length !== 1 ? "s" : ""}
                </span>
              </CardHeader>
              <ScrollArea className="flex-1">
                <CardContent className="flex flex-col gap-3 p-2">
                  {ISSUE_STATUSES.map((status) => {
                    const sectionIssues = filteredProjectIssues.filter(
                      (issue) => issue.statusId === status.id
                    );
                    if (sectionIssues.length === 0) return null;
                    return (
                      <div key={status.id} className="space-y-1.5">
                        <div className="flex items-center justify-between border-y border-border/60 bg-background/60 px-3 py-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn("h-2 w-2 shrink-0 rounded-full", status.iconColor)}
                            />
                            <span className="text-xs font-medium">
                              {status.title}
                            </span>
                          </div>
                          <span className="text-muted-foreground text-[11px]">
                            {sectionIssues.length}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {sectionIssues.map((issue) => (
                            <ProjectTaskRow
                              key={issue.id}
                              task={issue}
                              onStatusChange={(statusId) => changeStatus(issue.id, statusId)}
                              onAssignTo={(userId) => assignTo(issue.id, userId)}
                              onClick={() => openDetail(issue)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </ScrollArea>
            </Card>
          )
        )}

        {section === "issues" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Issues · {filteredIssuesPage.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              {filteredIssuesPage.map((issue) => (
                <ProjectIssueRow
                  key={issue.id}
                  issue={issue}
                  onPriorityChange={(priority) => changePriority(issue.id, priority)}
                  onClick={() => openDetail(issue)}
                  creatorId={getIssueCreatorId(issue)}
                  dateValue={getIssueDateValue(issue)}
                />
              ))}
              {filteredIssuesPage.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No issues match the selected filters.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {section === "pull-requests" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Pull requests · {filteredProjectPullRequests.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              {filteredProjectPullRequests.map((pr) => (
                <ProjectPullRequestRow
                  key={pr.id}
                  pullRequest={pr}
                  onClick={() => openPullRequestDetail(pr)}
                />
              ))}
              {filteredProjectPullRequests.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No pull requests match the selected filters.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {section === "teams" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Teams · {filteredProjectTeams.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
              <TooltipProvider delay={100}>
                {filteredProjectTeams.map((team) => (
                  <ProjectTeamRow
                    key={team.id}
                    team={team}
                    members={userDetails.filter((user) => team.memberIds.includes(user.id))}
                    onClick={() => {
                      setDetailTeam(team);
                      setDetailTeamOpen(true);
                    }}
                  />
                ))}
              </TooltipProvider>
              {filteredProjectTeams.length === 0 && (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No teams match the selected filters.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {section === "members" && (
          <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
              <CardTitle className="text-xs font-medium">
                Members · {filteredProjectMembers.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-2">
              {filteredProjectMembers.length > 0 ? (
                <div className="overflow-hidden rounded-md border border-border/60">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Member</th>
                        <th className="px-3 py-2 text-left font-medium">Email</th>
                        <th className="px-3 py-2 text-left font-medium">Status</th>
                        <th className="px-3 py-2 text-left font-medium">Joined date</th>
                        <th className="px-3 py-2 text-left font-medium">Teams</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjectMembers.map((member) => (
                        <tr
                          key={member.id}
                          onClick={() => {
                            setDetailMember(member as UserDetail & { joinedAt?: string });
                            setDetailMemberOpen(true);
                          }}
                          className="hover:bg-muted/60 cursor-pointer border-t border-border/60"
                        >
                          <td className="px-3 py-2">
                            <span className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "bg-linear-to-br flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                                  member.color
                                )}
                              >
                                {member.initials}
                              </span>
                              <span>{member.name}</span>
                            </span>
                          </td>
                          <td className="px-3 py-2">{member.email}</td>
                          <td className="px-3 py-2 capitalize">{member.status}</td>
                          <td className="px-3 py-2">{getMemberJoinedDate(member)}</td>
                          <td className="px-3 py-2">
                            {member.teamIds
                              .map((teamId) => projectTeams.find((team) => team.id === teamId)?.name ?? teamId)
                              .join(", ") || "No team"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center text-xs">
                  No members match the selected filters.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <CreateIssueDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultStatusId={createDefaultStatusId}
      />
      <Dialog
        open={projectIssueCreateOpen}
        onOpenChange={(open) => {
          setProjectIssueCreateOpen(open);
          if (!open) {
            setProjectIssueTitle("");
            setProjectIssueDescription("");
            setProjectIssuePriority("Medium");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create issue</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProjectIssue} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-issue-title">Title</Label>
              <Input
                id="project-issue-title"
                value={projectIssueTitle}
                onChange={(e) => setProjectIssueTitle(e.target.value)}
                placeholder="Issue title"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-issue-description">Description</Label>
              <textarea
                id="project-issue-description"
                value={projectIssueDescription}
                onChange={(e) => setProjectIssueDescription(e.target.value)}
                placeholder="Issue description"
                required
                className="border-input bg-background focus-visible:ring-ring/50 min-h-[100px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={projectIssuePriority}
                onValueChange={(value) => setProjectIssuePriority(value as Issue["priority"])}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High" className="text-xs">High</SelectItem>
                  <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                  <SelectItem value="Low" className="text-xs">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setProjectIssueCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!projectIssueTitle.trim() || !projectIssueDescription.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={projectPrCreateOpen}
        onOpenChange={(open) => {
          setProjectPrCreateOpen(open);
          if (!open) {
            setProjectPrTitle("");
            setProjectPrDescription("");
            setProjectPrStatus("open");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create pull request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProjectPullRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-pr-title">Title</Label>
              <Input
                id="project-pr-title"
                value={projectPrTitle}
                onChange={(e) => setProjectPrTitle(e.target.value)}
                placeholder="Pull request title"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-pr-description">Description</Label>
              <textarea
                id="project-pr-description"
                value={projectPrDescription}
                onChange={(e) => setProjectPrDescription(e.target.value)}
                placeholder="Pull request description"
                required
                className="border-input bg-background focus-visible:ring-ring/50 min-h-[100px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={projectPrStatus}
                onValueChange={(value) => setProjectPrStatus(value as PullRequest["status"])}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open" className="text-xs">Open</SelectItem>
                  <SelectItem value="merged" className="text-xs">Merged</SelectItem>
                  <SelectItem value="closed" className="text-xs">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setProjectPrCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!projectPrTitle.trim() || !projectPrDescription.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={detailPullRequestOpen}
        onOpenChange={(open) => {
          setDetailPullRequestOpen(open);
          if (!open) setDetailPullRequest(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {detailPullRequest ? `PR #${detailPullRequest.number}` : "Pull request details"}
            </DialogTitle>
          </DialogHeader>
          {detailPullRequest && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detail-pr-title">Title</Label>
                <Input
                  id="detail-pr-title"
                  value={detailPullRequest.title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDetailPullRequest((prev) => (prev ? { ...prev, title: value } : prev));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-pr-description">Description</Label>
                <textarea
                  id="detail-pr-description"
                  value={detailPullRequest.description}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDetailPullRequest((prev) => (prev ? { ...prev, description: value } : prev));
                  }}
                  className="border-input bg-background focus-visible:ring-ring/50 min-h-[100px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={detailPullRequest.status}
                    onValueChange={(value) => {
                      const next = value as PullRequest["status"];
                      setDetailPullRequest((prev) => (prev ? { ...prev, status: next } : prev));
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open" className="text-xs">Open</SelectItem>
                      <SelectItem value="merged" className="text-xs">Merged</SelectItem>
                      <SelectItem value="closed" className="text-xs">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Created by</Label>
                  <div className="text-muted-foreground rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
                    {USERS.find((u) => u.id === detailPullRequest.authorId)?.name ?? "Unknown user"}
                  </div>
                </div>
              </div>
              <div className="text-muted-foreground text-[11px]">
                Opened {detailPullRequest.createdAt} · Updated {detailPullRequest.updatedAt}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailPullRequestOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmPullRequestChanges}
                  disabled={!detailPullRequest.title.trim() || !detailPullRequest.description.trim()}
                >
                  Confirm
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={teamCreateOpen}
        onOpenChange={(open) => {
          setTeamCreateOpen(open);
          if (!open) {
            setTeamCreateName("");
            setTeamCreateIdentifier("");
            setTeamCreateMemberIds([]);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create team</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-create-name">Team name</Label>
              <Input
                id="team-create-name"
                value={teamCreateName}
                onChange={(e) => setTeamCreateName(e.target.value)}
                placeholder="Team name"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-create-identifier">Identifier</Label>
              <Input
                id="team-create-identifier"
                value={teamCreateIdentifier}
                onChange={(e) => setTeamCreateIdentifier(e.target.value.toUpperCase())}
                placeholder="e.g. DS"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Members</Label>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
                {userDetails.map((user) => {
                  const active = teamCreateMemberIds.includes(user.id);
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleTeamMemberSelection(user.id, setTeamCreateMemberIds)}
                      className={cn(
                        "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                        active && "bg-primary/10 text-primary"
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                            user.color
                          )}
                        >
                          {user.initials}
                        </span>
                        <span>{user.name}</span>
                      </span>
                      {active && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTeamCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!teamCreateName.trim() || !teamCreateIdentifier.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={detailTeamOpen}
        onOpenChange={(open) => {
          setDetailTeamOpen(open);
          if (!open) {
            setDetailTeam(null);
            setTeamDeleteConfirmOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Team details</DialogTitle>
          </DialogHeader>
          {detailTeam && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="team-detail-name">Team name</Label>
                <Input
                  id="team-detail-name"
                  value={detailTeam.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDetailTeam((prev) => (prev ? { ...prev, name: value } : prev));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-detail-identifier">Identifier</Label>
                <Input
                  id="team-detail-identifier"
                  value={detailTeam.identifier}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setDetailTeam((prev) => (prev ? { ...prev, identifier: value } : prev));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Members</Label>
                <div className="max-h-52 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
                  {userDetails.map((user) => {
                    const active = detailTeam.memberIds.includes(user.id);
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          const nextMemberIds = active
                            ? detailTeam.memberIds.filter((id) => id !== user.id)
                            : [...detailTeam.memberIds, user.id];
                          setDetailTeam((prev) => (prev ? { ...prev, memberIds: nextMemberIds } : prev));
                        }}
                        className={cn(
                          "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                          active && "bg-primary/10 text-primary"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={cn(
                              "bg-linear-to-br flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                              user.color
                            )}
                          >
                            {user.initials}
                          </span>
                          <span>{user.name}</span>
                        </span>
                        {active && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTeamDeleteConfirmOpen(true)}
                  className="text-destructive border-destructive/40 hover:bg-destructive/10"
                >
                  Delete team
                </Button>
                <Button type="button" variant="outline" onClick={confirmTeamChanges}>
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={teamDeleteConfirmOpen} onOpenChange={setTeamDeleteConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the team from this workspace and project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (detailTeam) deleteTeam(detailTeam.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={memberCreateOpen}
        onOpenChange={(open) => {
          setMemberCreateOpen(open);
          if (!open) {
            setMemberCreateName("");
            setMemberCreateEmail("");
            setMemberCreateStatus("member");
            setMemberCreateTeamIds([]);
            setMemberCreateJoinedDate("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateMember} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-create-name">Name</Label>
              <Input
                id="member-create-name"
                value={memberCreateName}
                onChange={(e) => setMemberCreateName(e.target.value)}
                placeholder="Member name"
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-create-email">Email</Label>
              <Input
                id="member-create-email"
                type="email"
                value={memberCreateEmail}
                onChange={(e) => setMemberCreateEmail(e.target.value)}
                placeholder="member@company.com"
                required
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={memberCreateStatus}
                  onValueChange={(value) => setMemberCreateStatus(value as UserDetail["status"])}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member" className="text-xs">Member</SelectItem>
                    <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                    <SelectItem value="guest" className="text-xs">Guest</SelectItem>
                    <SelectItem value="joined" className="text-xs">Joined</SelectItem>
                  </SelectContent>
                </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-create-joined-date">Joined date</Label>
                  <Input
                    id="member-create-joined-date"
                    type="date"
                    value={memberCreateJoinedDate}
                    onChange={(e) => setMemberCreateJoinedDate(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            <div className="space-y-2">
              <Label>Teams</Label>
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
                {projectTeams.map((team) => {
                  const active = memberCreateTeamIds.includes(team.id);
                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => toggleTeamMemberSelection(team.id, setMemberCreateTeamIds)}
                      className={cn(
                        "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                        active && "bg-primary/10 text-primary"
                      )}
                    >
                      <span>{team.name}</span>
                      {active && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />}
                    </button>
                  );
                })}
                {projectTeams.length === 0 && (
                  <div className="text-muted-foreground px-2 py-1 text-[11px]">
                    No teams available for this project.
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setMemberCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!memberCreateName.trim() || !memberCreateEmail.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={detailMemberOpen}
        onOpenChange={(open) => {
          setDetailMemberOpen(open);
          if (!open) {
            setDetailMember(null);
            setMemberDeleteConfirmOpen(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Member details</DialogTitle>
          </DialogHeader>
          {detailMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="member-detail-name">Name</Label>
                <Input
                  id="member-detail-name"
                  value={detailMember.name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDetailMember((prev) => (prev ? { ...prev, name: value } : prev));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-detail-email">Email</Label>
                <Input
                  id="member-detail-email"
                  type="email"
                  value={detailMember.email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDetailMember((prev) => (prev ? { ...prev, email: value } : prev));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={detailMember.status}
                  onValueChange={(value) => {
                    const next = value as UserDetail["status"];
                    setDetailMember((prev) => (prev ? { ...prev, status: next } : prev));
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member" className="text-xs">Member</SelectItem>
                    <SelectItem value="admin" className="text-xs">Admin</SelectItem>
                    <SelectItem value="guest" className="text-xs">Guest</SelectItem>
                    <SelectItem value="joined" className="text-xs">Joined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="member-detail-joined-date">Joined date</Label>
                <Input
                  id="member-detail-joined-date"
                  type="date"
                  value={(detailMember as UserDetail & { joinedAt?: string }).joinedAt ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDetailMember((prev) => (prev ? { ...prev, joinedAt: value } : prev));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label>Teams</Label>
                <div className="max-h-52 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
                  {projectTeams.map((team) => {
                    const active = detailMember.teamIds.includes(team.id);
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => {
                          const nextTeamIds = active
                            ? detailMember.teamIds.filter((id) => id !== team.id)
                            : [...detailMember.teamIds, team.id];
                          setDetailMember((prev) => (prev ? { ...prev, teamIds: nextTeamIds } : prev));
                        }}
                        className={cn(
                          "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                          active && "bg-primary/10 text-primary"
                        )}
                      >
                        <span>{team.name}</span>
                        {active && <HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Details table</Label>
                <div className="overflow-hidden rounded-md border border-border/60">
                  <table className="w-full text-xs">
                    <tbody>
                      <tr className="border-b border-border/60">
                        <td className="bg-muted/40 px-3 py-2 font-medium">Name</td>
                        <td className="px-3 py-2">{detailMember.name}</td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="bg-muted/40 px-3 py-2 font-medium">Email</td>
                        <td className="px-3 py-2">{detailMember.email}</td>
                      </tr>
                      <tr className="border-b border-border/60">
                        <td className="bg-muted/40 px-3 py-2 font-medium">Joined date</td>
                        <td className="px-3 py-2">{getMemberJoinedDate(detailMember)}</td>
                      </tr>
                      <tr>
                        <td className="bg-muted/40 px-3 py-2 font-medium">Teams</td>
                        <td className="px-3 py-2">
                          {detailMember.teamIds
                            .map((teamId) => projectTeams.find((team) => team.id === teamId)?.name ?? teamId)
                            .join(", ") || "No team"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setMemberDeleteConfirmOpen(true)}
                  className="text-destructive border-destructive/40 hover:bg-destructive/10"
                >
                  Delete member
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={confirmMemberChanges}
                  disabled={!detailMember.name.trim() || !detailMember.email.trim()}
                >
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <AlertDialog open={memberDeleteConfirmOpen} onOpenChange={setMemberDeleteConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete member?</AlertDialogTitle>
            <AlertDialogDescription>
              This member will be removed from the workspace and all linked teams.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (detailMember) deleteMember(detailMember.id);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <IssueDetailDialog
        issue={detailIssue ? (issues.find((i) => i.id === detailIssue.id) ?? detailIssue) : null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}

function ScrollArea({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("overflow-y-auto", className)}>
      {children}
    </div>
  );
}

function ProjectTaskCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onStatusChange,
  onAssignTo,
  onClick,
  draggable = true,
}: {
  task: Issue;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onStatusChange: (statusId: IssueStatusId) => void;
  onAssignTo: (userId: string) => void;
  onClick: () => void;
  draggable?: boolean;
}) {
  const project = PROJECTS.find((p) => p.id === task.projectId);
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const status = ISSUE_STATUSES.find((s) => s.id === task.statusId);

  return (
    <div
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      onDragEnd={draggable ? onDragEnd : undefined}
      onClick={onClick}
      className={cn(
        "hover:bg-muted/80 flex cursor-grab flex-col gap-1.5 rounded-md border border-border/60 bg-background/80 p-2.5 text-left transition-colors active:cursor-grabbing",
        isDragging && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">
          {task.key}
        </span>
        <div onClick={(e) => e.stopPropagation()}>
          <Select
            value={task.statusId}
            onValueChange={(v) => {
              onStatusChange(v as IssueStatusId);
            }}
          >
            <SelectTrigger className="h-6 w-auto gap-1 border-0 bg-transparent px-1.5 shadow-none hover:bg-muted/80 text-[10px]">
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
      </div>
      <p className="line-clamp-2 text-xs font-medium">{task.title}</p>
      <div className="flex flex-wrap gap-1">
        {task.labels.slice(0, 3).map((l) => (
          <Badge
            key={l.name}
            variant="secondary"
            className={cn("text-[10px] font-normal", l.color)}
          >
            {l.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
        <span className="text-muted-foreground text-[10px]">
          {project?.code ?? task.projectId} · {task.updatedAt}
        </span>
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-muted-foreground text-[10px]">Assigned to</span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1 px-1 text-[10px]"
                />
              }
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                  assignee ? `bg-linear-to-br ${assignee.color}` : "bg-muted"
                )}
              >
                {assignee?.initials ?? "?"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {USERS.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => onAssignTo(u.id)}
                  className="flex items-center gap-1"
                >
                  <span
                    className={cn(
                      "shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                      `bg-linear-to-br ${u.color}`
                    )}
                  >
                    {u.initials}
                  </span>
                  {u.name}
                  {assignee?.initials === u.initials && <span><HugeiconsIcon icon={CheckmarkCircle01Icon} className="h-1 w-1" /></span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function ProjectTaskRow({
  task,
  onStatusChange,
  onAssignTo,
  onClick,
}: {
  task: Issue;
  onStatusChange: (statusId: IssueStatusId) => void;
  onAssignTo: (userId: string) => void;
  onClick: () => void;
}) {
  const project = PROJECTS.find((p) => p.id === task.projectId);
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const status = ISSUE_STATUSES.find((s) => s.id === task.statusId);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="hover:bg-muted/70 flex w-full items-center gap-3 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-left transition-colors"
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-medium text-muted-foreground">
          {task.key}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 text-xs font-medium">{task.title}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((l) => (
            <Badge
              key={l.name}
              variant="secondary"
              className={cn("text-[10px] font-normal", l.color)}
            >
              {l.name}
            </Badge>
          ))}
        </div>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <Select
          value={task.statusId}
          onValueChange={(v) => {
            onStatusChange(v as IssueStatusId);
          }}
        >
          <SelectTrigger className="h-7 w-[120px] gap-1 border-0 bg-transparent px-1.5 text-[10px] shadow-none hover:bg-muted/80">
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
      <div className="flex flex-col items-end gap-1">
        <span className="text-muted-foreground text-[10px]">
          {project?.code ?? task.projectId} · {task.updatedAt}
        </span>
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-6 w-6 rounded-full p-0"
                />
              }
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                  assignee ? `bg-linear-to-br ${assignee.color}` : "bg-muted"
                )}
              >
                {assignee?.initials ?? "?"}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {USERS.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => onAssignTo(u.id)}
                >
                  <span
                    className={cn(
                      "mr-2 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                      `bg-linear-to-br ${u.color}`
                    )}
                  >
                    {u.initials}
                  </span>
                  {u.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

function ProjectTeamRow({
  team,
  members,
  onClick,
}: {
  team: Team;
  members: Array<{ id: string; name: string; initials: string; color: string }>;
  onClick: () => void;
}) {
  const visibleMembers = members.slice(0, 3);
  const remainingCount = Math.max(members.length - 3, 0);
  const allMemberNames = members.map((m) => m.name).join(", ");

  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted/60 flex w-full items-center justify-between gap-3 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-left text-xs transition-colors"
    >
      <div className="min-w-0">
        <div className="font-medium">{team.name}</div>
        <div className="text-muted-foreground text-[11px]">
          Identifier · {team.identifier}
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger
          render={<div className="flex items-center gap-1.5" />}
        >
          {visibleMembers.map((member) => (
            <span
              key={member.id}
              className={cn(
                "bg-linear-to-br flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                member.color
              )}
            >
              {member.initials}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-muted-foreground text-[10px]">
              +{remainingCount}
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-[11px]">
          {allMemberNames || "No members"}
        </TooltipContent>
      </Tooltip>
    </button>
  );
}

function ProjectPullRequestRow({
  pullRequest,
  onClick,
}: {
  pullRequest: PullRequest;
  onClick: () => void;
}) {
  const author = USERS.find((u) => u.id === pullRequest.authorId);

  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted/60 flex w-full items-start justify-between gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-left text-xs transition-colors"
    >
      <div className="min-w-0">
        <div className="font-medium">
          #{pullRequest.number} · {pullRequest.title}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-[11px]">
          {pullRequest.description}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="capitalize">{pullRequest.status}</span>
          <span>·</span>
          <span>Opened {pullRequest.createdAt}</span>
          <span>·</span>
          <span>Updated {pullRequest.updatedAt}</span>
        </div>
      </div>
      <div className="flex min-w-[110px] items-center justify-end gap-2">
        {author && (
          <>
            <span className="text-muted-foreground text-[11px]">{author.name}</span>
            <span
              className={cn(
                "bg-linear-to-br flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                author.color
              )}
            >
              {author.initials}
            </span>
          </>
        )}
      </div>
    </button>
  );
}

function ProjectIssueRow({
  issue,
  onPriorityChange,
  onClick,
  creatorId,
  dateValue,
}: {
  issue: Issue;
  onPriorityChange: (priority: Issue["priority"]) => void;
  onClick: () => void;
  creatorId: string;
  dateValue: string;
}) {
  const creator = USERS.find((u) => u.id === creatorId);
  const status = ISSUE_STATUSES.find((s) => s.id === issue.statusId);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="hover:bg-muted/60 flex w-full items-center gap-3 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-xs transition-colors text-left"
    >
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
        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-[10px]">
          <span>Created by {creator?.name ?? "Unknown"}</span>
          <span>•</span>
          <span>{dateValue}</span>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <Select
          value={issue.priority}
          onValueChange={(v) => onPriorityChange(v as Issue["priority"])}
        >
          <SelectTrigger className="h-7 w-[96px] gap-1 border-0 bg-transparent px-1.5 text-[10px] shadow-none hover:bg-muted/80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High" className="text-xs">High</SelectItem>
            <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
            <SelectItem value="Low" className="text-xs">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="text-muted-foreground min-w-[120px] text-right text-[11px]">
        {creator?.name ?? "Unknown user"}
      </div>
    </div>
  );
}
