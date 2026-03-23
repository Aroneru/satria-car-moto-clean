'use client';

import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DashboardHome } from '@/components/dashboard/DashboardHome';

export default function DashboardPage() {
  return (
    <ContentProvider>
      <Dashboard>
        <DashboardHome />
      </Dashboard>
    </ContentProvider>
  );
}
