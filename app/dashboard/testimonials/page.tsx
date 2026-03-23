'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { TestimonialsManager } from '@/components/dashboard/TestimonialsManager';
export default function TestimonialsPage() {
  return <ContentProvider><Dashboard><TestimonialsManager /></Dashboard></ContentProvider>;
}
