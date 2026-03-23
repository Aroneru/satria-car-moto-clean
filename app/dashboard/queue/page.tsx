'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { QueueManagement } from '@/components/dashboard/QueueManagement';
export default function QueuePage() {
  return <ContentProvider><Dashboard><QueueManagement /></Dashboard></ContentProvider>;
}
