'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeftIcon,
    ArrowPathIcon,
    BuildingOffice2Icon,
    PlusIcon,
    TrashIcon,
    EyeIcon,
    EyeSlashIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    MapPinIcon,
    UsersIcon,
} from '@heroicons/react/24/outline';

interface Venue {
    id: string;
    venue_name: string;
    description: string;
    capacity: number;
    price: number;
    currency: string;
    image_url: string;
    city: string;
    country: string;
    is_published: boolean;
}

export default function VenuesPage() {
    const router = useRouter();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        venue_name: '',
        description: '',
        capacity: '',
        price: '',
        currency: 'USD',
        city: '',
        country: '',
        image_file: null as File | null
    });

    const currencies = [
        { code: 'USD', symbol: '$' },
        { code: 'EUR', symbol: 'EUR' },
        { code: 'GBP', symbol: 'GBP' },
        { code: 'NGN', symbol: 'NGN' },
        { code: 'GHS', symbol: 'GHS' },
        { code: 'ZAR', symbol: 'R' },
        { code: 'KES', symbol: 'KSh' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const user = auth.currentUser;
            if (!user) {
                router.push('/signIn');
                return;
            }

            setCurrentUser(user);

            // Fetch venues created by this vendor
            const { data, error } = await supabase
                .from('venues')
                .select('*')
                .eq('vendor_id', user.uid)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching venues:', error);
            } else {
                setVenues(data || []);
            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image_file: e.target.files[0] });
        }
    };

    const handleCreateVenue = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.venue_name || !formData.capacity || !formData.price) {
            alert('Please fill in all required fields');
            return;
        }

        if (!formData.image_file) {
            alert('Please upload a venue image');
            return;
        }

        if (!currentUser) return;

        setSaving(true);

        try {
            // Upload image to Supabase Storage
            const fileName = `${currentUser.uid}-${Date.now()}-${formData.image_file.name}`;
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('venues')
                .upload(`${currentUser.uid}/${fileName}`, formData.image_file);

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                alert('Failed to upload image');
                setSaving(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('venues')
                .getPublicUrl(`${currentUser.uid}/${fileName}`);

            // Create venue record
            const { error: insertError, data: newVenue } = await supabase
                .from('venues')
                .insert({
                    vendor_id: currentUser.uid,
                    vendor_name: currentUser.email,
                    venue_name: formData.venue_name,
                    description: formData.description,
                    capacity: parseInt(formData.capacity),
                    price: parseFloat(formData.price),
                    currency: formData.currency,
                    city: formData.city,
                    country: formData.country,
                    image_url: publicUrl,
                    is_published: false
                })
                .select('*');

            if (insertError) {
                console.error('Error creating venue:', insertError);
                alert('Failed to create venue');
                setSaving(false);
                return;
            }

            // Add to list
            if (newVenue && newVenue[0]) {
                setVenues([newVenue[0], ...venues]);
            }

            // Reset form
            setFormData({
                venue_name: '',
                description: '',
                capacity: '',
                price: '',
                currency: 'USD',
                city: '',
                country: '',
                image_file: null
            });
            setShowForm(false);
            alert('Venue created successfully!');

            console.log('Venue created:', newVenue);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to create venue');
        } finally {
            setSaving(false);
        }
    };

    const handlePublishVenue = async (venueId: string, isPublished: boolean) => {
        try {
            const { error } = await supabase
                .from('venues')
                .update({ is_published: !isPublished })
                .eq('id', venueId);

            if (error) {
                console.error('Error updating venue:', error);
                alert('Failed to update venue');
                return;
            }

            // Update local state
            setVenues(venues.map(v =>
                v.id === venueId ? { ...v, is_published: !isPublished } : v
            ));

            alert(isPublished ? 'Venue unpublished' : 'Venue published to marketplace!');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteVenue = async (venueId: string) => {
        if (!confirm('Are you sure you want to delete this venue?')) return;

        try {
            const { error } = await supabase
                .from('venues')
                .delete()
                .eq('id', venueId);

            if (error) {
                console.error('Error deleting venue:', error);
                alert('Failed to delete venue');
                return;
            }

            setVenues(venues.filter(v => v.id !== venueId));
            alert('Venue deleted');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300">Loading venues...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto p-8 bg-slate-900">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center gap-2">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Manage Venues</h1>
                        <p className="text-gray-400">Create and publish venues to the marketplace</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium inline-flex items-center gap-2"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Create Venue
                    </button>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Create New Venue</h2>

                    <form onSubmit={handleCreateVenue} className="space-y-6">
                        {/* Venue Name */}
                        <div>
                            <label className="block text-gray-300 font-medium mb-2">Venue Name *</label>
                            <input
                                type="text"
                                value={formData.venue_name}
                                onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                                placeholder="e.g., Grand Ballroom, Waterfront Garden"
                                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-gray-300 font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe your venue..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />
                        </div>

                        {/* Location */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">City *</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="City"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Country *</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    placeholder="Country"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>
                        </div>

                        {/* Capacity & Pricing */}
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Capacity *</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                    placeholder="e.g., 500"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Price *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                >
                                    {currencies.map(c => (
                                        <option key={c.code} value={c.code}>{c.code}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-gray-300 font-medium mb-2">Venue Image *</label>
                            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                />
                                {formData.image_file && (
                                    <p className="text-green-400 text-sm mt-2 inline-flex items-center gap-2">
                                        <CheckCircleIcon className="h-4 w-4" />
                                        {formData.image_file.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium inline-flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="h-5 w-5" />
                                        Create Venue
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="flex-1 px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Venues List */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Your Venues ({venues.length})</h2>

                {venues.length === 0 ? (
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 text-center">
                        <p className="text-gray-400 mb-4">No venues created yet</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Create Your First Venue
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {venues.map(venue => (
                            <div key={venue.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition">
                                {/* Image */}
                                <div className="relative h-40 bg-slate-700 overflow-hidden">
                                    {venue.image_url ? (
                                        <img src={venue.image_url} alt={venue.venue_name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <BuildingOffice2Icon className="h-10 w-10 text-white" />
                                        </div>
                                    )}
                                    {/* Published Badge */}
                                    <div className="absolute top-3 right-3">
                                        {venue.is_published ? (
                                            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <CheckCircleIcon className="h-4 w-4" />
                                                Live
                                            </div>
                                        ) : (
                                            <div className="bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1">
                                                <ExclamationTriangleIcon className="h-4 w-4" />
                                                Draft
                                            </div>
                                        )}
                                    </div>
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

                                    {venue.description && (
                                        <p className="text-gray-300 text-sm line-clamp-2">{venue.description}</p>
                                    )}

                                    <div className="flex gap-4 text-sm">
                                        <div className="flex items-center gap-1 text-blue-400">
                                            <UsersIcon className="h-4 w-4" />
                                            <span>{venue.capacity} capacity</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-green-400">
                                            <span>{currencies.find(c => c.code === venue.currency)?.symbol}</span>
                                            <span>{venue.price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t border-slate-700">
                                        <button
                                            onClick={() => handlePublishVenue(venue.id, venue.is_published)}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition inline-flex items-center justify-center gap-2 ${
                                                venue.is_published
                                                    ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
                                                    : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                                            }`}
                                        >
                                            {venue.is_published ? (
                                                <>
                                                    <EyeSlashIcon className="h-4 w-4" />
                                                    Unpublish
                                                </>
                                            ) : (
                                                <>
                                                    <EyeIcon className="h-4 w-4" />
                                                    Publish
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteVenue(venue.id)}
                                            className="px-3 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg text-sm font-medium transition inline-flex items-center gap-2"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
