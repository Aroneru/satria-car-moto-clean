'use client';
import Link from 'next/link';
import { Briefcase, MessageSquare, Image, Users, Phone, TrendingUp, ClipboardList, Wallet, FileText, DollarSign } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export function DashboardHome() {
  const { services, testimonials, galleryImages, teamMembers, queueItems, transactions } = useContent();

  // POS Statistics
  const today = new Date().toISOString().split('T')[0];
  const todayQueues = queueItems.filter(
    (q) => q.createdAt.toISOString().split('T')[0] === today
  );
  const waitingQueues = queueItems.filter((q) => q.status === 'waiting');
  const completedToday = todayQueues.filter((q) => q.status === 'completed');
  
  const todayRevenue = transactions
    .filter((t) => {
      const tDate = new Date(t.date).toISOString().split('T')[0];
      return t.type === 'income' && tDate === today;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    { label: 'Services', value: services.length, icon: <Briefcase className="w-6 h-6" />, color: 'bg-blue-500', link: '/dashboard/services' },
    { label: 'Testimonials', value: testimonials.length, icon: <MessageSquare className="w-6 h-6" />, color: 'bg-green-500', link: '/dashboard/testimonials' },
    { label: 'Gallery Images', value: galleryImages.length, icon: <Image className="w-6 h-6" />, color: 'bg-purple-500', link: '/dashboard/gallery' },
    { label: 'Team Members', value: teamMembers.length, icon: <Users className="w-6 h-6" />, color: 'bg-orange-500', link: '/dashboard/team' },
  ];

  const posStats = [
    { label: 'Waiting Queue', value: waitingQueues.length, icon: <ClipboardList className="w-6 h-6" />, color: 'bg-yellow-500', link: '/dashboard/queue' },
    { label: 'Today\'s Orders', value: todayQueues.length, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-cyan-500', link: '/dashboard/queue' },
    { label: 'Completed Today', value: completedToday.length, icon: <Phone className="w-6 h-6" />, color: 'bg-green-500', link: '/dashboard/queue' },
    { label: 'Today\'s Revenue', value: `Rp ${(todayRevenue / 1000).toFixed(0)}K`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-emerald-500', link: '/dashboard/financial' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-xl font-bold text-[#1D1D1D] mb-4">Welcome to Dashboard</h3>
        <p className="text-gray-600">
          Manage your Satria Car & Moto Clean website content from this central panel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-3xl font-bold text-[#1D1D1D] mb-1">{stat.value}</h4>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* POS Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {posStats.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white`}>
                {stat.icon}
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <h4 className="text-3xl font-bold text-[#1D1D1D] mb-1">{stat.value}</h4>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-[#1D1D1D] mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/services"
            className="p-4 border-2 border-[#FCDE04] rounded-lg hover:bg-[#FCDE04] hover:text-[#1D1D1D] transition-colors text-center"
          >
            <Briefcase className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Manage Services</p>
          </Link>
          <Link
            href="/dashboard/gallery"
            className="p-4 border-2 border-[#6797BF] rounded-lg hover:bg-[#6797BF] hover:text-white transition-colors text-center"
          >
            <Image className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Update Gallery</p>
          </Link>
          <Link
            href="/dashboard/contact"
            className="p-4 border-2 border-green-500 rounded-lg hover:bg-green-500 hover:text-white transition-colors text-center"
          >
            <Phone className="w-8 h-8 mx-auto mb-2" />
            <p className="font-semibold">Edit Contact Info</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="mt-8 bg-gradient-to-r from-[#FCDE04] to-[#e8cd04] rounded-xl shadow-md p-6">
        <h3 className="text-lg font-bold text-[#1D1D1D] mb-2">💡 Tips</h3>
        <ul className="text-[#1D1D1D] space-y-2">
          <li>• Keep your services updated with current pricing</li>
          <li>• Add high-quality photos to the gallery regularly</li>
          <li>• Showcase customer testimonials to build trust</li>
          <li>• Update contact information if business hours change</li>
        </ul>
      </div>
    </div>
  );
}