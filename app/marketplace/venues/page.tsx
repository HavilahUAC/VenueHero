'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabaseClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
    ArrowPathIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    ChatBubbleLeftRightIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    RocketLaunchIcon,
    StarIcon,
    UsersIcon,
    WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';

export default function VenuesMarketplacePage() {
    const [venues, setVenues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterBy, setFilterBy] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
    const [showDebugPanel, setShowDebugPanel] = useState(false);
    const [debugData, setDebugData] = useState<any>(null);

    const fetchPublishedVenues = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all published venues
            const { data: allData, error: fetchError } = await supabase
                .from('venues')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false });

            if (fetchError) {
                console.error('Error fetching venues:', fetchError);
                setError('Failed to fetch venues');
                setVenues([]);
                setLoading(false);
                return;
            }

            console.log(`Published venues retrieved: ${allData?.length || 0} venues`);

            if (!allData || allData.length === 0) {
                console.warn('No published venues found');
                setVenues([]);
                setLastRefresh(new Date());
                setLoading(false);
                return;
            }

            // Log each venue
            allData.forEach((venue: any, idx: number) => {
                console.log(`[${idx + 1}] ${venue.venue_name} - Capacity: ${venue.capacity}, Price: ${venue.price} ${venue.currency}`);
            });

            setVenues(allData);
            setLastRefresh(new Date());
        } catch (err) {
            console.error('Error in fetchPublishedVenues:', err);
            setError('An error occurred while loading venues');
            setVenues([]);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchPublishedVenues();
    }, []);

    // Auto-refresh every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchPublishedVenues();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Debug function
    const handleDebugClick = async () => {
        try {
            const { data, error } = await supabase
                .from('venues')
                .select('id, venue_name, capacity, price, is_published');

            if (error) {
                setDebugData({ error: error.message });
            } else {
                setDebugData({
                    timestamp: new Date().toLocaleString(),
                    totalVenues: data?.length || 0,
                    venuesData: data || []
                });
            }
        } catch (err) {
            setDebugData({ error: String(err) });
        }
    };

    // Filter venues
    const filteredVenues = venues.filter(venue => {
        const matchesSearch = venue.venue_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             venue.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             venue.country?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-900">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-4xl font-bold text-white inline-flex items-center gap-3">
                                <BuildingOffice2Icon className="h-9 w-9" />
                                Venue Marketplace
                            </h1>
                            <button
                                onClick={fetchPublishedVenues}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium inline-flex items-center gap-2"
                            >
                                <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-gray-300">Find and book amazing venues for your events</p>
                            <p className="text-gray-400 text-xs">Last updated: {lastRefresh.toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="mb-8">
                        <input
                            type="text"
                            placeholder="Search by venue name or location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        />
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <ArrowPathIcon className="h-10 w-10 text-blue-300 mb-3 mx-auto animate-spin" />
                                <p className="text-gray-300">Loading venues...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-900/20 border border-red-700 rounded-lg p-8 text-center">
                            <p className="text-red-200 mb-4">{error}</p>
                            <button
                                onClick={fetchPublishedVenues}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition inline-flex items-center gap-2"
                            >
                                <ArrowPathIcon className="h-4 w-4" />
                                Try Again
                            </button>
                        </div>
                    ) : filteredVenues.length === 0 ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <MagnifyingGlassIcon className="h-10 w-10 text-blue-300 mb-3 mx-auto" />
                                <p className="text-gray-300">No venues found</p>
                                {venues.length > 0 && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* Venues Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredVenues.map((venue) => (
                                <div
                                    key={venue.id}
                                    className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition group"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
                                        {venue.image_url ? (
                                            <img
                                                src={venue.image_url}
                                                alt={venue.venue_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BuildingOffice2Icon className="h-12 w-12 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{venue.venue_name}</h3>
                                            <p className="text-gray-400 text-sm inline-flex items-center gap-1">
                                                <MapPinIcon className="h-4 w-4" />
                                                {venue.city}, {venue.country}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        {venue.description && (
                                            <p className="text-gray-300 text-sm line-clamp-2">{venue.description}</p>
                                        )}

                                        {/* Capacity & Price */}
                                        <div className="flex gap-4 pt-2 border-t border-slate-700">
                                            <div className="flex items-center gap-2 text-blue-400 text-sm">
                                                <UsersIcon className="h-4 w-4" />
                                                <span>{venue.capacity} guests</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                                                <span>${venue.price.toFixed(2)}</span>
                                                <span className="text-gray-400 text-xs">{venue.currency}</span>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                                            <span className="text-yellow-400 inline-flex items-center gap-1">
                                                <StarIcon className="h-4 w-4" />
                                                {venue.rating || 4.8}
                                            </span>
                                            <span className="text-gray-400 text-xs">({venue.reviews_count || 0} reviews)</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <Link
                                                href={`/venue/${venue.id}`}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium text-center"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                href={`/chat?venue=${venue.id}`}
                                                className="flex-1 px-4 py-2 border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-600/20 transition text-sm font-medium text-center inline-flex items-center justify-center gap-2"
                                            >
                                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                                Inquire
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && venues.length === 0 && (
                        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-8 text-center">
                            <h3 className="text-white font-bold text-lg mb-2 inline-flex items-center gap-2">
                                <RocketLaunchIcon className="h-5 w-5" />
                                Venues Coming Soon
                            </h3>
                            <p className="text-blue-200">Be the first to list your venues and reach event planners.</p>
                        </div>
                    )}

                    {/* Debug Panel */}
                    <div className="border-t border-slate-700 mt-8 pt-8">
                        <button
                            onClick={() => {
                                setShowDebugPanel(!showDebugPanel);
                                if (!debugData) handleDebugClick();
                            }}
                            className="px-4 py-2 text-xs bg-slate-700 text-gray-300 rounded hover:bg-slate-600 transition inline-flex items-center gap-2"
                        >
                            <WrenchScrewdriverIcon className="h-4 w-4" />
                            {showDebugPanel ? 'Hide Debug Info' : 'Show Debug Info'}
                        </button>

                        {showDebugPanel && debugData && (
                            <div className="mt-4 p-4 bg-slate-800 rounded border border-slate-700">
                                {debugData.error ? (
                                    <p className="text-red-400">Error: {debugData.error}</p>
                                ) : (
                                    <>
                                        <p className="text-gray-300 text-xs mb-3 inline-flex items-center gap-2">
                                            <CalendarDaysIcon className="h-4 w-4" />
                                            {debugData.timestamp} | <BuildingOffice2Icon className="h-4 w-4" /> Total venues: {debugData.totalVenues}
                                        </p>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs text-gray-300">
                                                <thead className="border-b border-slate-600">
                                                    <tr>
                                                        <th className="text-left px-2 py-2">Venue Name</th>
                                                        <th className="text-left px-2 py-2">Capacity</th>
                                                        <th className="text-left px-2 py-2">Price</th>
                                                        <th className="text-left px-2 py-2">Published</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {debugData.venuesData.map((venue: any, idx: number) => (
                                                        <tr key={idx} className={`border-b border-slate-700 ${venue.is_published ? 'bg-green-900/20' : ''}`}>
                                                            <td className="px-2 py-2">{venue.venue_name}</td>
                                                            <td className="px-2 py-2">{venue.capacity}</td>
                                                            <td className="px-2 py-2">${venue.price}</td>
                                                            <td className="px-2 py-2">
                                                                <span className={venue.is_published ? 'text-green-400' : 'text-gray-500'}>
                                                                    {String(venue.is_published)}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
