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
import { Input } from "@/components/ui/input";
import { CreateIssueDialog } from "@/components/create-issue-dialog";
import { IssueDetailDialog } from "@/components/issue-detail-dialog";
import { ISSUE_STATUSES, PROJECTS, USERS, LABEL_OPTIONS } from "@/lib/data";
import type { Issue, IssueStatusId } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  SearchIcon,
  LayoutIcon,
  MoreHorizontalCircle01Icon,
  ArrowRight01Icon,
  UserIcon,
  FileIcon,
  FolderIcon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

export default function MyTasksPage() {
  const { issues, setIssues, currentUser, projects } = useDashboard();
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createDefaultStatusId, setCreateDefaultStatusId] = React.useState<IssueStatusId>("todo");
  const [projectFilter, setProjectFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<IssueStatusId[]>([]);
  const [assigneeFilter, setAssigneeFilter] = React.useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = React.useState<Issue["priority"][]>([]);
  const [labelFilter, setLabelFilter] = React.useState<string[]>([]);
  const [viewMode, setViewMode] = React.useState<"board" | "list">("board");
  const [filterMenuOpen, setFilterMenuOpen] = React.useState(false);
  const [filterPanel, setFilterPanel] = React.useState<
    "root" | "status" | "assignee" | "priority" | "labels" | "project"
  >("root");
  const [filterSearch, setFilterSearch] = React.useState("");
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [detailIssue, setDetailIssue] = React.useState<Issue | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  // My tasks = assigned to current user
  const myTasksBase = React.useMemo(
    () => issues.filter((i) => i.assigneeId === currentUser.id),
    [issues, currentUser.id]
  );

  const filteredTasks = React.useMemo(() => {
    let list = myTasksBase;

    if (projectFilter !== "all") {
      list = list.filter((i) => i.projectId === projectFilter);
    }

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
  }, [myTasksBase, projectFilter, statusFilter, assigneeFilter, priorityFilter, labelFilter]);

  const tasksByStatus = React.useMemo(() => {
    const map: Record<IssueStatusId, Issue[]> = {
      "in-progress": [],
      "technical-review": [],
      completed: [],
      paused: [],
      todo: [],
      backlog: [],
    };
    filteredTasks.forEach((task) => {
      if (map[task.statusId]) map[task.statusId].push(task);
    });
    return map;
  }, [filteredTasks]);

  const activeFilterCount =
    statusFilter.length +
    assigneeFilter.length +
    priorityFilter.length +
    labelFilter.length +
    (projectFilter !== "all" ? 1 : 0);

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

  const resetFilterPanel = () => {
    setFilterPanel("root");
    setFilterSearch("");
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      {/* Page-level header: filters & layout controls */}
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
                        setProjectFilter("all");
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
                <button
                  type="button"
                  className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                  onClick={() => setFilterPanel("project")}
                >
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon icon={FolderIcon} className="h-3.5 w-3.5 text-orange-400" />
                    <span>Project</span>
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
                    {filterPanel === "project" && "Project"}
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
                            : filterPanel === "labels"
                              ? "Search labels..."
                              : "Search projects..."
                    }
                    className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                  />
                </div>

                <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                  {filterPanel === "status" &&
                    ISSUE_STATUSES.filter((s) =>
                      s.title.toLowerCase().includes(filterSearch.toLowerCase())
                    ).map((s) => {
                      const count = tasksByStatus[s.id]?.length ?? 0;
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
                      const count = myTasksBase.filter((i) => i.assigneeId === u.id).length;
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
                        const count = myTasksBase.filter((i) => i.priority === p).length;
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
                      const count = myTasksBase.filter((i) =>
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

                  {filterPanel === "project" &&
                    projects
                      .filter((p) =>
                        p.name.toLowerCase().includes(filterSearch.toLowerCase())
                      )
                      .map((p) => {
                        const count = myTasksBase.filter((i) => i.projectId === p.id).length;
                        const active = projectFilter === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() =>
                              setProjectFilter((prev) =>
                                prev === p.id ? "all" : p.id
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
                                  "flex h-4 w-4 items-center justify-center rounded text-[9px] font-semibold text-white",
                                  p.color
                                )}
                              >
                                {p.code.slice(0, 1)}
                              </span>
                              <span>{p.name}</span>
                            </span>
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
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
          </span>

          {/* Layout toggle */}
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

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-4">
        {viewMode === "board" ? (
          <div className="flex h-full min-w-max gap-3 sm:gap-4">
            {ISSUE_STATUSES.map((status) => {
              const columnTasks = tasksByStatus[status.id];
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
        ) : (
          <Card className="bg-card/80 ring-border/60 flex h-full min-w-full flex-col overflow-hidden">
            <CardHeader className="border-border/80 flex flex-row items-center justify-between gap-2 border-b py-2.5 px-3">
              <CardTitle className="text-xs font-medium">My tasks</CardTitle>
              <span className="text-muted-foreground text-[11px]">
                {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
              </span>
            </CardHeader>
            <ScrollArea className="flex-1">
              <CardContent className="flex flex-col gap-3 p-2">
                {ISSUE_STATUSES.map((status) => {
                  const sectionTasks = filteredTasks.filter(
                    (task) => task.statusId === status.id
                  );
                  if (sectionTasks.length === 0) return null;
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
                          {sectionTasks.length}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {sectionTasks.map((task) => (
                          <TaskRow
                            key={task.id}
                            task={task}
                            onStatusChange={(statusId) => changeStatus(task.id, statusId)}
                            onAssignTo={(userId) => assignTo(task.id, userId)}
                            onClick={() => openDetail(task)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </ScrollArea>
          </Card>
        )}
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
              {/* <span className="max-w-[72px] truncate">{assignee?.name ?? "Unassigned"}</span> */}
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

function TaskRow({
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
    <button
      type="button"
      onClick={onClick}
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
    </button>
  );
}
