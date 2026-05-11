"use client";

import React, { useMemo, useState } from "react";
import { useContent } from "@/context/ContentContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";

export function AuditLogs() {
  const { auditLogs, isLoading } = useContent();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const formatTimestamp = (date: Date): string => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

  function getActionBadgeColor(action: string): BadgeVariant {
    switch (action.toLowerCase()) {
      case "create":
        return "default";
      case "update":
        return "secondary";
      case "delete":
        return "destructive";
      default:
        return "outline";
    }
  }

  const formatTableName = (name: string): string => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const sortedLogs = useMemo(
    () => [...auditLogs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [auditLogs],
  );

  const pageCount = Math.max(1, Math.ceil(sortedLogs.length / PAGE_SIZE));
  const currentPageLogs = sortedLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">Loading audit logs...</p>
      </div>
    );
  }

  if (sortedLogs.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-500">No audit logs found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-900">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Record ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageLogs.map((log) => {
              const isOpen = !!expanded[log.id];
              return (
                <React.Fragment key={log.id}>
                  <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <TableCell className="w-12">
                      {log.changes ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggle(log.id)}
                          aria-expanded={isOpen}
                          aria-controls={`changes-${log.id}`}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                          />
                        </Button>
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </TableCell>

                    <TableCell className="font-mono text-sm">{formatTimestamp(log.createdAt)}</TableCell>

                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {log.actorId ? log.actorId.substring(0, 8) : "System"}
                    </TableCell>

                    <TableCell>
                      <Badge variant={getActionBadgeColor(log.action)}>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-sm">{formatTableName(log.tableName)}</TableCell>

                    <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                      {log.recordId ? log.recordId.substring(0, 8) : "-"}
                    </TableCell>
                  </TableRow>

                  {log.changes && isOpen && (
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableCell colSpan={6} className="p-4" id={`changes-${log.id}`}>
                        <div className="space-y-2">
                          <p className="font-semibold text-sm mb-2">Changes:</p>
                          <pre className="bg-white dark:bg-gray-950 p-3 rounded border border-gray-200 dark:border-gray-800 overflow-auto max-h-64 text-xs">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, sortedLogs.length)} of {sortedLogs.length}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>

          <div className="text-sm">Page {page} / {pageCount}</div>

          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
