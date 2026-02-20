'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';
import {
    BuildingOffice2Icon,
    BriefcaseIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    CurrencyDollarIcon,
    EyeIcon,
    EyeSlashIcon,
    PaintBrushIcon,
    RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export default function VenueDashboard({ user }: { user: any }) {
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
                    <BuildingOffice2Icon className="h-8 w-8" />
                    Welcome, {profileData?.brand_name || 'Venue'}!
                </h1>
                <p className="text-gray-400">Manage your venue, services, and connect with event planners</p>
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

                {/* Services Listed */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Services Listed</p>
                            <p className="text-2xl font-bold text-white mt-1">{servicesCount}</p>
                        </div>
                        <BriefcaseIcon className="h-8 w-8 text-blue-300" />
                    </div>
                </div>

                {/* Market Status */}
                <div className={`${isPushed ? 'bg-green-900/20 border-green-700' : 'bg-slate-800/50 border-slate-700'} border rounded-xl p-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Market Status</p>
                            <p className={`text-2xl font-bold mt-1 ${isPushed ? 'text-green-400' : 'text-gray-300'}`}>
                                {isPushed ? 'Live' : 'Not Listed'}
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
                {/* Push to Market */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Push to Market</h3>
                            <p className="text-gray-400 text-sm mt-1">Make your venue visible to event planners</p>
                        </div>
                        <RocketLaunchIcon className="h-6 w-6 text-blue-300" />
                    </div>
                    <Link
                        href="/dashboard/push"
                        className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                        {isPushed ? 'Manage Listing' : 'Push Now'}
                    </Link>
                </div>

                {/* Customize Page */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-purple-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Customize Your Page</h3>
                            <p className="text-gray-400 text-sm mt-1">Make your profile stand out</p>
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

                {/* Messages */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Messages</h3>
                            <p className="text-gray-400 text-sm mt-1">Chat with event planners</p>
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

                {/* Services Management */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-white">Services & Pricing</h3>
                            <p className="text-gray-400 text-sm mt-1">Update your offerings</p>
                        </div>
                        <CurrencyDollarIcon className="h-6 w-6 text-amber-300" />
                    </div>
                    <Link
                        href="/dashboard/settings"
                        className="inline-block mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
                    >
                        Manage Services
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Profile Information</h3>
                <div className="space-y-3 text-gray-300 text-sm">
                    <p><span className="text-gray-400">Brand:</span> {profileData?.brand_name}</p>
                    <p><span className="text-gray-400">Location:</span> {profileData?.city}, {profileData?.country}</p>
                    <p><span className="text-gray-400">Description:</span> {profileData?.brand_description || 'No description added'}</p>
                    {profileData?.pricing && profileData.pricing.length > 0 && (
                        <div>
                            <p className="text-gray-400 mb-2">Services:</p>
                            <div className="flex flex-wrap gap-2">
                                {profileData.pricing.map((service: any, idx: number) => (
                                    <span key={idx} className="bg-slate-700 px-3 py-1 rounded-full text-xs">
                                        {service.name} ({service.currency})
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
