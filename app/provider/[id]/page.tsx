'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ProviderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [provider, setProvider] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchProvider = async () => {
            if (!params.id) return;

            try {
                const { data } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (data) {
                    setProvider(data);
                } else {
                    router.push('/marketplace');
                }
            } catch (error) {
                console.error('Error fetching provider:', error);
                router.push('/marketplace');
            } finally {
                setLoading(false);
            }
        };

        fetchProvider();
    }, [params.id, router]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <p className="text-gray-300">Loading provider details...</p>
                </div>
            </>
        );
    }

    if (!provider) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <p className="text-gray-300">Provider not found</p>
                </div>
            </>
        );
    }

    const isVenue = provider.role === 'venue';

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-900">
                {/* Back Button */}
                <div className="bg-slate-800/50 border-b border-slate-700 py-4 px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link href="/marketplace" className="text-blue-400 hover:text-blue-300 font-medium">
                            ← Back to Marketplace
                        </Link>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 py-8 border-b border-slate-700">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex gap-8 items-start">
                            {/* Logo/Image */}
                            <div className="w-48 h-48 rounded-xl overflow-hidden bg-slate-700 flex items-center justify-center flex-shrink-0">
                                {provider.logo_url ? (
                                    <img
                                        src={provider.logo_url}
                                        alt={provider.brand_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl">{isVenue ? '🏢' : '📋'}</span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 pt-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <h1 className="text-4xl font-bold text-white">{provider.brand_name}</h1>
                                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        {isVenue ? '🏢 Venue' : '📋 Event Planner'}
                                    </span>
                                </div>

                                <p className="text-gray-300 text-lg mb-4">
                                    📍 {provider.address}, {provider.city}, {provider.state}, {provider.country}
                                </p>

                                <div className="flex items-center gap-6 mb-6">
                                    <div>
                                        <p className="text-gray-400 text-sm">Rating</p>
                                        <p className="text-white font-bold text-xl">⭐ 4.8</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Reviews</p>
                                        <p className="text-white font-bold text-xl">24</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Services</p>
                                        <p className="text-white font-bold text-xl">{provider.pricing?.length || 0}</p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Link
                                        href={`/chat?provider=${provider.id}`}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                    >
                                        💬 Send Message
                                    </Link>
                                    <button className="px-6 py-3 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/20 transition font-medium">
                                        ⭐ Save to Favorites
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex gap-4 mb-8 border-b border-slate-700">
                        {['overview', 'services', 'gallery', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 font-medium transition border-b-2 capitalize ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-white'
                                        : 'border-transparent text-gray-400 hover:text-gray-300'
                                }`}
                            >
                                {tab === 'overview' && '📋 Overview'}
                                {tab === 'services' && '💼 Services & Pricing'}
                                {tab === 'gallery' && '🖼️ Gallery'}
                                {tab === 'reviews' && '⭐ Reviews'}
                            </button>
                        ))}
                    </div>

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-4">About</h2>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    {provider.brand_description || 'No description provided'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-4">📍 Location</h3>
                                    <div className="space-y-3 text-gray-300">
                                        <p><span className="text-gray-400">Address:</span> {provider.address}</p>
                                        <p><span className="text-gray-400">City:</span> {provider.city}</p>
                                        <p><span className="text-gray-400">State:</span> {provider.state}</p>
                                        <p><span className="text-gray-400">ZIP:</span> {provider.zip}</p>
                                        <p><span className="text-gray-400">Country:</span> {provider.country}</p>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
                                    <h3 className="text-xl font-bold text-white mb-4">📞 Contact</h3>
                                    <div className="space-y-3 text-gray-300">
                                        <p><span className="text-gray-400">Email:</span> {provider.email || 'Not provided'}</p>
                                        <p><span className="text-gray-400">Website:</span> {provider.website ? 
                                            <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                                                {provider.website}
                                            </a>
                                            : 'Not provided'}</p>
                                        <p><span className="text-gray-400">Joined:</span> {new Date(provider.created_at || Date.now()).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div>
                            {provider.pricing && provider.pricing.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {provider.pricing.map((service: any, idx: number) => {
                                        const currencySymbols: any = {
                                            USD: '$',
                                            EUR: '€',
                                            GBP: '£',
                                            NGN: '₦',
                                            GHS: '₵',
                                            ZAR: 'R',
                                            KES: 'KSh'
                                        };
                                        const symbol = currencySymbols[service.currency] || service.currency;
                                        return (
                                            <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                                <h3 className="text-xl font-bold text-white mb-2">{service.name}</h3>
                                                <p className="text-3xl font-bold text-blue-400 mb-4">
                                                    {symbol}{service.price}
                                                </p>
                                                <p className="text-gray-400 text-sm mb-4">Professional service included</p>
                                                <Link
                                                    href={`/chat?provider=${provider.id}&service=${service.name}`}
                                                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                                                >
                                                    Inquire About This Service
                                                </Link>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-gray-400">No services listed yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gallery Tab */}
                    {activeTab === 'gallery' && (
                        <div>
                            {provider.photos && provider.photos.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {provider.photos.map((photo: string, idx: number) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-700">
                                            <img
                                                src={photo}
                                                alt={`Gallery ${idx + 1}`}
                                                className="w-full h-full object-cover hover:scale-110 transition"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <p className="text-gray-400">No gallery images available</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4 max-w-2xl">
                            {[1, 2, 3].map((review) => (
                                <div key={review} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="text-white font-bold">Customer {review}</h4>
                                            <p className="text-gray-400 text-sm">⭐⭐⭐⭐⭐</p>
                                        </div>
                                        <p className="text-gray-400 text-sm">2 months ago</p>
                                    </div>
                                    <p className="text-gray-300">
                                        {review === 1 && "Amazing service! The team was professional and went above and beyond expectations."}
                                        {review === 2 && "Great quality work and excellent communication throughout the process."}
                                        {review === 3 && "Highly recommended! Will definitely work with them again for future events."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
