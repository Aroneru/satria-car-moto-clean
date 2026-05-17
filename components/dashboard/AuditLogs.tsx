"use client";

import React, { useMemo, useState } from "react";
import { useContent } from "@/context/ContentContext";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export function AuditLogs() {
  const { auditLogs, isLoading } = useContent();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  
  // State untuk Filter (Default Period = 'today')
  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("today");
  
  const PAGE_SIZE = 10;

  const formatTimestamp = (date: Date | string): string => {
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

  // Logic Filtering & Sorting
  const filteredAndSortedLogs = useMemo(() => {
    let filtered = auditLogs;

    // Filter by Type (Action)
    if (filterType !== "all") {
      filtered = filtered.filter((log) => log.action.toLowerCase() === filterType);
    }

    // Filter by Period
    if (filterPeriod !== "all") {
      const now = new Date();
      filtered = filtered.filter((log) => {
        const transDate = new Date(log.createdAt);
        
        if (filterPeriod === "today") {
          return transDate.toDateString() === now.toDateString();
        } else if (filterPeriod === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return transDate >= weekAgo;
        } else if (filterPeriod === "month") {
          return (
            transDate.getMonth() === now.getMonth() &&
            transDate.getFullYear() === now.getFullYear()
          );
        }
        return true;
      });
    }

    // Sort by Date (Terbaru di atas)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [auditLogs, filterType, filterPeriod]);

  // Kalkulasi Pagination dari data yang sudah di-filter
  const pageCount = Math.max(1, Math.ceil(filteredAndSortedLogs.length / PAGE_SIZE));
  const currentPageLogs = filteredAndSortedLogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const multiplesOf10 = useMemo(() => {
    const maxMultiple = Math.floor(pageCount / 10) * 10;
    if (maxMultiple === 0) return [];

    const currentMultiple = Math.ceil(page / 10) * 10;
    const jumpSet = new Set<number>();

    if (maxMultiple >= 10) {
      jumpSet.add(10);
    }

    if (currentMultiple - 10 > 0) jumpSet.add(currentMultiple - 10);
    if (currentMultiple > 0 && currentMultiple <= maxMultiple) jumpSet.add(currentMultiple);
    if (currentMultiple + 10 <= maxMultiple) jumpSet.add(currentMultiple + 10);
    
    jumpSet.add(maxMultiple);

    const sortedJumps = Array.from(jumpSet).sort((a, b) => a - b);
    const result: (number | string)[] = [];
    
    for (let i = 0; i < sortedJumps.length; i++) {
      result.push(sortedJumps[i]);
      if (i < sortedJumps.length - 1 && sortedJumps[i + 1] - sortedJumps[i] > 10) {
        result.push("...");
      }
    }
    
    return result;
  }, [pageCount, page]);

  const toggle = (id: string) => setExpanded((s) => ({ ...s, [id]: !s[id] }));

  // Helper untuk ganti filter sekalian reset page
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setPage(1); // Balik ke page 1 tiap kali filter berubah
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 border-b bg-gray-50">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-4 p-4 border-b">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Container Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Dropdown Type */}
        <div className="relative">
          <select
            value={filterType}
            onChange={(e) => handleFilterChange(setFilterType, e.target.value)}
            className="appearance-none bg-white border border-[#FCDE04] text-slate-700 py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCDE04]/50 cursor-pointer text-sm font-medium min-w-[140px]"
          >
            <option value="all">All Types</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>

        {/* Dropdown Period */}
        <div className="relative">
          <select
            value={filterPeriod}
            onChange={(e) => handleFilterChange(setFilterPeriod, e.target.value)}
            className="appearance-none bg-white border border-[#FCDE04] text-slate-700 py-2 pl-4 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FCDE04]/50 cursor-pointer text-sm font-medium min-w-[140px]"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black pointer-events-none" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        {/* Area Tabel */}
        <div className="overflow-x-auto min-h-[400px]">
          {filteredAndSortedLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full py-16">
              <p className="text-gray-500 font-medium">No audit logs found for the selected filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-transparent border-b border-gray-300">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 h-12"></TableHead>
                  <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider h-12">Timestamp</TableHead>
                  <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider h-12">User ID</TableHead>
                  <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider h-12">Action</TableHead>
                  <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider h-12">Table</TableHead>
                  <TableHead className="text-xs font-bold text-gray-500 uppercase tracking-wider h-12">Record ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPageLogs.map((log) => {
                  const isOpen = !!expanded[log.id];
                  return (
                    <React.Fragment key={log.id}>
                      <TableRow className="hover:bg-gray-50 border-b border-gray-100 transition-colors">
                        <TableCell className="w-12 py-3.5">
                          {log.changes ? (
                            <Button
                              size="sm"
                              onClick={() => toggle(log.id)}
                              aria-expanded={isOpen}
                              aria-controls={`changes-${log.id}`}
                              className="h-7 w-7 !p-0 !bg-gray-700 hover:!bg-gray-800 !text-white rounded shadow-sm"
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
                              />
                            </Button>
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                        </TableCell>

                        <TableCell className="font-mono text-sm text-gray-700 py-3.5">{formatTimestamp(log.createdAt)}</TableCell>

                        <TableCell className="text-sm text-gray-700 py-3.5">
                          {log.actorId ? log.actorId.substring(0, 8) : "System"}
                        </TableCell>

                        <TableCell className="py-3.5">
                          <Badge variant={getActionBadgeColor(log.action)} className="font-medium shadow-none">
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-sm text-gray-700 py-3.5">{formatTableName(log.tableName)}</TableCell>

                        <TableCell className="font-mono text-sm text-gray-700 py-3.5">
                          {log.recordId ? log.recordId.substring(0, 8) : "-"}
                        </TableCell>
                      </TableRow>

                      {log.changes && isOpen && (
                        <TableRow className="bg-gray-50/50">
                          <TableCell colSpan={6} className="p-4 border-b border-gray-100" id={`changes-${log.id}`}>
                            <div className="space-y-2">
                              <p className="font-semibold text-sm mb-2 text-gray-900">Changes:</p>
                              <pre className="p-3 rounded-md border border-gray-300 overflow-auto max-h-64 text-xs shadow-inner !bg-gray-950 !text-gray-100 font-mono">
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
          )}
        </div>

        {/* Area Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-200 bg-white">
          <div className="text-sm text-gray-500 font-medium">
            Showing {filteredAndSortedLogs.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredAndSortedLogs.length)} of {filteredAndSortedLogs.length} entries <span className="mx-2 hidden sm:inline">&middot;</span> <span className="block sm:inline mt-1 sm:mt-0">Page {page} of {pageCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              onClick={() => setPage((p) => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="w-8 h-8 p-0 min-w-0 transition-colors rounded !bg-white !border-gray-200 !text-gray-500 hover:!bg-gray-50 hover:!text-gray-700 disabled:!opacity-50 disabled:hover:!bg-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {multiplesOf10.map((m, index) => (
              m === "..." ? (
                <span key={`ellipsis-${index}`} className="px-1 text-gray-400 font-bold tracking-widest flex items-center justify-center w-8">...</span>
              ) : (
                <Button
                  key={m}
                  variant="outline"
                  onClick={() => setPage(m as number)}
                  className={`h-8 min-w-[2rem] px-2 p-0 text-sm font-medium transition-colors rounded ${
                    page === m 
                      ? "!bg-[#FCDE04] !border-[#FCDE04] !text-black shadow-sm" 
                      : "!bg-white !border-gray-200 !text-gray-600 hover:!bg-gray-50 hover:!text-gray-900"
                  }`}
                >
                  {m}
                </Button>
              )
            ))}

            <Button 
              variant="outline" 
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))} 
              disabled={page === pageCount || pageCount === 0}
              className="w-8 h-8 p-0 min-w-0 transition-colors rounded !bg-white !border-gray-200 !text-gray-500 hover:!bg-gray-50 hover:!text-gray-700 disabled:!opacity-50 disabled:hover:!bg-white"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}