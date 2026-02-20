'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';
import {
    BuildingOffice2Icon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    EyeIcon,
    EyeSlashIcon,
    PaintBrushIcon,
    RocketLaunchIcon,
    SparklesIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function EventPlannerDashboard({ user }: { user: any }) {
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isPushed, setIsPushed] = useState(false);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.uid) return;

            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('firebase_uid', user.uid)
                .single();

            if (data) {
                setProfileData(data);
                setIsPushed(data.is_pushed_to_market || false);
            }

            setLoading(false);
        };

        fetchProfileData();
    }, [user?.uid]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        );
    }

    const servicesCount = profileData?.pricing?.length || 0;

    return (
        <div className="flex-1 overflow-auto p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <UserCircleIcon className="h-8 w-8" />
                    Welcome, {profileData?.brand_name || 'Event Planner'}!
                </h1>
                <p className="text-gray-400">Plan your events, find venues, and connect with service providers</p>
            </div>

            {/* Status Bar */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Profile Completion */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Profile Status</p>
                            <p className="text-2xl font-bold text-white mt-1">85%</p>
                        </div>
                        <CheckCircleIcon className="h-8 w-8 text-green-400" />
                    </div>
                </div>

                {/* Active Events */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Active Events</p>
                            <p className="text-2xl font-bold text-white mt-1">0</p>
                        </div>
                        <SparklesIcon className="h-8 w-8 text-pink-300" />
                    </div>
                </div>

                {/* Visibility Status */}
                <div className={`${isPushed ? 'bg-green-900/20 border-green-700' : 'bg-slate-800/50 border-slate-700'} border rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Visibility</p>
                            <p className={`text-2xl font-bold mt-1 ${isPushed ? 'text-green-400' : 'text-gray-300'}`}>
                                {isPushed ? 'Visible' : 'Hidden'}
                            </p>
                        </div>
                        {isPushed ? (
                            <EyeIcon className="h-8 w-8 text-green-400" />
                        ) : (
                            <EyeSlashIcon className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-6">
                {/* Push Profile to Market */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Push Profile to Market</h3>
                            <p className="text-gray-400 text-sm mt-1">Let venues find you</p>
                        </div>
                        <RocketLaunchIcon className="h-6 w-6 text-blue-300" />
                    </div>
                    <Link
                        href="/dashboard/push"
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                        {isPushed ? 'Manage Profile' : 'Go Live'}
                    </Link>
                </div>

                {/* Customize Portfolio */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Customize Your Portfolio</h3>
                            <p className="text-gray-400 text-sm mt-1">Showcase your style</p>
                        </div>
                        <PaintBrushIcon className="h-6 w-6 text-purple-300" />
                    </div>
                    <Link
                        href="/dashboard/customize"
                        className="inline-block mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                    >
                        Customize
                    </Link>
                </div>

                {/* Messages & Connections */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Messages</h3>
                            <p className="text-gray-400 text-sm mt-1">Chat with venues</p>
                        </div>
                        <ChatBubbleLeftRightIcon className="h-6 w-6 text-cyan-300" />
                    </div>
                    <Link
                        href="/dashboard/messages"
                        className="inline-block mt-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition text-sm font-medium"
                    >
                        View Messages
                    </Link>
                </div>

                {/* Browse Venues */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Browse Venues</h3>
                            <p className="text-gray-400 text-sm mt-1">Find perfect venues</p>
                        </div>
                        <BuildingOffice2Icon className="h-6 w-6 text-green-300" />
                    </div>
                    <Link
                        href="/marketplace"
                        className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
                    >
                        Explore
                    </Link>
                </div>
            </div>

            {/* Profile Information */}
            <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Your Profile</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                    <p><span className="text-gray-400">Name:</span> {profileData?.brand_name}</p>
                    <p><span className="text-gray-400">Location:</span> {profileData?.city}, {profileData?.country}</p>
                    <p><span className="text-gray-400">About:</span> {profileData?.brand_description || 'No description added'}</p>
                    {profileData?.pricing && profileData.pricing.length > 0 && (
                        <div>
                            <p className="text-gray-400 mb-2">Specialties:</p>
                            <div className="flex flex-wrap gap-2">
                                {profileData.pricing.map((specialty: any, idx: number) => (
                                    <span key={idx} className="bg-slate-700 px-3 py-1 rounded-full text-xs">
                                        {specialty.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
