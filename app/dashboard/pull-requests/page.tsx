"use client";

import * as React from "react";
import { useDashboard } from "@/lib/dashboard-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECTS, USERS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PullRequestsPage() {
  const { pullRequests, setPullRequests, currentUser, projects } = useDashboard();
  const [projectFilter, setProjectFilter] = React.useState<string>("all");

  const myPRs = React.useMemo(() => {
    let list = pullRequests.filter((pr) => pr.authorId === currentUser.id);
    if (projectFilter !== "all") {
      list = list.filter((pr) => pr.projectId === projectFilter);
    }
    return list;
  }, [pullRequests, currentUser.id, projectFilter]);

  const prsByProject = React.useMemo(() => {
    const map: Record<string, typeof myPRs> = {};
    myPRs.forEach((pr) => {
      if (!map[pr.projectId]) map[pr.projectId] = [];
      map[pr.projectId].push(pr);
    });
    return map;
  }, [myPRs]);

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <header className="border-border/80 bg-card/80 flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <h1 className="text-sm font-semibold">Pull requests</h1>
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
          <Button size="sm" className="h-8 text-xs">
            <HugeiconsIcon icon={PlusSignIcon} className="mr-1 h-3.5 w-3.5" />
            New PR
          </Button>
          <span className="text-muted-foreground text-xs">
            {myPRs.length} PR{myPRs.length !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {Object.entries(prsByProject).map(([projectId, prs]) => {
            const project = PROJECTS.find((p) => p.id === projectId);
            return (
              <div key={projectId}>
                <h2 className="mb-3 text-sm font-medium">{project?.name ?? projectId}</h2>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {prs.map((pr) => (
                    <Card key={pr.id} className="bg-card/80 ring-border/60 hover:ring-border/80 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="line-clamp-2 text-xs font-medium">
                              {pr.title}
                            </CardTitle>
                            <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span>#{pr.number}</span>
                              <span>·</span>
                              <span>{pr.updatedAt}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              pr.status === "merged"
                                ? "default"
                                : pr.status === "open"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-[10px]"
                          >
                            {pr.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground line-clamp-2 text-[11px]">
                          {pr.description}
                        </p>
                        {pr.labels.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {pr.labels.slice(0, 3).map((l) => (
                              <Badge
                                key={l.name}
                                variant="secondary"
                                className={cn("text-[10px] font-normal", l.color)}
                              >
                                {l.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
          {myPRs.length === 0 && (
            <div className="text-muted-foreground py-12 text-center text-sm">
              No pull requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
