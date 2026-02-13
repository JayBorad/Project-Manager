"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  LinkSquareIcon,
  AttachmentIcon,
  MessageIcon,
  CheckmarkSquareIcon,
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
  const selected = notifications.find((n) => n.id === selectedId);

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
    if (selectedId === id)
      setSelectedId(notifications.find((n) => n.id !== id)?.id ?? null);
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
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        {/* List */}
        <div className="bg-card/80 ring-border/60 flex min-h-0 flex-col rounded-none border-0 border-r">
          <div className="border-border/80 shrink-0 border-b p-3 flex items-center justify-between">
            <CardTitle className="text-xs">Notifications</CardTitle>
            <div className="flex items-center gap-0.5">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 flex items-center justify-center"
                      onClick={markAllAsRead}
                    >
                      <HugeiconsIcon
                        icon={CheckmarkSquareIcon}
                        className="h-4 w-4"
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
                      size="sm"
                      className="h-8 w-8 p-0 flex items-center justify-center text-destructive hover:text-destructive"
                      onClick={deleteAll}
                      disabled={notifications.length === 0}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </Button>
                  }
                />
                <TooltipContent side="bottom">Delete all</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <ScrollArea className="flex-1 min-h-0">
            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  No notifications
                </div>
              ) : (
                <ul>
                  {notifications.map((item) => (
                    <li
                      key={item.id}
                      className={cn(
                        "hover:bg-muted/60 flex cursor-pointer flex-col gap-1 border-b border-border/60 px-3 py-3 transition-colors",
                        selectedId === item.id && "bg-muted/80",
                        !item.read && "bg-primary/5",
                      )}
                      onClick={() => {
                        setSelectedId(item.id);
                        if (!item.read) markAsRead(item.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="line-clamp-1 flex-1 text-xs font-medium">
                          {item.title}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-[10px]">
                          {item.createdAt}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-muted-foreground text-[11px]">
                          {item.projectKey} · {item.type.replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-1">
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
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </ScrollArea>
        </div>

        {/* Detail */}
        <div className="bg-card/80 ring-border/60 flex min-h-0 flex-col rounded-none border-0">
          <div className="border-border/80 shrink-0 border-b p-5">
            <CardTitle className="text-xs">Details</CardTitle>
          </div>
          {selected ? (
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
    <ScrollArea className="flex-1 min-h-0">
      <CardContent className="flex flex-col gap-4 py-4">
        <div>
          <h2 className="text-sm font-medium">{notification.title}</h2>
          <p className="text-muted-foreground mt-1 text-xs">
            {notification.body}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Badge variant="outline" className="text-[10px]">
              {notification.projectKey}
            </Badge>
            <span>{notification.type.replace("_", " ")}</span>
            <span>·</span>
            <span>{notification.createdAt}</span>
          </div>
        </div>

        {/* Attachments */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium">Attachments</span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px]"
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
                className="text-muted-foreground flex items-center gap-2 rounded border border-border/60 bg-muted/30 px-2 py-1.5 text-[11px]"
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

        {/* Comments */}
        <div className="flex-1">
          <span className="text-xs font-medium">Comments</span>
          <ul className="mt-2 space-y-2">
            {notification.comments.map((c) => {
              const author = USERS.find((u) => u.id === c.authorId);
              return (
                <li
                  key={c.id}
                  className="rounded-md border border-border/60 bg-muted/30 p-2"
                >
                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className={cn(
                        "bg-linear-to-br flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white",
                        author ? author.color : "bg-muted",
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
              className="h-8 text-xs"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), onAddComment())
              }
            />
            <Button
              size="sm"
              className="h-8 text-xs"
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
