"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/lib/dashboard-context";
import {
  ISSUE_STATUSES,
  PROJECTS,
  USERS,
  LABEL_OPTIONS,
} from "@/lib/data";
import type { Issue, IssueStatusId } from "@/lib/data";
import { cn } from "@/lib/utils";

type IssueDetailDialogProps = {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IssueDetailDialog({
  issue,
  open,
  onOpenChange,
}: IssueDetailDialogProps) {
  const { setIssues } = useDashboard();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [statusId, setStatusId] = React.useState<IssueStatusId>("todo");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [priority, setPriority] = React.useState<Issue["priority"]>("Medium");
  const [labels, setLabels] = React.useState<Issue["labels"]>([]);

  React.useEffect(() => {
    if (issue) {
      setTitle(issue.title);
      setDescription(issue.description);
      setStatusId(issue.statusId);
      setAssigneeId(issue.assigneeId);
      setPriority(issue.priority);
      setLabels(issue.labels);
    }
  }, [issue]);

  const updateIssue = React.useCallback(
    (patch: Partial<Issue>) => {
      if (!issue) return;
      setIssues((prev) =>
        prev.map((i) => (i.id === issue.id ? { ...i, ...patch, updatedAt: "Just now" } : i))
      );
    },
    [issue, setIssues]
  );

  const handleStatusChange = (v: string) => {
    const next = v as IssueStatusId;
    setStatusId(next);
    updateIssue({ statusId: next });
  };

  const handleAssigneeChange = (v: string) => {
    setAssigneeId(v);
    updateIssue({ assigneeId: v });
  };

  const handlePriorityChange = (v: string) => {
    const next = v as Issue["priority"];
    setPriority(next);
    updateIssue({ priority: next });
  };

  const handleSaveDetails = () => {
    if (!issue) return;
    updateIssue({ title: title.trim(), description: description.trim() });
  };

  const toggleLabel = (name: string, color: string) => {
    const next = labels.some((l) => l.name === name)
      ? labels.filter((l) => l.name !== name)
      : [...labels, { name, color }];
    setLabels(next);
    updateIssue({ labels: next });
  };

  if (!issue) return null;

  const project = PROJECTS.find((p) => p.id === issue.projectId);
  const assignee = USERS.find((u) => u.id === assigneeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-mono text-xs">{issue.key}</span>
            <span>Issue details</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="detail-title">Title</Label>
            <Input
              id="detail-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSaveDetails}
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="detail-desc">Description</Label>
            <textarea
              id="detail-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSaveDetails}
              className="border-input bg-background focus-visible:ring-ring/50 min-h-[100px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={statusId}
                onValueChange={(value, _eventDetails) => handleStatusChange(value as IssueStatusId)}
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
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value, _eventDetails) => handlePriorityChange(value as "High" | "Medium" | "Low")}
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
          </div>
          <div className="space-y-2">
            <Label>Project</Label>
            <div className="text-muted-foreground rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
              {project?.name ?? issue.projectId} ({project?.code ?? ""})
            </div>
          </div>
          <div className="space-y-2">
            <Label>Assigned to</Label>
            <Select
              value={assigneeId}
              onValueChange={(value, _eventDetails) => handleAssigneeChange(value as string)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue>
                  {assignee ? (
                    <span className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                          `bg-linear-to-br ${assignee.color}`
                        )}
                      >
                        {assignee.initials}
                      </span>
                      {assignee.name}
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
          </div>
          <div className="space-y-2">
            <Label>Category / Labels</Label>
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
          <div className="text-muted-foreground text-[11px]">
            Updated {issue.updatedAt}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
