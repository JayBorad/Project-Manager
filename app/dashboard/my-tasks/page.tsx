"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateIssueDialog } from "@/components/create-issue-dialog";
import { IssueDetailDialog } from "@/components/issue-detail-dialog";
import { ISSUE_STATUSES, PROJECTS, USERS } from "@/lib/data";
import type { Issue, IssueStatusId } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

export default function MyTasksPage() {
  const { issues, setIssues, currentUser, projects } = useDashboard();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createDefaultStatusId, setCreateDefaultStatusId] = React.useState<IssueStatusId>("todo");
  const [projectFilter, setProjectFilter] = React.useState<string>("all");
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [detailIssue, setDetailIssue] = React.useState<Issue | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  // My tasks = assigned to current user; optionally filter by project
  const myTasks = React.useMemo(() => {
    let list = issues.filter((i) => i.assigneeId === currentUser.id);
    if (projectFilter !== "all") {
      list = list.filter((i) => i.projectId === projectFilter);
    }
    return list;
  }, [issues, currentUser.id, projectFilter]);

  const tasksByStatus = React.useMemo(() => {
    const map: Record<IssueStatusId, Issue[]> = {
      "in-progress": [],
      "technical-review": [],
      completed: [],
      paused: [],
      todo: [],
      backlog: [],
    };
    myTasks.forEach((task) => {
      if (map[task.statusId]) map[task.statusId].push(task);
    });
    return map;
  }, [myTasks]);

  const openCreate = (statusId: IssueStatusId) => {
    setCreateDefaultStatusId(statusId);
    setCreateOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggingId(taskId);
    e.dataTransfer.setData("text/plain", taskId);
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
        task.id === id ? { ...task, statusId } : task
      )
    );
    setDraggingId(null);
  };

  const assignTo = (taskId: string, userId: string) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === taskId ? { ...i, assigneeId: userId, updatedAt: "Just now" } : i))
    );
  };

  const changeStatus = (taskId: string, statusId: IssueStatusId) => {
    setIssues((prev) =>
      prev.map((i) => (i.id === taskId ? { ...i, statusId, updatedAt: "Just now" } : i))
    );
  };

  const openDetail = (task: Issue) => {
    setDetailIssue(task);
    setDetailOpen(true);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 bg-card/80 flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <h1 className="text-sm font-semibold">My tasks</h1>
        <Select
          value={projectFilter}
          onValueChange={(value) => {
            if (value !== null) setProjectFilter(value);
          }}
        >
          <SelectTrigger className="h-8 w-[180px] text-xs">
            <SelectValue placeholder="All projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All projects</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id} className="text-xs">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {myTasks.length} task{myTasks.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <div className="flex h-full gap-4 min-w-max">
          {ISSUE_STATUSES.map((status) => {
            const columnTasks = tasksByStatus[status.id];
            return (
              <Card
                key={status.id}
                className="bg-card/80 ring-border/60 flex h-full w-[280px] shrink-0 flex-col overflow-hidden"
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
                      {columnTasks.length}
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
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isDragging={draggingId === task.id}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onStatusChange={(statusId) => changeStatus(task.id, statusId)}
                        onAssignTo={(userId) => assignTo(task.id, userId)}
                        onClick={() => openDetail(task)}
                      />
                    ))}
                  </CardContent>
                </ScrollArea>
              </Card>
            );
          })}
        </div>
      </div>

      <CreateIssueDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultStatusId={createDefaultStatusId}
      />
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

function TaskCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onStatusChange,
  onAssignTo,
  onClick,
}: {
  task: Issue;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onStatusChange: (statusId: IssueStatusId) => void;
  onAssignTo: (userId: string) => void;
  onClick: () => void;
}) {
  const project = PROJECTS.find((p) => p.id === task.projectId);
  const assignee = USERS.find((u) => u.id === task.assigneeId);
  const status = ISSUE_STATUSES.find((s) => s.id === task.statusId);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
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
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-1 text-[10px]"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white",
                    assignee ? `bg-linear-to-br ${assignee.color}` : "bg-muted"
                  )}
                >
                  {assignee?.initials ?? "?"}
                </span>
                <span className="max-w-[72px] truncate">{assignee?.name ?? "Unassigned"}</span>
              </Button>
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
