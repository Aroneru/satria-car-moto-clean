'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { ContactManager } from '@/components/dashboard/ContactManager';
export default function ContactPage() {
  return <ContentProvider><Dashboard><ContactManager /></Dashboard></ContentProvider>;
}
