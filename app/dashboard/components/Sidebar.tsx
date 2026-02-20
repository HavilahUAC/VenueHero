'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import Link from 'next/link';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'next/navigation';
import {
    ArrowLeftOnRectangleIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
    MegaphoneIcon,
    PencilSquareIcon,
} from '@heroicons/react/24/outline';

type MenuItem = {
    icon: ComponentType<SVGProps<SVGSVGElement>>;
    label: string;
    href: string;
};

export default function Sidebar({ role }: { role: string | null }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/');
    };

    const venueMenuItems: MenuItem[] = [
        { icon: ChartBarIcon, label: 'Overview', href: '/dashboard' },
        { icon: MegaphoneIcon, label: 'Manage Venues', href: '/dashboard/venues' },
        { icon: PencilSquareIcon, label: 'Customize Page', href: '/dashboard/customize' },
        { icon: ChatBubbleLeftRightIcon, label: 'Messages', href: '/dashboard/messages' },
        { icon: Cog6ToothIcon, label: 'Settings', href: '/dashboard/settings' },
    ];

    const eventPlannerMenuItems: MenuItem[] = [
        { icon: ChartBarIcon, label: 'Overview', href: '/dashboard' },
        { icon: MegaphoneIcon, label: 'Push to Market', href: '/dashboard/push' },
        { icon: PencilSquareIcon, label: 'Customize Page', href: '/dashboard/customize' },
        { icon: ChatBubbleLeftRightIcon, label: 'Messages', href: '/dashboard/messages' },
        { icon: Cog6ToothIcon, label: 'Settings', href: '/dashboard/settings' },
    ];

    const menuItems = role === 'venue' ? venueMenuItems : eventPlannerMenuItems;

    return (
        <div className={`${isOpen ? 'w-64' : 'w-20'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300`}>
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-between border-b border-slate-700">
                {isOpen && <h1 className="text-xl font-bold text-white">Venue Hero</h1>}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-400 hover:text-white transition"
                >
                    {isOpen ? (
                        <ChevronLeftIcon className="h-5 w-5" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition group"
                        >
                            <Icon className="h-5 w-5 text-gray-300 group-hover:text-white" />
                            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                            {!isOpen && (
                                <div className="absolute left-20 bg-slate-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile & Logout */}
            <div className="p-4 border-t border-slate-700 space-y-2">
                {isOpen && (
                    <div className="text-xs text-gray-400 mb-3">
                        <p className="truncate text-white font-medium">{auth.currentUser?.email || 'User'}</p>
                        <p className="capitalize text-gray-500">{role}</p>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition text-sm"
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
}
