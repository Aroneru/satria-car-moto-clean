'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TeamManager } from '@/components/dashboard/TeamManager';
export default function TeamPage() {
  return <ContentProvider><Dashboard><TeamManager /></Dashboard></ContentProvider>;
}
