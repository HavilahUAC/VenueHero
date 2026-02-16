'use client';

import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';

const Home = () => {
    const [featuredProviders, setFeaturedProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProviders = async () => {
            try {
                // Fetch all users
                const { data: allData } = await supabase
                    .from('users')
                    .select('*');

                if (allData) {
                    // Filter for pushed providers - handle both boolean and string values
                    const pushedProviders = allData.filter((user: any) => 
                        user.is_pushed_to_market === true || user.is_pushed_to_market === 'true'
                    ).slice(0, 6);

                    setFeaturedProviders(pushedProviders);
                }
            } catch (error) {
                console.error('Error fetching providers:', error);
            } finally {
                setLoading(false);
            }
        };

        // Initial fetch
        fetchFeaturedProviders();

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => {
            fetchFeaturedProviders();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-900">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-600 via-slate-800 to-slate-900 py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">Find Your Perfect Venue & Event Planner</h1>
                    <p className="text-xl text-gray-200 mb-8">Discover amazing venues and professional event planners for your perfect event</p>
                    <Link
                        href="/marketplace"
                        className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold hover:bg-gray-100 transition text-lg"
                    >
                        🏪 Explore Marketplace
                    </Link>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-800/50 border-y border-slate-700 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-bold text-blue-400">{featuredProviders.filter(p => p.role === 'venue').length}</p>
                            <p className="text-gray-300 mt-2">🏢 Venues</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-400">{featuredProviders.filter(p => p.role === 'event_planner').length}</p>
                            <p className="text-gray-300 mt-2">📋 Event Planners</p>
                        </div>
                        <div>
                            <p className="text-4xl font-bold text-blue-400">{featuredProviders.length}</p>
                            <p className="text-gray-300 mt-2">🌟 Total Listings</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Providers Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-3">Featured Listings ✨</h2>
                    <p className="text-gray-400">Check out our best venues and event planners</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-300">Loading featured listings...</p>
                    </div>
                ) : featuredProviders.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
                        <p className="text-gray-300 text-lg mb-4">No listings available yet</p>
                        <p className="text-gray-400">Be the first to push your service to the marketplace!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredProviders.map((provider) => (
                            <div
                                key={provider.id}
                                className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition group"
                            >
                                {/* Provider Image */}
                                <div className="relative h-40 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                                    {provider.logo_url ? (
                                        <img
                                            src={provider.logo_url}
                                            alt={provider.brand_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-5xl">
                                                {provider.role === 'venue' ? '🏢' : '📋'}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                        {provider.role === 'venue' ? '🏢 Venue' : '📋 Planner'}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">{provider.brand_name}</h3>
                                        <p className="text-gray-400 text-sm flex items-center gap-1">
                                            📍 {provider.city}, {provider.country}
                                        </p>
                                    </div>

                                    {provider.brand_description && (
                                        <p className="text-gray-300 text-sm line-clamp-2">
                                            {provider.brand_description}
                                        </p>
                                    )}

                                    {provider.pricing && provider.pricing.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {provider.pricing.slice(0, 2).map((service: any, idx: number) => (
                                                <span key={idx} className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs">
                                                    {service.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <Link
                                        href={`/provider/${provider.id}`}
                                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium mt-3"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA to Marketplace */}
                {featuredProviders.length > 0 && (
                    <div className="text-center mt-12">
                        <Link
                            href="/marketplace"
                            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            View All Listings →
                        </Link>
                    </div>
                )}
            </div>

            {/* How It Works Section */}
            <div className="bg-slate-800/50 border-y border-slate-700 py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works 🚀</h2>
                    <div className="grid grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold text-white mb-2">Browse</h3>
                            <p className="text-gray-400">Explore venues and event planners in our marketplace</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">💬</div>
                            <h3 className="text-xl font-bold text-white mb-2">Connect</h3>
                            <p className="text-gray-400">Message providers directly to discuss your event</p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-bold text-white mb-2">Book</h3>
                            <p className="text-gray-400">Finalize bookings and plan your perfect event</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="max-w-7xl mx-auto px-6 py-16 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Ready to find your perfect venue?</h2>
                <Link
                    href="/marketplace"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                    Start Exploring
                </Link>
            </div>
        </div>
    );
};

export default Home;