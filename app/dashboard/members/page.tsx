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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEAMS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserDetail } from "@/lib/data";

const STATUS_OPTIONS = [
  { value: "member", label: "Member" },
  { value: "admin", label: "Admin" },
  { value: "guest", label: "Guest" },
  { value: "joined", label: "Joined" },
] as const;

export default function MembersPage() {
  const { userDetails, setUserDetails, teams } = useDashboard();
  const [addOpen, setAddOpen] = React.useState(false);
  const [newMember, setNewMember] = React.useState({
    name: "",
    email: "",
    status: "member" as UserDetail["status"],
  });

  const handleAddMember = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) return;
    const parts = newMember.name.trim().split(" ");
    const initials = parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      : newMember.name.slice(0, 2).toUpperCase();
    const member: UserDetail = {
      id: `u-${Date.now()}`,
      name: newMember.name.trim(),
      initials,
      email: newMember.email.trim(),
      color: "from-emerald-500 to-sky-500",
      status: newMember.status,
      teamIds: [],
    };
    setUserDetails((prev) => [...prev, member]);
    setNewMember({ name: "", email: "", status: "member" });
    setAddOpen(false);
  };

  const updateMember = (id: string, field: keyof UserDetail, value: any) => {
    setUserDetails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 bg-card/80 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <h1 className="text-sm font-semibold">Members</h1>
        <Button size="sm" className="h-8 text-xs" onClick={() => setAddOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3.5 w-3.5" />
          Add Member
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name - Email</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Teams</th>
              </tr>
            </thead>
            <tbody>
              {userDetails.map((member) => {
                const memberTeams = teams.filter((t) => member.teamIds.includes(t.id));
                return (
                  <tr key={member.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                            `bg-linear-to-br ${member.color}`
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
                      <Select
                        value={member.status}
                        onValueChange={(v) => updateMember(member.id, "status", v)}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-name">Name</Label>
              <Input
                id="member-name"
                value={newMember.name}
                onChange={(e) => setNewMember((m) => ({ ...m, name: e.target.value }))}
                placeholder="e.g. John Doe"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember((m) => ({ ...m, email: e.target.value }))}
                placeholder="e.g. john.doe@example.com"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={newMember.status}
                onValueChange={(v) => setNewMember((m) => ({ ...m, status: v as UserDetail["status"] }))}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={!newMember.name.trim() || !newMember.email.trim()}>
              Add Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
