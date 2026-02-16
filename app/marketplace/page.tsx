'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function MarketplacePage() {
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterBy, setFilterBy] = useState('all'); // all, venue, event_planner
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [debugData, setDebugData] = useState<any>(null);

    const fetchPushedProviders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Fetch all users
            const { data: allData, error: allError } = await supabase
                .from('users')
                .select('*');

            if (allError) {
                console.error('❌ Error fetching all users:', allError);
                setError('Failed to fetch providers');
                setLoading(false);
                return;
            }

            console.log(`📊 All users retrieved: ${allData?.length} total users in database`);

            if (!allData || allData.length === 0) {
                console.warn('⚠️ No users found in database at all');
                setProviders([]);
                setError('No providers available yet');
                setLoading(false);
                return;
            }

            // Log each user's pushed status
            allData.forEach((user: any, idx: number) => {
                console.log(`[${idx + 1}] ${user.brand_name || 'Unnamed'} - is_pushed_to_market: ${user.is_pushed_to_market} (type: ${typeof user.is_pushed_to_market})`);
            });

            // Filter for pushed providers - handle both boolean and string values
            const pushedProviders = allData.filter((user: any) => {
                // Check if is_pushed_to_market is true (handles both boolean true and string 'true')
                const isPushed = user.is_pushed_to_market === true || user.is_pushed_to_market === 'true';
                if (isPushed) {
                    console.log(`✅ Including in marketplace: ${user.brand_name} (is_pushed_to_market: ${user.is_pushed_to_market})`);
                }
                return isPushed;
            });

            console.log(`🎯 Filtered Result: ${pushedProviders.length} pushed providers out of ${allData.length} total users`);
            if (pushedProviders.length > 0) {
                pushedProviders.forEach(p => console.log(`  ✓ ${p.brand_name} (${p.role})`));
            } else {
                console.warn('⚠️ No providers have is_pushed_to_market = true');
            }
            
            setProviders(pushedProviders);
            setLastRefresh(new Date());
        } catch (error) {
            console.error('❌ Error fetching providers:', error);
            setError('Failed to fetch providers');
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPushedProviders();
    }, []);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchPushedProviders();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Debug function to fetch and display raw data
    const handleDebugClick = async () => {
        try {
            const { data, error } = await supabase.from('users').select('id, brand_name, role, is_pushed_to_market, pushed_at');
            if (error) {
                setDebugData({ error: error.message });
            } else {
                setDebugData({
                    timestamp: new Date().toLocaleString(),
                    totalUsers: data?.length || 0,
                    usersData: data || []
                });
            }
        } catch (err) {
            setDebugData({ error: String(err) });
        }
    };

    // Filter providers
    const filteredProviders = providers.filter(provider => {
        const matchesRole = filterBy === 'all' || provider.role === filterBy;
        const matchesSearch = provider.brand_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             provider.city?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRole && matchesSearch;
    });

    const venueCount = providers.filter(p => p.role === 'venue').length;
    const eventPlannerCount = providers.filter(p => p.role === 'event_planner').length;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-4xl font-bold text-white">Marketplace 🏪</h1>
                            <button
                                onClick={fetchPushedProviders}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium flex items-center gap-2"
                            >
                                🔄 {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-300">Discover amazing venues and event planners</p>
                            <p className="text-gray-400 text-xs">Last updated: {lastRefresh.toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col gap-6 mb-8">
                        {/* Search Bar */}
                        <div>
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setFilterBy('all')}
                                className={`px-6 py-3 rounded-lg font-medium transition ${
                                    filterBy === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                }`}
                            >
                                All ({providers.length})
                            </button>
                            <button
                                onClick={() => setFilterBy('venue')}
                                className={`px-6 py-3 rounded-lg font-medium transition ${
                                    filterBy === 'venue'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                }`}
                            >
                                🏢 Venues ({venueCount})
                            </button>
                            <button
                                onClick={() => setFilterBy('event_planner')}
                                className={`px-6 py-3 rounded-lg font-medium transition ${
                                    filterBy === 'event_planner'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                                }`}
                            >
                                📋 Event Planners ({eventPlannerCount})
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="text-4xl mb-3">⏳</div>
                                <p className="text-gray-300">Loading marketplace...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-8 text-center">
                            <p className="text-red-200 mb-4">❌ {error}</p>
                            <button
                                onClick={fetchPushedProviders}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                🔄 Try Again
                            </button>
                        </div>
                    ) : filteredProviders.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🔍</div>
                                <p className="text-gray-300">No providers found matching your search</p>
                                {providers.length > 0 && (
                                    <button
                                        onClick={() => {
                                            setFilterBy('all');
                                            setSearchQuery('');
                                        }}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        Clear filters
                                    </button>
                                )}
                                {providers.length === 0 && (
                                    <button
                                        onClick={fetchPushedProviders}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        🔄 Refresh
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Providers Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProviders.map((provider) => (
                                <div
                                    key={provider.id}
                                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition group"
                                >
                                    {/* Provider Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
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
                                        {/* Role Badge */}
                                        <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                            {provider.role === 'venue' ? '🏢 Venue' : '📋 Event Planner'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{provider.brand_name}</h3>
                                            <p className="text-gray-400 text-sm flex items-center gap-1">
                                                📍 {provider.city}, {provider.country}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        {provider.brand_description && (
                                            <p className="text-gray-300 text-sm line-clamp-2">
                                                {provider.brand_description}
                                            </p>
                                        )}

                                        {/* Services */}
                                        {provider.pricing && provider.pricing.length > 0 && (
                                            <div className="pt-2 border-t border-slate-700">
                                                <p className="text-gray-400 text-xs mb-2">Services</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {provider.pricing.slice(0, 3).map((service: any, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs"
                                                        >
                                                            {service.name}
                                                        </span>
                                                    ))}
                                                    {provider.pricing.length > 3 && (
                                                        <span className="bg-slate-700 text-gray-200 px-2 py-1 rounded text-xs">
                                                            +{provider.pricing.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Rating/Stats */}
                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                                            <span className="text-yellow-400">⭐ 4.8</span>
                                            <span className="text-gray-400 text-xs">(24 reviews)</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <Link
                                                href={`/provider/${provider.id}`}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium text-center"
                                            >
                                                View Profile
                                            </Link>
                                            <Link
                                                href={`/chat?provider=${provider.id}`}
                                                className="flex-1 px-4 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/20 transition text-sm font-medium text-center"
                                            >
                                                Message
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Empty State Info */}
                {!loading && providers.length === 0 && (
                    <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-8 max-w-2xl mx-auto mt-8 text-center">
                        <h3 className="text-white font-bold text-lg mb-2">🎯 Marketplace Coming Soon!</h3>
                        <p className="text-blue-200 mb-4">Be the first vendors to list your services and reach event planners.</p>
                        <Link
                            href="/dashboard/settings"
                            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            Start Listing Your Services
                        </Link>
                    </div>
                )}

                {/* Debug Panel */}
                <div className="max-w-7xl mx-auto px-6 py-8 border-t border-slate-700 mt-8">
                    <button
                        onClick={() => {
                            setShowDebugPanel(!showDebugPanel);
                            if (!debugData) handleDebugClick();
                        }}
                        className="px-4 py-2 text-xs bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition"
                    >
                        {showDebugPanel ? '🔽 Hide Debug Info' : '🔎 Show Debug Info'}
                    </button>

                    {showDebugPanel && debugData && (
                        <div className="mt-4 p-4 bg-slate-800 rounded border border-slate-700">
                            {debugData.error ? (
                                <p className="text-red-400">Error: {debugData.error}</p>
                            ) : (
                                <>
                                    <p className="text-gray-300 text-xs mb-3">
                                        📅 {debugData.timestamp} | 👥 Total users: {debugData.totalUsers}
                                    </p>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-gray-300">
                                            <thead className="border-b border-slate-600">
                                                <tr>
                                                    <th className="text-left px-2 py-2">Brand Name</th>
                                                    <th className="text-left px-2 py-2">Role</th>
                                                    <th className="text-left px-2 py-2">Pushed</th>
                                                    <th className="text-left px-2 py-2">Pushed At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {debugData.usersData.map((user: any, idx: number) => (
                                                    <tr key={idx} className={`border-b border-slate-700 ${user.is_pushed_to_market ? 'bg-green-900/20' : ''}`}>
                                                        <td className="px-2 py-2">{user.brand_name}</td>
                                                        <td className="px-2 py-2">{user.role}</td>
                                                        <td className="px-2 py-2">
                                                            <span className={user.is_pushed_to_market ? 'text-green-400' : 'text-gray-500'}>
                                                                {String(user.is_pushed_to_market)}
                                                            </span>
                                                        </td>
                                                        <td className="px-2 py-2 text-gray-500">{user.pushed_at ? new Date(user.pushed_at).toLocaleDateString() : 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <button
                                        onClick={handleDebugClick}
                                        className="mt-3 px-3 py-1 text-xs bg-slate-600 text-gray-200 rounded hover:bg-slate-500 transition"
                                    >
                                        🔄 Refresh Debug Data
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
