'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ServicesManager } from '@/components/dashboard/ServicesManager';
export default function ServicesPage() {
  return <ContentProvider><Dashboard><ServicesManager /></Dashboard></ContentProvider>;
}
