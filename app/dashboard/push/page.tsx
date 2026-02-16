'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-block">
                    ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2">Push to Market 🚀</h1>
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
                            {isPushed ? '✅' : '⚫'}
                        </div>
                    </div>
                </div>

                {/* Requirements Check */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Requirements</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.brand_name ? 'text-green-400 text-2xl' : 'text-gray-500 text-2xl'}>
                                {profileData?.brand_name ? '✅' : '⭕'}
                            </div>
                            <div>
                                <p className="text-white font-medium">Brand Name</p>
                                <p className="text-gray-400 text-sm">{profileData?.brand_name || 'Not provided'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.logo_url ? 'text-green-400 text-2xl' : 'text-gray-500 text-2xl'}>
                                {profileData?.logo_url ? '✅' : '⭕'}
                            </div>
                            <div>
                                <p className="text-white font-medium">Logo/Cover Image</p>
                                <p className="text-gray-400 text-sm">{profileData?.logo_url ? 'Uploaded' : 'Not uploaded'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.pricing && profileData.pricing.length > 0 ? 'text-green-400 text-2xl' : 'text-gray-500 text-2xl'}>
                                {profileData?.pricing && profileData.pricing.length > 0 ? '✅' : '⭕'}
                            </div>
                            <div>
                                <p className="text-white font-medium">Services & Pricing ({profileData?.pricing?.length || 0})</p>
                                <p className="text-gray-400 text-sm">At least one service required</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-lg">
                            <div className={profileData?.address ? 'text-green-400 text-2xl' : 'text-gray-500 text-2xl'}>
                                {profileData?.address ? '✅' : '⭕'}
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
                                    <span className="text-xl">🎯</span>
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
                                    <span className="text-xl">⭐</span>
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
                        {isPublishing ? 'Processing...' : isPushed ? '❌ Remove from Marketplace' : '🚀 Push to Marketplace'}
                    </button>
                ) : (
                    <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                        <h4 className="text-white font-bold mb-2">⚠️ Missing Requirements</h4>
                        <p className="text-gray-300 mb-4">Complete your profile before pushing to marketplace:</p>
                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                            {!profileData?.brand_name && <p>• Add a brand name</p>}
                            {!profileData?.logo_url && <p>• Upload a logo or cover image</p>}
                            {!profileData?.pricing || profileData.pricing.length === 0 && (
                                <p>• Add at least one service with pricing</p>
                            )}
                            {!profileData?.address && <p>• Add your location</p>}
                        </div>
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
                        <div className="text-3xl mb-3">👥</div>
                        <h4 className="text-white font-bold mb-2">Reach Clients</h4>
                        <p className="text-gray-400 text-sm">Connect with event planners looking for your services</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <div className="text-3xl mb-3">💬</div>
                        <h4 className="text-white font-bold mb-2">Direct Messages</h4>
                        <p className="text-gray-400 text-sm">Communicate directly with interested clients</p>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <div className="text-3xl mb-3">📊</div>
                        <h4 className="text-white font-bold mb-2">View Stats</h4>
                        <p className="text-gray-400 text-sm">Track how many people are viewing your profile</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
