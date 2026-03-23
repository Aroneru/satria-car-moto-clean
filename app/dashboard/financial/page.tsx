'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { FinancialManagement } from '@/components/dashboard/FinancialManagement';
export default function FinancialPage() {
  return <ContentProvider><Dashboard><FinancialManagement /></Dashboard></ContentProvider>;
}
