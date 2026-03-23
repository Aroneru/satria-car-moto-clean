'use client';
import { ContentProvider } from '@/context/ContentContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { GalleryManager } from '@/components/dashboard/GalleryManager';
export default function GalleryPage() {
  return <ContentProvider><Dashboard><GalleryManager /></Dashboard></ContentProvider>;
}
