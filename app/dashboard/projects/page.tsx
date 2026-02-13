"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
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
import {
  PlusSignIcon,
  LayoutIcon,
  FileIcon,
  LinkSquareIcon,
  UserGroupIcon,
  UserIcon,
  MoreHorizontalCircle01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import type { ProjectDetail } from "@/lib/data";

const PRIORITY_OPTIONS = [
  { value: "urgent", label: "Urgent", tone: "text-red-400" },
  { value: "high", label: "High", tone: "text-amber-400" },
  { value: "medium", label: "Medium", tone: "text-sky-400" },
  { value: "low", label: "Low", tone: "text-emerald-400" },
  { value: "no-priority", label: "No Priority", tone: "text-muted-foreground" },
] as const;

const STATUS_OPTIONS = [
  { value: "active", label: "Active", progress: 60, tone: "bg-amber-400" },
  { value: "on-hold", label: "On Hold", progress: 50, tone: "bg-sky-400" },
  { value: "completed", label: "Completed", progress: 100, tone: "bg-emerald-400" },
  { value: "archived", label: "Archived", progress: 30, tone: "bg-zinc-400" },
] as const;

const HEALTH_OPTIONS = [
  { value: "on-track", label: "On Track", tone: "text-emerald-400" },
  { value: "at-risk", label: "At Risk", tone: "text-amber-400" },
  { value: "no-update", label: "No Update", tone: "text-muted-foreground" },
] as const;

const PROJECT_ICONS = [
  LayoutIcon,
  FileIcon,
  LinkSquareIcon,
  UserGroupIcon,
  UserIcon,
  MoreHorizontalCircle01Icon,
] as const;

type ProjectHealth = Record<string, string>;

export default function ProjectsPage() {
  const { projectDetails, setProjectDetails } = useDashboard();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [projectHealth, setProjectHealth] = React.useState<ProjectHealth>({});
  const [newProject, setNewProject] = React.useState({
    name: "",
    title: "",
    priority: "medium" as ProjectDetail["priority"],
    leadId: USERS[0]?.id ?? "",
    targetDate: "",
    status: "active" as ProjectDetail["status"],
    health: "no-update",
  });
  const [editProject, setEditProject] = React.useState({
    title: "",
    priority: "medium" as ProjectDetail["priority"],
    leadId: USERS[0]?.id ?? "",
    targetDate: "",
    status: "active" as ProjectDetail["status"],
    health: "no-update",
  });

  const openEdit = (project: ProjectDetail) => {
    setEditingProjectId(project.id);
    setEditProject({
      title: project.title,
      priority: project.priority,
      leadId: project.leadId,
      targetDate: project.targetDate ?? "",
      status: project.status,
      health: projectHealth[project.id] ?? "no-update",
    });
    setEditOpen(true);
  };

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
    setProjectHealth((prev) => ({ ...prev, [project.id]: newProject.health }));
    setNewProject({
      name: "",
      title: "",
      priority: "medium",
      leadId: USERS[0]?.id ?? "",
      targetDate: "",
      status: "active",
      health: "no-update",
    });
    setAddOpen(false);
  };

  const handleConfirmEdit = () => {
    if (!editingProjectId || !editProject.title.trim()) return;
    setProjectDetails((prev) =>
      prev.map((project) =>
        project.id === editingProjectId
          ? {
              ...project,
              title: editProject.title.trim(),
              priority: editProject.priority,
              leadId: editProject.leadId,
              targetDate: editProject.targetDate || null,
              status: editProject.status,
            }
          : project
      )
    );
    setProjectHealth((prev) => ({ ...prev, [editingProjectId]: editProject.health }));
    setEditOpen(false);
    setEditingProjectId(null);
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
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Health</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Priority</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Lead</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Target date</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Options</th>
              </tr>
            </thead>
            <tbody>
              {projectDetails.map((project, index) => {
                const lead = USERS.find((u) => u.id === project.leadId);
                const priorityMeta = PRIORITY_OPTIONS.find((p) => p.value === project.priority);
                const healthValue = projectHealth[project.id] ?? "no-update";
                const healthMeta = HEALTH_OPTIONS.find((h) => h.value === healthValue);
                const statusMeta = STATUS_OPTIONS.find((s) => s.value === project.status);
                const titleIcon = PROJECT_ICONS[index % PROJECT_ICONS.length];
                return (
                  <tr key={project.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-3 py-3 text-xs font-medium">
                      <div className="flex items-center gap-2">
                        <span className="bg-muted/60 text-muted-foreground flex h-7 w-7 items-center justify-center rounded-md">
                          <HugeiconsIcon icon={titleIcon} className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{project.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className={cn("text-xs", healthMeta?.tone)}>
                        {healthMeta?.label ?? "No Update"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("text-xs", priorityMeta?.tone)}>
                        {priorityMeta?.label ?? "No Priority"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
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
                          {lead.name.toLowerCase().replace(/\s+/g, ".")}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Unassigned</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {project.targetDate || <span className="text-muted-foreground">No date</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5">
                        <span className={cn("h-2 w-2 rounded-full", statusMeta?.tone)} />
                        <span>{statusMeta?.progress ?? 0}%</span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 rounded-full px-3 text-[11px]"
                        onClick={() => openEdit(project)}
                      >
                        <HugeiconsIcon icon={Edit02Icon} className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
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
                placeholder="e.g. LNDev UI"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-title">Title</Label>
              <Input
                id="proj-title"
                value={newProject.title}
                onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Accessibility Features"
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
              <Label>Health</Label>
              <Select
                value={newProject.health}
                onValueChange={(v) => {
                  if (v != null) {
                    setNewProject((p) => ({ ...p, health: v }));
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEALTH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-proj-title">Title</Label>
              <Input
                id="edit-proj-title"
                value={editProject.title}
                onChange={(e) => setEditProject((p) => ({ ...p, title: e.target.value }))}
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={editProject.priority}
                  onValueChange={(v) => setEditProject((p) => ({ ...p, priority: v as ProjectDetail["priority"] }))}
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
                  value={editProject.status}
                  onValueChange={(v) => setEditProject((p) => ({ ...p, status: v as ProjectDetail["status"] }))}
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
              <Label>Health</Label>
              <Select
                value={editProject.health}
                onValueChange={(v) => {
                  if (v != null) {
                    setEditProject((p) => ({ ...p, health: v }));
                  }
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEALTH_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lead</Label>
              <Select
                value={editProject.leadId}
                onValueChange={(v) => v != null && setEditProject((p) => ({ ...p, leadId: v }))}
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
              <Label htmlFor="edit-proj-date">Target Date</Label>
              <Input
                id="edit-proj-date"
                type="date"
                value={editProject.targetDate}
                onChange={(e) => setEditProject((p) => ({ ...p, targetDate: e.target.value }))}
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmEdit} disabled={!editProject.title.trim()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
