"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn, getUserColorClass } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  LinkSquareIcon,
  AttachmentIcon,
  MessageIcon,
  CheckmarkSquareIcon,
  SearchIcon,
  UserIcon,
  FileIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import type { Notification } from "@/lib/data";
import { USERS } from "@/lib/data";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InboxPage() {
  const { notifications, setNotifications, currentUser } = useDashboard();
  const [selectedId, setSelectedId] = React.useState<string | null>(
    notifications[0]?.id ?? null,
  );
  const [commentText, setCommentText] = React.useState("");
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(timeout);
  }, []);

  const filteredNotifications = React.useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return notifications;
    return notifications.filter((n) => {
      const typeLabel = n.type.replace("_", " ");
      return (
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.projectKey.toLowerCase().includes(q) ||
        typeLabel.toLowerCase().includes(q)
      );
    });
  }, [notifications, searchText]);

  const selected =
    filteredNotifications.find((n) => n.id === selectedId) ??
    notifications.find((n) => n.id === selectedId);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) {
      setSelectedId(notifications.find((n) => n.id !== id)?.id ?? null);
    }
  };

  const deleteAll = () => {
    setNotifications([]);
    setSelectedId(null);
  };

  const addComment = (notificationId: string) => {
    if (!commentText.trim()) return;
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? {
              ...n,
              comments: [
                ...n.comments,
                {
                  id: `c-${Date.now()}`,
                  authorId: currentUser.id,
                  text: commentText.trim(),
                  createdAt: "Just now",
                },
              ],
            }
          : n,
      ),
    );
    setCommentText("");
  };

  const addAttachment = (notificationId: string) => {
    const name = `attachment-${Date.now()}.pdf`;
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId
          ? {
              ...n,
              attachments: [
                ...n.attachments,
                { id: `a-${Date.now()}`, name, url: "#" },
              ],
            }
          : n,
      ),
    );
  };

  return (
    <div className="bg-card/80 flex h-full flex-1 flex-col overflow-hidden">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[minmax(320px,1fr)_minmax(0,1.6fr)]">
        <div className="flex min-h-0 flex-col border-0 border-r">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2">
            <CardTitle className="flex items-center gap-1.5 text-xs">
              <HugeiconsIcon
                icon={FileIcon}
                className="text-primary h-3.5 w-3.5"
              />
              Notifications
            </CardTitle>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={markAllAsRead}
                    >
                      <HugeiconsIcon
                        icon={CheckmarkSquareIcon}
                        className="h-3.5 w-3.5"
                      />
                    </Button>
                  }
                />
                <TooltipContent side="bottom">Mark all as read</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={deleteAll}
                      disabled={notifications.length === 0}
                    >
                      <HugeiconsIcon
                        icon={Delete02Icon}
                        className="h-3.5 w-3.5"
                      />
                    </Button>
                  }
                />
                <TooltipContent side="bottom">Delete all</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="shrink-0 border-b px-3 py-2">
            <div className="relative">
              <HugeiconsIcon
                icon={SearchIcon}
                className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              />
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search title, body, project..."
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <CardContent className="p-0">
              {loading ? (
                <InboxListSkeleton />
              ) : filteredNotifications.length === 0 ? (
                <div className="text-muted-foreground py-12 text-center text-sm">
                  No notifications found
                </div>
              ) : (
                <ul>
                  {filteredNotifications.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        "pm-animated-row hover:bg-muted/60 flex cursor-pointer flex-col gap-2 border-b border-border/60 px-3 py-3 transition-colors",
                        selectedId === item.id && "bg-muted/80",
                        !item.read && "bg-primary/5",
                      )}
                      onClick={() => {
                        setSelectedId(item.id);
                        if (!item.read) markAsRead(item.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <NotificationTypeIcon type={item.type} />
                            <span className="line-clamp-1 text-xs font-medium">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[11px]">
                            {item.body}
                          </p>
                        </div>
                        <span className="text-muted-foreground shrink-0 text-[10px]">
                          {item.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-[11px]">
                          {item.projectKey} · {item.type.replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(item.id);
                                  }}
                                  title="Mark as read"
                                >
                                  <HugeiconsIcon
                                    icon={LinkSquareIcon}
                                    className="h-3.5 w-3.5"
                                  />
                                </Button>
                              }
                            />
                            <TooltipContent side="bottom">
                              Mark as read
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOne(item.id);
                                  }}
                                  title="Delete"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02Icon}
                                    className="h-3.5 w-3.5"
                                  />
                                </Button>
                              }
                            />
                            <TooltipContent side="bottom">
                              Delete
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </ScrollArea>
        </div>

        <div className="flex min-h-0 flex-col border-0">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-4">
            <CardTitle className="flex items-center gap-1.5 text-xs">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="text-primary h-3.5 w-3.5"
              />
              Details
            </CardTitle>
          </div>
          {loading ? (
            <InboxDetailSkeleton />
          ) : selected ? (
            <NotificationDetail
              notification={selected}
              commentText={commentText}
              setCommentText={setCommentText}
              onAddComment={() => addComment(selected.id)}
              onAddAttachment={() => addAttachment(selected.id)}
            />
          ) : (
            <CardContent className="text-muted-foreground flex flex-1 items-center justify-center text-sm">
              Select a notification to view details
            </CardContent>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationTypeIcon({ type }: { type: Notification["type"] }) {
  if (type === "pull_request") {
    return (
      <span className="bg-sky-500/15 text-sky-500 flex h-5 w-5 items-center justify-center rounded-md">
        <HugeiconsIcon icon={LinkSquareIcon} className="h-3 w-3" />
      </span>
    );
  }
  if (type === "issue_comment") {
    return (
      <span className="bg-violet-500/15 text-violet-500 flex h-5 w-5 items-center justify-center rounded-md">
        <HugeiconsIcon icon={MessageIcon} className="h-3 w-3" />
      </span>
    );
  }
  return (
    <span className="bg-emerald-500/15 text-emerald-500 flex h-5 w-5 items-center justify-center rounded-md">
      <HugeiconsIcon icon={UserIcon} className="h-3 w-3" />
    </span>
  );
}

function NotificationDetail({
  notification,
  commentText,
  setCommentText,
  onAddComment,
  onAddAttachment,
}: {
  notification: Notification;
  commentText: string;
  setCommentText: (v: string) => void;
  onAddComment: () => void;
  onAddAttachment: () => void;
}) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <CardContent className="flex flex-col gap-4 py-4">
        <div className="pm-animated-row rounded-xl border border-border/60 bg-muted/20 p-3">
          <h2 className="text-sm font-medium">{notification.title}</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            {notification.body}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">
              {notification.projectKey}
            </Badge>
            <span>{notification.type.replace("_", " ")}</span>
            <span>·</span>
            <span>{notification.createdAt}</span>
          </div>
        </div>

        <div className="pm-animated-row rounded-xl border border-border/60 bg-muted/20 p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium">Attachments</span>
            <Button
              variant="outline"
              size="sm"
              className="pm-input h-7 text-[11px]"
              onClick={onAddAttachment}
            >
              <HugeiconsIcon icon={AttachmentIcon} className="mr-1 h-3 w-3" />
              Add
            </Button>
          </div>
          <ul className="space-y-1">
            {notification.attachments.map((a) => (
              <li
                key={a.id}
                className="text-muted-foreground flex items-center gap-2 rounded border border-border/60 bg-background/70 px-2 py-1.5 text-[11px]"
              >
                <HugeiconsIcon icon={AttachmentIcon} className="h-3.5 w-3.5" />
                {a.name}
              </li>
            ))}
            {notification.attachments.length === 0 && (
              <li className="text-muted-foreground text-[11px]">
                No attachments
              </li>
            )}
          </ul>
        </div>

        <div className="pm-animated-row flex-1 rounded-xl border border-border/60 bg-muted/20 p-3">
          <span className="text-xs font-medium">Comments</span>
          <ul className="mt-2 space-y-2">
            {notification.comments.map((c) => {
              const author = USERS.find((u) => u.id === c.authorId);
              return (
                <li
                  key={c.id}
                  className="rounded-md border border-border/60 bg-background/70 p-2"
                >
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                        author ? getUserColorClass(author.color) : "bg-muted",
                      )}
                    >
                      {author?.initials ?? "?"}
                    </span>
                    <span className="font-medium">
                      {author?.name ?? "Unknown"}
                    </span>
                    <span className="text-muted-foreground">{c.createdAt}</span>
                  </div>
                  <p className="mt-1 text-xs">{c.text}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="pm-input h-8 text-xs"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), onAddComment())
              }
            />
            <Button
              size="sm"
              className="pm-primary-btn h-8 text-xs"
              onClick={onAddComment}
              disabled={!commentText.trim()}
            >
              <HugeiconsIcon icon={MessageIcon} className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </ScrollArea>
  );
}

function InboxListSkeleton() {
  return (
    <div className="p-2">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="mb-2 animate-pulse rounded-lg border border-border/60 bg-muted/30 p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="h-3 w-2/3 rounded bg-muted" />
            <div className="h-2.5 w-10 rounded bg-muted" />
          </div>
          <div className="mb-2 h-2.5 w-full rounded bg-muted" />
          <div className="h-2.5 w-1/2 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function InboxDetailSkeleton() {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <CardContent className="space-y-3 py-4">
        <div className="animate-pulse rounded-xl border border-border/60 bg-muted/30 p-3">
          <div className="mb-2 h-4 w-2/3 rounded bg-muted" />
          <div className="mb-2 h-3 w-full rounded bg-muted" />
          <div className="h-3 w-5/6 rounded bg-muted" />
        </div>
        <div className="animate-pulse rounded-xl border border-border/60 bg-muted/30 p-3">
          <div className="mb-2 h-3.5 w-28 rounded bg-muted" />
          <div className="space-y-1.5">
            <div className="h-8 rounded bg-muted" />
            <div className="h-8 rounded bg-muted" />
          </div>
        </div>
        <div className="animate-pulse rounded-xl border border-border/60 bg-muted/30 p-3">
          <div className="mb-2 h-3.5 w-20 rounded bg-muted" />
          <div className="h-20 rounded bg-muted" />
        </div>
      </CardContent>
    </ScrollArea>
  );
}
