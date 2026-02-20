'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/supabaseClient';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    BuildingOffice2Icon,
    EnvelopeIcon,
    MapPinIcon,
    PhoneIcon,
    StarIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

export default function VenueDetailPage() {
    const params = useParams();
    const venueId = params.id as string;
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [vendor, setVendor] = useState<any>(null);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                // Fetch venue
                const { data: venueData, error: venueError } = await supabase
                    .from('venues')
                    .select('*')
                    .eq('id', venueId)
                    .single();

                if (venueError || !venueData) {
                    console.error('Error fetching venue:', venueError);
                    setLoading(false);
                    return;
                }

                setVenue(venueData);

                // Fetch vendor info
                const { data: vendorData } = await supabase
                    .from('users')
                    .select('*')
                    .eq('firebase_uid', venueData.vendor_id)
                    .single();

                if (vendorData) {
                    setVendor(vendorData);
                }

                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setLoading(false);
            }
        };

        fetchVenue();
    }, [venueId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                    <p className="text-gray-300">Loading venue...</p>
                </div>
            </>
        );
    }

    if (!venue) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
                    <p className="text-gray-300 mb-4">Venue not found</p>
                    <Link href="/marketplace/venues" className="text-blue-400 hover:text-blue-300">
                        ← Back to Marketplace
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-900">
                {/* Back Button */}
                <div className="bg-slate-800/50 border-b border-slate-700 py-4 px-6 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto">
                        <Link href="/marketplace/venues" className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2">
                            <ArrowLeftIcon className="h-4 w-4" />
                            Back to Venues
                        </Link>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-12">
                    {/* Hero Image */}
                    <div className="rounded-2xl overflow-hidden mb-8 h-96">
                        {venue.image_url ? (
                            <img src={venue.image_url} alt={venue.venue_name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                                <BuildingOffice2Icon className="h-16 w-16 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Main Info */}
                        <div className="md:col-span-2">
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-2">{venue.venue_name}</h1>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <MapPinIcon className="h-5 w-5 text-blue-400" />
                                            <span>{venue.city}, {venue.country}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            <StarIcon className="h-5 w-5" />
                                            <span>{venue.rating || 4.8}</span>
                                            <span className="text-gray-400 text-sm">({venue.reviews_count || 0} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {venue.description && (
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-3">About This Venue</h2>
                                        <p className="text-gray-300 leading-relaxed">{venue.description}</p>
                                    </div>
                                )}

                                {/* Amenities */}
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-4">Key Details</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm mb-1">Capacity</p>
                                            <div className="flex items-center gap-2 text-2xl font-bold text-blue-400">
                                                <UsersIcon className="h-6 w-6" />
                                                {venue.capacity}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">guests maximum</p>
                                        </div>
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                            <p className="text-gray-400 text-sm mb-1">Price</p>
                                            <div className="text-2xl font-bold text-green-400">
                                                ${venue.price.toFixed(2)}
                                            </div>
                                            <p className="text-gray-500 text-xs mt-1">{venue.currency}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vendor Info */}
                                {vendor && (
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-4">About The Vendor</h2>
                                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                                            <div className="flex items-start gap-4">
                                                <BuildingOffice2Icon className="h-10 w-10 text-white" />
                                                <div>
                                                    <h3 className="text-white font-bold text-lg">{vendor.brand_name}</h3>
                                                    <p className="text-gray-400 text-sm">{vendor.city}, {vendor.country}</p>
                                                    {vendor.brand_description && (
                                                        <p className="text-gray-300 text-sm mt-2">{vendor.brand_description}</p>
                                                    )}
                                                    <div className="mt-4 flex gap-2">
                                                        <a
                                                            href={`tel:${vendor.phone || '+1234567890'}`}
                                                            className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                                                        >
                                                            <PhoneIcon className="h-4 w-4" />
                                                            Call
                                                        </a>
                                                        <span className="text-gray-600">•</span>
                                                        <a
                                                            href={`mailto:${vendor.email || ''}`}
                                                            className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                                                        >
                                                            <EnvelopeIcon className="h-4 w-4" />
                                                            Email
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Booking Card */}
                        <div className="md:col-span-1">
                            <div className="bg-gradient-to-b from-blue-600/20 to-blue-900/20 border border-blue-700 rounded-lg p-6 sticky top-24">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Starting from</p>
                                        <div className="text-3xl font-bold text-white">
                                            ${venue.price.toFixed(2)}
                                            <span className="text-sm text-gray-400 ml-1">{venue.currency}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-blue-700 pt-4">
                                        <p className="text-gray-300 text-sm mb-3 inline-flex items-center gap-2">
                                            <UsersIcon className="h-4 w-4 text-blue-300" />
                                            <strong>{venue.capacity}</strong> guests maximum
                                        </p>
                                        <p className="text-gray-300 text-sm">
                                            Located in <strong>{venue.city}</strong>
                                        </p>
                                    </div>

                                    <button className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-bold">
                                        Request Booking
                                    </button>

                                    <Link
                                        href={`/chat?venue=${venue.id}`}
                                        className="w-full py-3 px-4 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition font-medium text-center block"
                                    >
                                        Message Vendor
                                    </Link>

                                    <p className="text-gray-400 text-xs text-center">
                                        Respond typically within 24 hours
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
                        <div className="text-center py-12">
                            <p className="text-gray-400">No reviews yet. Be the first to review this venue!</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
