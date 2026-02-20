'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ChatBubbleLeftRightIcon,
    ExclamationTriangleIcon,
    MinusCircleIcon,
    PaperAirplaneIcon,
    RocketLaunchIcon,
    StarIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

export default function PushToMarketPage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [isPushed, setIsPushed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('/signIn');
                return;
            }

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

        fetchData();
    }, [router]);

    const handleTogglePush = async () => {
        const user = auth.currentUser;
        if (!user || !profileData) return;

        setIsPublishing(true);

        await supabase
            .from('users')
            .update({
                is_pushed_to_market: !isPushed,
                pushed_at: new Date().toISOString()
            })
            .eq('firebase_uid', user.uid);

        setIsPushed(!isPushed);
        setIsPublishing(false);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        );
    }

    const canPush = profileData?.pricing && profileData.pricing.length > 0 && profileData?.brand_name;

    return (
        <div className="flex-1 overflow-auto p-8 bg-slate-900">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center gap-2">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <RocketLaunchIcon className="h-8 w-8" />
                    Push to Market
                </h1>
                <p className="text-gray-400">Make your profile visible to {profileData?.role === 'venue' ? 'event planners' : 'venues'}</p>
            </div>

            <div className="space-y-6">
                {/* Current Status */}
                <div className={`${isPushed ? 'bg-green-900/20 border-green-700' : 'bg-slate-800/50 border-slate-700'} border rounded-xl p-8`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">Current Status</h3>
                            <p className="text-gray-400">Profile is {isPushed ? 'currently live on the marketplace' : 'not visible to other users'}</p>
                        </div>
                        <div className={`text-6xl ${isPushed ? 'animate-bounce' : ''}`}>
                            {isPushed ? (
                                <CheckCircleIcon className="h-12 w-12 text-green-400" />
                            ) : (
                                <MinusCircleIcon className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Requirements Check */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Requirements</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.brand_name ? 'text-green-400' : 'text-gray-500'}>
                                {profileData?.brand_name ? (
                                    <CheckCircleIcon className="h-6 w-6" />
                                ) : (
                                    <MinusCircleIcon className="h-6 w-6" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium">Brand Name</p>
                                <p className="text-gray-400 text-sm">{profileData?.brand_name || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.logo_url ? 'text-green-400' : 'text-gray-500'}>
                                {profileData?.logo_url ? (
                                    <CheckCircleIcon className="h-6 w-6" />
                                ) : (
                                    <MinusCircleIcon className="h-6 w-6" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium">Logo/Cover Image</p>
                                <p className="text-gray-400 text-sm">{profileData?.logo_url ? 'Uploaded' : 'Not uploaded'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.pricing && profileData.pricing.length > 0 ? 'text-green-400' : 'text-gray-500'}>
                                {profileData?.pricing && profileData.pricing.length > 0 ? (
                                    <CheckCircleIcon className="h-6 w-6" />
                                ) : (
                                    <MinusCircleIcon className="h-6 w-6" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium">Services & Pricing ({profileData?.pricing?.length || 0})</p>
                                <p className="text-gray-400 text-sm">At least one service required</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.address ? 'text-green-400' : 'text-gray-500'}>
                                {profileData?.address ? (
                                    <CheckCircleIcon className="h-6 w-6" />
                                ) : (
                                    <MinusCircleIcon className="h-6 w-6" />
                                )}
                            </div>
                            <div>
                                <p className="text-white font-medium">Location</p>
                                <p className="text-gray-400 text-sm">{profileData?.address ? `${profileData.city}, ${profileData.country}` : 'Not provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing Options */}
                {canPush && (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Marketplace Visibility</h3>
                        <div className="space-y-4">
                            <div className="p-6 border border-blue-600/50 rounded-lg hover:bg-slate-700/50 transition cursor-pointer">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <input type="radio" checked={true} disabled />
                                            Free Visibility
                                        </h4>
                                        <p className="text-gray-400 text-sm mt-1">Appear in marketplace search</p>
                                    </div>
                                    <PaperAirplaneIcon className="h-5 w-5 text-blue-300" />
                                </div>
                            </div>

                            <div className="p-6 border border-gray-600 rounded-lg opacity-60">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-white font-bold flex items-center gap-2">
                                            <input type="radio" disabled />
                                            Featured Listing
                                        </h4>
                                        <p className="text-gray-400 text-sm mt-1">Appear at top of searches (Coming Soon)</p>
                                    </div>
                                    <StarIcon className="h-5 w-5 text-yellow-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Button */}
                {canPush ? (
                    <button
                        onClick={handleTogglePush}
                        disabled={isPublishing}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-white transition ${
                            isPushed
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isPublishing ? 'Processing...' : isPushed ? 'Remove from Marketplace' : 'Push to Marketplace'}
                    </button>
                ) : (
                    <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                        <h4 className="text-white font-bold mb-2 inline-flex items-center gap-2">
                            <ExclamationTriangleIcon className="h-5 w-5" />
                            Missing Requirements
                        </h4>
                        <p className="text-gray-300 mb-4">Complete your profile before pushing to marketplace:</p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-400 mb-4">
                            {!profileData?.brand_name && <li>Add a brand name</li>}
                            {!profileData?.logo_url && <li>Upload a logo or cover image</li>}
                            {!profileData?.pricing || profileData.pricing.length === 0 && (
                                <li>Add at least one service with pricing</li>
                            )}
                            {!profileData?.address && <li>Add your location</li>}
                        </ul>
                        <Link
                            href="/dashboard/settings"
                            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                        >
                            Complete Profile
                        </Link>
                    </div>
                )}

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <UsersIcon className="h-8 w-8 text-blue-300 mb-3" />
                        <h4 className="text-white font-bold mb-2">Reach Clients</h4>
                        <p className="text-gray-400 text-sm">Connect with event planners looking for your services</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-300 mb-3" />
                        <h4 className="text-white font-bold mb-2">Direct Messages</h4>
                        <p className="text-gray-400 text-sm">Communicate directly with interested clients</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <ChartBarIcon className="h-8 w-8 text-blue-300 mb-3" />
                        <h4 className="text-white font-bold mb-2">View Stats</h4>
                        <p className="text-gray-400 text-sm">Track how many people are viewing your profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
