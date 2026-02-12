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
import { USERS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import type { ProjectDetail } from "@/lib/data";

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "no-priority", label: "No Priority" },
] as const;

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "on-hold", label: "On Hold" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
] as const;

export default function ProjectsPage() {
  const { projectDetails, setProjectDetails } = useDashboard();
  const [addOpen, setAddOpen] = React.useState(false);
  const [newProject, setNewProject] = React.useState({
    name: "",
    title: "",
    priority: "medium" as ProjectDetail["priority"],
    leadId: USERS[0]?.id ?? "",
    targetDate: "",
    status: "active" as ProjectDetail["status"],
  });

  const handleAddProject = () => {
    if (!newProject.name.trim() || !newProject.title.trim()) return;
    const project: ProjectDetail = {
      id: `p-${Date.now()}`,
      name: newProject.name.trim(),
      code: newProject.name.slice(0, 3).toUpperCase(),
      title: newProject.title.trim(),
      team: "General",
      color: "bg-sky-500",
      workspaceId: "ws-1",
      priority: newProject.priority,
      leadId: newProject.leadId,
      targetDate: newProject.targetDate || null,
      status: newProject.status,
    };
    setProjectDetails((prev) => [...prev, project]);
    setNewProject({
      name: "",
      title: "",
      priority: "medium",
      leadId: USERS[0]?.id ?? "",
      targetDate: "",
      status: "active",
    });
    setAddOpen(false);
  };

  const updateProject = (id: string, field: keyof ProjectDetail, value: any) => {
    setProjectDetails((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 bg-card/80 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4">
        <h1 className="text-sm font-semibold">Projects</h1>
        <Button size="sm" className="h-8 text-xs" onClick={() => setAddOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3.5 w-3.5" />
          Add Project
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Target Date</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {projectDetails.map((project) => {
                const lead = USERS.find((u) => u.id === project.leadId);
                return (
                  <tr key={project.id} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3 text-xs font-medium">{project.name}</td>
                    <td className="py-3 px-3 text-xs">{project.title}</td>
                    <td className="py-3 px-3">
                      <Select
                        value={project.priority}
                        onValueChange={(v) => updateProject(project.id, "priority", v)}
                      >
                        <SelectTrigger className="h-7 w-[120px] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITY_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-xs">
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-3">
                      <Select
                        value={project.leadId}
                        onValueChange={(v) => v != null && updateProject(project.id, "leadId", v)}
                      >
                        <SelectTrigger className="h-7 w-[140px] text-xs">
                          <SelectValue>
                            {lead ? (
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                    `bg-linear-to-br ${lead.color}`
                                  )}
                                >
                                  {lead.initials}
                                </span>
                                {lead.name}
                              </span>
                            ) : null}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {USERS.map((u) => (
                            <SelectItem key={u.id} value={u.id} className="text-xs">
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                                    `bg-linear-to-br ${u.color}`
                                  )}
                                >
                                  {u.initials}
                                </span>
                                {u.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-3">
                      <Input
                        type="date"
                        value={project.targetDate || ""}
                        onChange={(e) => updateProject(project.id, "targetDate", e.target.value || null)}
                        className="h-7 w-[140px] text-xs"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <Select
                        value={project.status}
                        onValueChange={(v) => updateProject(project.id, "status", v)}
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
            <DialogTitle>Add Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="proj-name">Name</Label>
              <Input
                id="proj-name"
                value={newProject.name}
                onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Project Manager Core"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-title">Title</Label>
              <Input
                id="proj-title"
                value={newProject.title}
                onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Core Project Management"
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newProject.priority}
                  onValueChange={(v) => setNewProject((p) => ({ ...p, priority: v as ProjectDetail["priority"] }))}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={newProject.status}
                  onValueChange={(v) => setNewProject((p) => ({ ...p, status: v as ProjectDetail["status"] }))}
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
            <div className="space-y-2">
              <Label>Lead</Label>
              <Select
                value={newProject.leadId}
                onValueChange={(v) => v != null && setNewProject((p) => ({ ...p, leadId: v }))}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USERS.map((u) => (
                    <SelectItem key={u.id} value={u.id} className="text-xs">
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-date">Target Date</Label>
              <Input
                id="proj-date"
                type="date"
                value={newProject.targetDate}
                onChange={(e) => setNewProject((p) => ({ ...p, targetDate: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProject} disabled={!newProject.name.trim() || !newProject.title.trim()}>
              Add Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
