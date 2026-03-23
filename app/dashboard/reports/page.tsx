'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Reports } from '@/components/dashboard/Reports';
export default function ReportsPage() {
  return <ContentProvider><Dashboard><Reports /></Dashboard></ContentProvider>;
}
