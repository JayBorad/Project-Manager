"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, getUserColorClass } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  SearchIcon,
  FilterHorizontalIcon,
  MoreHorizontalIcon,
  Edit02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Team, UserDetail } from "@/lib/data";

const STATUS_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "guest", label: "Guest" },
  { value: "joined", label: "Joined" },
] as const;

type MemberFormState = {
  name: string;
  email: string;
  status: UserDetail["status"];
  teamIds: string[];
};

const initialMemberForm: MemberFormState = {
  name: "",
  email: "",
  status: "member",
  teamIds: [],
};

export default function MembersPage() {
  const { userDetails, setUserDetails, teams, setTeams } = useDashboard();

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingMemberId, setEditingMemberId] = React.useState<string | null>(null);
  const [createMember, setCreateMember] = React.useState<MemberFormState>(initialMemberForm);
  const [editMember, setEditMember] = React.useState<MemberFormState>(initialMemberForm);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | UserDetail["status"]>("all");
  const [teamFilter, setTeamFilter] = React.useState<string>("all");

  const filteredMembers = React.useMemo(() => {
    let list = userDetails;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (member) =>
          member.name.toLowerCase().includes(q) ||
          member.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      list = list.filter((member) => member.status === statusFilter);
    }

    if (teamFilter !== "all") {
      list = list.filter((member) => member.teamIds.includes(teamFilter));
    }

    return list;
  }, [userDetails, searchQuery, statusFilter, teamFilter]);

  const syncMemberTeams = React.useCallback(
    (memberId: string, nextTeamIds: string[]) => {
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
    },
    [setTeams]
  );

  const handleAddMember = () => {
    if (!createMember.name.trim() || !createMember.email.trim()) return;
    const parts = createMember.name.trim().split(" ");
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : createMember.name.slice(0, 2).toUpperCase();

    const colorPool = ["bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-sky-500"] as const;
    const color = colorPool[Math.floor(Math.random() * colorPool.length)];

    const memberId = `u-${Date.now()}`;
    const member: UserDetail = {
      id: memberId,
      name: createMember.name.trim(),
      initials,
      email: createMember.email.trim(),
      color,
      status: createMember.status,
      teamIds: createMember.teamIds,
    };
    setUserDetails((prev) => [...prev, member]);
    syncMemberTeams(memberId, createMember.teamIds);
    setCreateMember(initialMemberForm);
    setAddOpen(false);
  };

  const openEdit = (member: UserDetail) => {
    setEditingMemberId(member.id);
    setEditMember({
      name: member.name,
      email: member.email,
      status: member.status,
      teamIds: [...member.teamIds],
    });
    setEditOpen(true);
  };

  const handleUpdateMember = () => {
    if (!editingMemberId || !editMember.name.trim() || !editMember.email.trim()) return;
    setUserDetails((prev) =>
      prev.map((member) =>
        member.id === editingMemberId
          ? {
              ...member,
              name: editMember.name.trim(),
              email: editMember.email.trim(),
              status: editMember.status,
              teamIds: editMember.teamIds,
            }
          : member
      )
    );
    syncMemberTeams(editingMemberId, editMember.teamIds);
    setEditOpen(false);
    setEditingMemberId(null);
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
            placeholder="Search members..."
            className="h-8 pl-8 text-xs"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as "all" | UserDetail["status"])}
        >
          <SelectTrigger className="pm-input h-8 w-[130px] text-xs">
            <HugeiconsIcon icon={FilterHorizontalIcon} className="mr-1 h-3.5 w-3.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All status</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={teamFilter}
          onValueChange={(value) => setTeamFilter(value as string)}
        >
          <SelectTrigger className="pm-input h-8 w-[160px] text-xs">
            <HugeiconsIcon icon={UserGroupIcon} className="mr-1 h-3.5 w-3.5" />
            <SelectValue placeholder="Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All teams</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id} className="text-xs">
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto">
          <Button size="sm" className="pm-primary-btn h-8 text-xs" onClick={() => setAddOpen(true)}>
            <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3.5 w-3.5" />
            Add Member
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="pm-table-wrap overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Name - Email</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Teams</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground">Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const memberTeams = teams.filter((t) => member.teamIds.includes(t.id));
                return (
                  <tr key={member.id} className="pm-animated-row border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                            getUserColorClass(member.color)
                          )}
                        >
                          {member.initials}
                        </span>
                        <div>
                          <div className="text-xs font-medium">{member.name}</div>
                          <div className="text-muted-foreground text-[11px]">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="text-[10px] capitalize">
                        {member.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      {memberTeams.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {memberTeams.map((team) => (
                            <Tooltip key={team.id}>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-[10px] font-mono">
                                  {team.identifier}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-xs font-medium">{team.name}</div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full px-3 text-[11px]"
                        onClick={() => openEdit(member)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-muted-foreground py-8 text-center text-xs">
                    No members match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <MemberFormDialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) setCreateMember(initialMemberForm);
        }}
        title="Add Member"
        value={createMember}
        onChange={setCreateMember}
        teams={teams}
        submitLabel="Add Member"
        onSubmit={handleAddMember}
      />

      <MemberFormDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);
          if (!open) setEditingMemberId(null);
        }}
        title="Edit Member"
        value={editMember}
        onChange={setEditMember}
        teams={teams}
        submitLabel="Save Changes"
        onSubmit={handleUpdateMember}
      />
    </div>
  );
}

function MemberFormDialog({
  open,
  onOpenChange,
  title,
  value,
  onChange,
  teams,
  submitLabel,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  value: MemberFormState;
  onChange: React.Dispatch<React.SetStateAction<MemberFormState>>;
  teams: Team[];
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
            <Label htmlFor={`${title}-name`}>Name</Label>
            <Input
              id={`${title}-name`}
              value={value.name}
              onChange={(e) => onChange((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. John Doe"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-email`}>Email</Label>
            <Input
              id={`${title}-email`}
              type="email"
              value={value.email}
              onChange={(e) => onChange((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="e.g. john.doe@example.com"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={value.status}
              onValueChange={(v) => onChange((prev) => ({ ...prev, status: v as UserDetail["status"] }))}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Teams</Label>
            <div className="max-h-36 space-y-1 overflow-y-auto rounded-md border border-border/60 p-2">
              {teams.map((team) => {
                const active = value.teamIds.includes(team.id);
                return (
                  <button
                    key={team.id}
                    type="button"
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        teamIds: active
                          ? prev.teamIds.filter((id) => id !== team.id)
                          : [...prev.teamIds, team.id],
                      }))
                    }
                    className={cn(
                      "hover:bg-muted/70 flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs",
                      active && "bg-primary/10 text-primary"
                    )}
                  >
                    <span>{team.name}</span>
                    {active && <Badge className="h-5 px-1.5 text-[10px]">✓</Badge>}
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
          <Button onClick={onSubmit} disabled={!value.name.trim() || !value.email.trim()}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
