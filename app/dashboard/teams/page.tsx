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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TEAMS, PROJECTS, getUserDetails } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Tick02Icon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TeamsPage() {
  const { teams, setTeams, currentUser, projectDetails } = useDashboard();
  const [addOpen, setAddOpen] = React.useState(false);
  const [newTeamName, setNewTeamName] = React.useState("");
  const [newTeamIdentifier, setNewTeamIdentifier] = React.useState("");
  const userDetails = getUserDetails();

  const handleAddTeam = () => {
    if (!newTeamName.trim() || !newTeamIdentifier.trim()) return;
    const newTeam = {
      id: `t-${Date.now()}`,
      name: newTeamName.trim(),
      identifier: newTeamIdentifier.trim().toUpperCase(),
      memberIds: [currentUser.id],
      projectIds: [],
      workspaceId: "ws-1",
    };
    setTeams((prev) => [...prev, newTeam]);
    setNewTeamName("");
    setNewTeamIdentifier("");
    setAddOpen(false);
  };

  const isMember = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    return team?.memberIds.includes(currentUser.id) ?? false;
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 bg-card/80 flex h-14 shrink-0 items-center justify-end gap-3 border-b px-4">
        <Button size="sm" className="h-8 text-xs" onClick={() => setAddOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3.5 w-3.5" />
          Add Team
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Membership</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Identifier</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Members</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Projects</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => {
                const members = userDetails.filter((u) => team.memberIds.includes(u.id));
                const projects = projectDetails.filter((p) => team.projectIds.includes(p.id));
                const isUserMember = isMember(team.id);
                const visibleMembers = members.slice(0, 3);
                const remainingCount = members.length - 3;

                return (
                  <tr key={team.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
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
                                  `bg-linear-to-br ${member.color}`
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
            <DialogTitle>Add Team</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. Design System Team"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="team-identifier">Identifier</Label>
              <Input
                id="team-identifier"
                value={newTeamIdentifier}
                onChange={(e) => setNewTeamIdentifier(e.target.value.toUpperCase())}
                placeholder="e.g. DS"
                maxLength={5}
                className="text-sm font-mono"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeam} disabled={!newTeamName.trim() || !newTeamIdentifier.trim()}>
              Add Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
