"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Issue, IssueStatusId } from "@/lib/data";
import { ISSUE_STATUSES, PROJECTS, USERS, LABEL_OPTIONS } from "@/lib/data";
import { useDashboard } from "@/lib/dashboard-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type CreateIssueDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStatusId: IssueStatusId;
  defaultProjectId?: string;
};

export function CreateIssueDialog({
  open,
  onOpenChange,
  defaultStatusId,
  defaultProjectId,
}: CreateIssueDialogProps) {
  const { projects, currentUser, issues, setIssues } = useDashboard();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [statusId, setStatusId] = React.useState<IssueStatusId>(defaultStatusId);
  const [projectId, setProjectId] = React.useState(defaultProjectId ?? projects[0]?.id ?? "");
  const [assigneeId, setAssigneeId] = React.useState(currentUser.id);
  const [priority, setPriority] = React.useState<"High" | "Medium" | "Low">("Medium");
  const [labels, setLabels] = React.useState<Issue["labels"]>([]);

  const toggleLabel = (name: string, color: string) => {
    setLabels((prev) =>
      prev.some((l) => l.name === name)
        ? prev.filter((l) => l.name !== name)
        : [...prev, { name, color }]
    );
  };

  React.useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setStatusId(defaultStatusId);
      setProjectId(defaultProjectId ?? projects[0]?.id ?? "");
      setAssigneeId(currentUser.id);
      setPriority("Medium");
      setLabels([]);
    }
  }, [open, defaultStatusId, defaultProjectId, projects, currentUser.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;
    const project = PROJECTS.find((p) => p.id === projectId);
    if (!project) return;
    const existingKeys = issues.filter((i) => i.projectId === projectId).map((i) => i.key);
    const maxNum = existingKeys.reduce((acc, k) => {
      const n = parseInt(k.split("-")[1], 10);
      return isNaN(n) ? acc : Math.max(acc, n);
    }, 0);
    const key = `${project.code}-${maxNum + 1}`;
    const newIssue = {
      id: `i-${Date.now()}`,
      key,
      title: title.trim(),
      description: description.trim() || "No description.",
      statusId,
      projectId,
      assigneeId,
      labels,
      updatedAt: "Just now",
      priority,
    };
    setIssues((prev) => [...prev, newIssue]);
    onOpenChange(false);
  };

  const projectsList = projects.length > 0 ? projects : PROJECTS.filter((p) => p.workspaceId === "ws-1");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create issue</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issue-title">Title</Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Issue title"
              required
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue-desc">Description</Label>
            <textarea
              id="issue-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="border-input bg-background focus-visible:ring-ring/50 min-h-[80px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusId}
                onValueChange={(v) => setStatusId(v as IssueStatusId)}
              >
                <SelectTrigger className="h-8 text-xs">
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
            <div className="space-y-2">
              <Label>Project</Label>
              <Select value={projectId} onValueChange={(v) => v != null && setProjectId(v)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {projectsList.map((p) => (
                    <SelectItem key={p.id} value={p.id} className="text-xs">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={assigneeId} onValueChange={(v) => v != null && setAssigneeId(v)}>
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
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as "High" | "Medium" | "Low")}>
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
          </div>
          <div className="space-y-2">
            <Label>Category / Labels</Label>
            <p className="text-muted-foreground text-[11px]">e.g. Bug, Testing, Feature</p>
            <div className="flex flex-wrap gap-1.5">
              {LABEL_OPTIONS.map((opt) => {
                const active = labels.some((l) => l.name === opt.name);
                return (
                  <Badge
                    key={opt.name}
                    variant={active ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer text-[10px]",
                      active ? opt.color : "hover:bg-muted"
                    )}
                    onClick={() => toggleLabel(opt.name, opt.color)}
                  >
                    {opt.name}
                  </Badge>
                );
              })}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
