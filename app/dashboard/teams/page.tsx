"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, getUserColorClass } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Tick02Icon,
  Edit02Icon,
  MoreHorizontalIcon,
  SearchIcon,
  FilterHorizontalIcon,
  UserGroupIcon,
  LinkSquareIcon,
} from "@hugeicons/core-free-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Team } from "@/lib/data";

type TeamFormState = {
  name: string;
  identifier: string;
  memberIds: string[];
  projectIds: string[];
};

const initialTeamForm: TeamFormState = {
  name: "",
  identifier: "",
  memberIds: [],
  projectIds: [],
};

export default function TeamsPage() {
  const { teams, setTeams, currentUser, projectDetails, userDetails, workspace } = useDashboard();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingTeamId, setEditingTeamId] = React.useState<string | null>(null);
  const [createTeam, setCreateTeam] = React.useState<TeamFormState>({
    ...initialTeamForm,
    memberIds: [currentUser.id],
  });
  const [editTeam, setEditTeam] = React.useState<TeamFormState>(initialTeamForm);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [membershipFilter, setMembershipFilter] = React.useState<"all" | "mine" | "not-mine">("all");
  const [projectFilter, setProjectFilter] = React.useState<string>("all");

  const isMember = React.useCallback(
    (team: Team) => team.memberIds.includes(currentUser.id),
    [currentUser.id]
  );

  const filteredTeams = React.useMemo(() => {
    let list = teams;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (team) =>
          team.name.toLowerCase().includes(q) ||
          team.identifier.toLowerCase().includes(q)
      );
    }

    if (membershipFilter === "mine") {
      list = list.filter((team) => isMember(team));
    } else if (membershipFilter === "not-mine") {
      list = list.filter((team) => !isMember(team));
    }

    if (projectFilter !== "all") {
      list = list.filter((team) => team.projectIds.includes(projectFilter));
    }

    return list;
  }, [teams, searchQuery, membershipFilter, projectFilter, isMember]);

  const resetCreateForm = () => {
    setCreateTeam({ ...initialTeamForm, memberIds: [currentUser.id] });
  };

  const handleAddTeam = () => {
    if (!createTeam.name.trim() || !createTeam.identifier.trim()) return;
    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name: createTeam.name.trim(),
      identifier: createTeam.identifier.trim().toUpperCase(),
      memberIds: createTeam.memberIds,
      projectIds: createTeam.projectIds,
      workspaceId: workspace.id,
    };
    setTeams((prev) => [...prev, newTeam]);
    resetCreateForm();
    setAddOpen(false);
  };

  const openEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditTeam({
      name: team.name,
      identifier: team.identifier,
      memberIds: [...team.memberIds],
      projectIds: [...team.projectIds],
    });
    setEditOpen(true);
  };

  const handleUpdateTeam = () => {
    if (!editingTeamId || !editTeam.name.trim() || !editTeam.identifier.trim()) return;
    setTeams((prev) =>
      prev.map((team) =>
        team.id === editingTeamId
          ? {
              ...team,
              name: editTeam.name.trim(),
              identifier: editTeam.identifier.trim().toUpperCase(),
              memberIds: editTeam.memberIds,
              projectIds: editTeam.projectIds,
            }
          : team
      )
    );
    setEditOpen(false);
    setEditingTeamId(null);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <div className="relative w-full max-w-xs">
          <HugeiconsIcon
            icon={SearchIcon}
            className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search teams..."
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Select
          value={membershipFilter}
          onValueChange={(value) => setMembershipFilter(value as "all" | "mine" | "not-mine")}
        >
          <SelectTrigger className="pm-input h-8 w-[140px] text-xs">
            <HugeiconsIcon icon={FilterHorizontalIcon} className="mr-1 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All teams</SelectItem>
            <SelectItem value="mine" className="text-xs">My teams</SelectItem>
            <SelectItem value="not-mine" className="text-xs">Not in my teams</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={projectFilter}
          onValueChange={(value: string | null) => {
            // Ensure we don't pass null to setProjectFilter, fallback to 'all'
            setProjectFilter(value ?? "all");
          }}
        >
          <SelectTrigger className="pm-input h-8 w-[160px] text-xs">
            <HugeiconsIcon icon={LinkSquareIcon} className="mr-1 h-3.5 w-3.5" />
            <SelectValue placeholder="Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All projects</SelectItem>
            {projectDetails.map((project) => (
              <SelectItem key={project.id} value={project.id} className="text-xs">
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <Button size="sm" className="pm-primary-btn h-8 text-xs" onClick={() => setAddOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3.5 w-3.5" />
            Add Team
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="pm-table-wrap overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Membership</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Identifier</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Members</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Projects</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.map((team) => {
                const members = userDetails.filter((u) => team.memberIds.includes(u.id));
                const projects = projectDetails.filter((p) => team.projectIds.includes(p.id));
                const isUserMember = isMember(team);
                const visibleMembers = members.slice(0, 3);
                const remainingCount = Math.max(members.length - 3, 0);

                return (
                  <tr key={team.id} className="pm-animated-row border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 text-xs font-medium">{team.name}</td>
                    <td className="py-3 px-3">
                      {isUserMember ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <HugeiconsIcon icon={Tick02Icon} className="h-4 w-4 text-emerald-500" />
                          </TooltipTrigger>
                          <TooltipContent>You are a member</TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {team.identifier}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        {visibleMembers.map((member) => (
                          <Tooltip key={member.id}>
                            <TooltipTrigger>
                              <span
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                                  getUserColorClass(member.color)
                                )}
                              >
                                {member.initials}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-xs">
                                <div className="font-medium">{member.name}</div>
                                <div className="text-muted-foreground">{member.email}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                        {remainingCount > 0 && (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-muted-foreground flex h-6 items-center justify-center rounded-full border border-border/60 bg-muted/50 px-1.5 text-[10px]">
                                +{remainingCount}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1 text-xs">
                                {members.slice(3).map((m) => (
                                  <div key={m.id}>
                                    <div className="font-medium">{m.name}</div>
                                    <div className="text-muted-foreground">{m.email}</div>
                                  </div>
                                ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {projects.length > 0 ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-xs">{projects.length}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1 text-xs">
                              {projects.map((p) => (
                                <div key={p.id} className="font-medium">
                                  {p.name}
                                </div>
                              ))}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <span className="text-muted-foreground text-xs">0</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full px-3 text-[11px]"
                        onClick={() => openEdit(team)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredTeams.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-muted-foreground py-8 text-center text-xs">
                    No teams match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TeamFormDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) resetCreateForm();
        }}
        title="Add Team"
        value={createTeam}
        onChange={setCreateTeam}
        userDetails={userDetails}
        projectDetails={projectDetails}
        submitLabel="Add Team"
        onSubmit={handleAddTeam}
      />

      <TeamFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingTeamId(null);
        }}
        title="Edit Team"
        value={editTeam}
        onChange={setEditTeam}
        userDetails={userDetails}
        projectDetails={projectDetails}
        submitLabel="Save Changes"
        onSubmit={handleUpdateTeam}
      />
    </div>
  );
}

function TeamFormDialog({
  open,
  onOpenChange,
  title,
  value,
  onChange,
  userDetails,
  projectDetails,
  submitLabel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: TeamFormState;
  onChange: React.Dispatch<React.SetStateAction<TeamFormState>>;
  userDetails: ReturnType<typeof useDashboard>["userDetails"];
  projectDetails: ReturnType<typeof useDashboard>["projectDetails"];
  submitLabel: string;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${title}-name`}>Team Name</Label>
            <Input
              id={`${title}-name`}
              value={value.name}
              onChange={(e) => onChange((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Design System Team"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-identifier`}>Identifier</Label>
            <Input
              id={`${title}-identifier`}
              value={value.identifier}
              onChange={(e) => onChange((prev) => ({ ...prev, identifier: e.target.value.toUpperCase() }))}
              placeholder="e.g. DS"
              maxLength={5}
              className="text-sm font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <HugeiconsIcon icon={UserGroupIcon} className="h-3.5 w-3.5 text-muted-foreground" />
              Assign Members
            </Label>
            <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
              {userDetails.map((user) => {
                const active = value.memberIds.includes(user.id);
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        memberIds: active
                          ? prev.memberIds.filter((id) => id !== user.id)
                          : [...prev.memberIds, user.id],
                      }))
                    }
                    className={cn(
                      "hover:bg-muted/70 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                      active && "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{user.name}</span>
                    {active && <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <HugeiconsIcon icon={LinkSquareIcon} className="h-3.5 w-3.5 text-muted-foreground" />
              Assign Projects
            </Label>
            <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
              {projectDetails.map((project) => {
                const active = value.projectIds.includes(project.id);
                return (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        projectIds: active
                          ? prev.projectIds.filter((id) => id !== project.id)
                          : [...prev.projectIds, project.id],
                      }))
                    }
                    className={cn(
                      "hover:bg-muted/70 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                      active && "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{project.name}</span>
                    {active && <HugeiconsIcon icon={Tick02Icon} className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={!value.name.trim() || !value.identifier.trim()}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
