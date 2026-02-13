"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import { Label } from "@/components/ui/label";
import { USERS } from "@/lib/data";
import { cn, getUserColorClass } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  SearchIcon,
  ArrowRight01Icon,
  UserIcon,
  LayoutIcon,
  FileIcon,
  UserGroupIcon,
  CheckmarkCircle01Icon,
  LinkSquareIcon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";
import type { PullRequest } from "@/lib/data";

const PR_STATUS_META: Record<
  PullRequest["status"],
  { label: string; color: string; icon: typeof LayoutIcon }
> = {
  open: { label: "Open", color: "text-sky-400", icon: LinkSquareIcon },
  merged: { label: "Merged", color: "text-emerald-400", icon: CheckmarkCircle01Icon },
  closed: { label: "Closed", color: "text-rose-400", icon: MoreHorizontalCircle01Icon },
};

export default function PullRequestsPage() {
  const { pullRequests, setPullRequests, currentUser, projects } = useDashboard();
  const [prHeaderSearch, setPrHeaderSearch] = React.useState("");
  const [prFilterMenuOpen, setPrFilterMenuOpen] = React.useState(false);
  const [prFilterPanel, setPrFilterPanel] = React.useState<"root" | "author" | "status" | "date" | "project">("root");
  const [prFilterSearch, setPrFilterSearch] = React.useState("");
  const [prAuthorFilter, setPrAuthorFilter] = React.useState<string[]>([]);
  const [prStatusFilter, setPrStatusFilter] = React.useState<PullRequest["status"][]>([]);
  const [prDateFilter, setPrDateFilter] = React.useState<string[]>([]);
  const [prProjectFilter, setPrProjectFilter] = React.useState<string>("all");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createTitle, setCreateTitle] = React.useState("");
  const [createDescription, setCreateDescription] = React.useState("");
  const [createStatus, setCreateStatus] = React.useState<PullRequest["status"]>("open");
  const [createProjectId, setCreateProjectId] = React.useState<string>("");
  const [detailPr, setDetailPr] = React.useState<PullRequest | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const myPullRequests = React.useMemo(
    () => pullRequests.filter((pr) => pr.authorId === currentUser.id),
    [pullRequests, currentUser.id]
  );

  const prDateOptions = React.useMemo(
    () => Array.from(new Set(myPullRequests.map((pr) => pr.createdAt))),
    [myPullRequests]
  );

  const filteredPullRequests = React.useMemo(() => {
    let list = myPullRequests;

    if (prHeaderSearch.trim()) {
      const q = prHeaderSearch.toLowerCase();
      list = list.filter(
        (pr) =>
          pr.title.toLowerCase().includes(q) ||
          pr.description.toLowerCase().includes(q)
      );
    }

    if (prAuthorFilter.length) {
      list = list.filter((pr) => prAuthorFilter.includes(pr.authorId));
    }
    if (prStatusFilter.length) {
      list = list.filter((pr) => prStatusFilter.includes(pr.status));
    }
    if (prDateFilter.length) {
      list = list.filter((pr) => prDateFilter.includes(pr.createdAt));
    }
    if (prProjectFilter !== "all") {
      list = list.filter((pr) => pr.projectId === prProjectFilter);
    }

    return list;
  }, [myPullRequests, prHeaderSearch, prAuthorFilter, prStatusFilter, prDateFilter, prProjectFilter]);

  const prActiveFilterCount =
    prAuthorFilter.length +
    prStatusFilter.length +
    prDateFilter.length +
    (prProjectFilter !== "all" ? 1 : 0);

  const resetPrFilterPanel = () => {
    setPrFilterPanel("root");
    setPrFilterSearch("");
  };

  const handleCreatePullRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const projectId = createProjectId || projects[0]?.id;
    if (!createTitle.trim() || !createDescription.trim() || !projectId) return;

    const maxNumber = pullRequests.reduce((acc, pr) => Math.max(acc, pr.number), 0);
    const newPr: PullRequest = {
      id: `pr-${Date.now()}`,
      number: maxNumber + 1,
      title: createTitle.trim(),
      description: createDescription.trim(),
      projectId,
      authorId: currentUser.id,
      status: createStatus,
      createdAt: "Just now",
      updatedAt: "Just now",
      labels: [],
    };
    setPullRequests((prev) => [...prev, newPr]);
    setCreateTitle("");
    setCreateDescription("");
    setCreateStatus("open");
    setCreateProjectId(projects[0]?.id ?? "");
    setCreateOpen(false);
  };

  const confirmPullRequestChanges = () => {
    if (!detailPr) return;
    setPullRequests((prev) =>
      prev.map((pr) =>
        pr.id === detailPr.id
          ? {
              ...pr,
              title: detailPr.title.trim(),
              description: detailPr.description.trim(),
              status: detailPr.status,
              projectId: detailPr.projectId,
              updatedAt: "Just now",
            }
          : pr
      )
    );
    setDetailOpen(false);
    setDetailPr(null);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <section className="border-border/80 bg-card/80 flex h-11 shrink-0 items-center gap-2 border-b px-3 sm:h-12 sm:px-4">
        <DropdownMenu
          open={prFilterMenuOpen}
          onOpenChange={(open) => {
            setPrFilterMenuOpen(open);
            if (!open) resetPrFilterPanel();
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
            {prActiveFilterCount > 0 && (
              <span className="bg-primary/10 text-primary ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                {prActiveFilterCount}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 p-0 sm:w-80">
            {prFilterPanel === "root" && (
              <div className="flex flex-col gap-0.5 py-1">
                <div className="flex items-center justify-between px-3 py-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Filter</span>
                  {prActiveFilterCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setPrAuthorFilter([]);
                        setPrStatusFilter([]);
                        setPrDateFilter([]);
                        setPrProjectFilter("all");
                        resetPrFilterPanel();
                      }}
                      className="text-muted-foreground hover:text-foreground text-[11px]"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                {[
                  { key: "author", label: "Created by", icon: UserIcon, color: "text-sky-400" },
                  { key: "status", label: "Status", icon: LayoutIcon, color: "text-amber-400" },
                  { key: "date", label: "Date", icon: FileIcon, color: "text-violet-400" },
                  { key: "project", label: "Project", icon: UserGroupIcon, color: "text-emerald-400" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className="hover:bg-muted/60 flex w-full items-center justify-between px-3 py-1.5 text-xs"
                    onClick={() => setPrFilterPanel(item.key as "author" | "status" | "date" | "project")}
                  >
                    <span className="flex items-center gap-2">
                      <HugeiconsIcon icon={item.icon} className={cn("h-3.5 w-3.5", item.color)} />
                      <span>{item.label}</span>
                    </span>
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
            {prFilterPanel !== "root" && (
              <div className="flex flex-col gap-1 py-1">
                <div className="flex items-center gap-1 px-3 pb-1">
                  <button
                    type="button"
                    className="hover:bg-muted flex h-6 w-6 items-center justify-center rounded-full"
                    onClick={resetPrFilterPanel}
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} className="h-3 w-3 rotate-180" />
                  </button>
                  <span className="text-xs font-medium">
                    {prFilterPanel === "author" && "Created by"}
                    {prFilterPanel === "status" && "Status"}
                    {prFilterPanel === "date" && "Date"}
                    {prFilterPanel === "project" && "Project"}
                  </span>
                </div>
                <div className="px-3 pb-1">
                  <Input
                    value={prFilterSearch}
                    onChange={(e) => setPrFilterSearch(e.target.value)}
                    placeholder={
                      prFilterPanel === "author"
                        ? "Search creator..."
                        : prFilterPanel === "status"
                          ? "Search status..."
                          : prFilterPanel === "date"
                            ? "Search date..."
                            : "Search project..."
                    }
                    className="h-7 border-border/70 bg-background/80 px-2 text-[11px]"
                  />
                </div>
                <div className="max-h-64 space-y-0.5 overflow-y-auto px-1 pb-1">
                  {prFilterPanel === "author" &&
                    USERS.filter((u) => u.name.toLowerCase().includes(prFilterSearch.toLowerCase())).map((u) => {
                      const count = myPullRequests.filter((pr) => pr.authorId === u.id).length;
                      const active = prAuthorFilter.includes(u.id);
                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setPrAuthorFilter((prev) => (active ? prev.filter((id) => id !== u.id) : [...prev, u.id]))}
                          className={cn(
                            "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                            active && "bg-primary/10 text-primary"
                          )}
                        >
                          <span>{u.name}</span>
                          <span className="text-muted-foreground text-[11px]">{count}</span>
                        </button>
                      );
                    })}
                  {prFilterPanel === "status" &&
                    (["open", "merged", "closed"] as PullRequest["status"][])
                      .filter((status) => status.toLowerCase().includes(prFilterSearch.toLowerCase()))
                      .map((status) => {
                        const statusMeta = PR_STATUS_META[status];
                        const count = myPullRequests.filter((pr) => pr.status === status).length;
                        const active = prStatusFilter.includes(status);
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setPrStatusFilter((prev) => (active ? prev.filter((v) => v !== status) : [...prev, status]))}
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span className={cn("inline-flex items-center gap-1.5", statusMeta.color)}>
                              <HugeiconsIcon icon={statusMeta.icon} className="h-3.5 w-3.5" />
                              <span>{statusMeta.label}</span>
                            </span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}
                  {prFilterPanel === "date" &&
                    prDateOptions
                      .filter((date) => date.toLowerCase().includes(prFilterSearch.toLowerCase()))
                      .map((date) => {
                        const count = myPullRequests.filter((pr) => pr.createdAt === date).length;
                        const active = prDateFilter.includes(date);
                        return (
                          <button
                            key={date}
                            type="button"
                            onClick={() => setPrDateFilter((prev) => (active ? prev.filter((v) => v !== date) : [...prev, date]))}
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span>{date}</span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}
                  {prFilterPanel === "project" &&
                    projects
                      .filter((project) => project.name.toLowerCase().includes(prFilterSearch.toLowerCase()))
                      .map((project) => {
                        const count = myPullRequests.filter((pr) => pr.projectId === project.id).length;
                        const active = prProjectFilter === project.id;
                        return (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => setPrProjectFilter((prev) => (prev === project.id ? "all" : project.id))}
                            className={cn(
                              "hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs",
                              active && "bg-primary/10 text-primary"
                            )}
                          >
                            <span>{project.name}</span>
                            <span className="text-muted-foreground text-[11px]">{count}</span>
                          </button>
                        );
                      })}
                </div>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 sm:max-w-sm">
          <Input
            value={prHeaderSearch}
            onChange={(e) => setPrHeaderSearch(e.target.value)}
            placeholder="Search title or description..."
            className="h-8 border-border/70 bg-background/80 px-2 text-[11px]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-muted-foreground hidden text-[11px] sm:inline">
            {filteredPullRequests.length} pull request{filteredPullRequests.length !== 1 ? "s" : ""}
          </span>
          <Button
            type="button"
            size="sm"
            className="h-8 rounded-full px-3 text-[11px]"
            onClick={() => setCreateOpen(true)}
          >
            <HugeiconsIcon icon={PlusSignIcon} className="h-3.5 w-3.5" />
            Create PR
          </Button>
        </div>
      </section>

      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <Card className="bg-card/80 ring-border/60 flex h-full flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between gap-2 border-b border-border/60 py-2.5 px-3">
            <CardTitle className="text-xs font-medium">
              Pull requests · {filteredPullRequests.length}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
            {filteredPullRequests.map((pr) => (
              <ProjectPullRequestRow
                key={pr.id}
                pullRequest={pr}
                onClick={() => {
                  setDetailPr(pr);
                  setDetailOpen(true);
                }}
              />
            ))}
            {filteredPullRequests.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-xs">
                No pull requests match the selected filters.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (open && !createProjectId) {
            setCreateProjectId(projects[0]?.id ?? "");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create pull request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePullRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pr-title">Title</Label>
              <Input id="pr-title" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} required className="text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pr-description">Description</Label>
              <textarea
                id="pr-description"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
                required
                className="border-input bg-background focus-visible:ring-ring/50 min-h-[100px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={createStatus} onValueChange={(v) => setCreateStatus(v as PullRequest["status"])}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open" className="text-xs">Open</SelectItem>
                    <SelectItem value="merged" className="text-xs">Merged</SelectItem>
                    <SelectItem value="closed" className="text-xs">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select
                  value={createProjectId}
                  onValueChange={(v) => {
                    if (v != null) setCreateProjectId(v);
                  }}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={!createTitle.trim() || !createDescription.trim()}>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{detailPr ? `PR #${detailPr.number}` : "Pull request details"}</DialogTitle>
          </DialogHeader>
          {detailPr && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="detail-pr-title">Title</Label>
                <Input
                  id="detail-pr-title"
                  value={detailPr.title}
                  onChange={(e) => setDetailPr((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="detail-pr-description">Description</Label>
                <textarea
                  id="detail-pr-description"
                  value={detailPr.description}
                  onChange={(e) => setDetailPr((prev) => (prev ? { ...prev, description: e.target.value } : prev))}
                  className="border-input bg-background focus-visible:ring-ring/50 min-h-[100px] w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={detailPr.status}
                    onValueChange={(value) => setDetailPr((prev) => (prev ? { ...prev, status: value as PullRequest["status"] } : prev))}
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open" className="text-xs">Open</SelectItem>
                      <SelectItem value="merged" className="text-xs">Merged</SelectItem>
                      <SelectItem value="closed" className="text-xs">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Project</Label>
                  <Select
                    value={detailPr.projectId}
                    onValueChange={(value) =>
                      setDetailPr((prev) =>
                        prev && value != null ? { ...prev, projectId: value } : prev
                      )
                    }
                  >
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id} className="text-xs">{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailOpen(false)}>Cancel</Button>
                <Button onClick={confirmPullRequestChanges} disabled={!detailPr.title.trim() || !detailPr.description.trim()}>
                  Confirm
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProjectPullRequestRow({
  pullRequest,
  onClick,
}: {
  pullRequest: PullRequest;
  onClick: () => void;
}) {
  const author = USERS.find((u) => u.id === pullRequest.authorId);
  const statusMeta = PR_STATUS_META[pullRequest.status];

  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-muted/60 flex w-full items-start justify-between gap-2 rounded-md border border-border/60 bg-background/80 px-3 py-2 text-left text-xs transition-colors"
    >
      <div className="min-w-0">
        <div className="font-medium">
          #{pullRequest.number} · {pullRequest.title}
        </div>
        <p className="text-muted-foreground line-clamp-2 text-[11px]">
          {pullRequest.description}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/30 px-2 py-0.5",
              statusMeta.color
            )}
          >
            <HugeiconsIcon icon={statusMeta.icon} className="h-3 w-3" />
            <span>{statusMeta.label}</span>
          </span>
          <span>·</span>
          <span>Opened {pullRequest.createdAt}</span>
          <span>·</span>
          <span>Updated {pullRequest.updatedAt}</span>
        </div>
      </div>
      <div className="flex min-w-[110px] items-center justify-end gap-2">
        {author && (
          <>
            <span className="text-muted-foreground text-[11px]">{author.name}</span>
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                getUserColorClass(author.color)
              )}
            >
              {author.initials}
            </span>
          </>
        )}
      </div>
    </button>
  );
}
