'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebaseConfig';
import { supabase } from '@/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowDownTrayIcon,
    ArrowLeftIcon,
    ArrowPathIcon,
    ChatBubbleLeftRightIcon,
    PaintBrushIcon,
    StarIcon,
} from '@heroicons/react/24/outline';

export default function CustomizePagePage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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
                setFormData({
                    brand_name: data.brand_name || '',
                    brand_description: data.brand_description || '',
                    bio: data.bio || '',
                    website: data.website || '',
                    theme_color: data.theme_color || 'blue'
                });
            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setSaving(true);

        await supabase
            .from('users')
            .update(formData)
            .eq('firebase_uid', user.uid);

        setSaving(false);
        alert('Profile updated successfully!');
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
            </div>
        );
    }

    const themes = [
        { name: 'Blue', value: 'blue', color: 'bg-blue-600' },
        { name: 'Purple', value: 'purple', color: 'bg-purple-600' },
        { name: 'Green', value: 'green', color: 'bg-green-600' },
        { name: 'Pink', value: 'pink', color: 'bg-pink-600' },
        { name: 'Cyan', value: 'cyan', color: 'bg-cyan-600' },
    ];

    return (
        <div className="flex-1 overflow-auto p-8 bg-slate-900">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 text-sm mb-4 inline-flex items-center gap-2">
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <PaintBrushIcon className="h-8 w-8" />
                    Customize Your Page
                </h1>
                <p className="text-gray-400">Make your profile stand out and attract more clients</p>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Basic Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Business Name</label>
                                <input
                                    type="text"
                                    name="brand_name"
                                    value={formData.brand_name}
                                    onChange={handleChange}
                                    placeholder="Your business name"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Short Bio</label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell clients about yourself (max 200 characters)"
                                    maxLength={200}
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none h-24"
                                />
                                <p className="text-gray-400 text-xs mt-1">{formData.bio?.length || 0}/200</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Description</label>
                                <textarea
                                    name="brand_description"
                                    value={formData.brand_description}
                                    onChange={handleChange}
                                    placeholder="Detailed description of your business"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition resize-none h-28"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Website (Optional)</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://yourwebsite.com"
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Theme Color</h3>
                        <div className="grid grid-cols-5 gap-4">
                            {themes.map((theme) => (
                                <button
                                    key={theme.value}
                                    onClick={() => setFormData(prev => ({ ...prev, theme_color: theme.value }))}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition ${
                                        formData.theme_color === theme.value
                                            ? 'border-white'
                                            : 'border-transparent hover:border-slate-600'
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-full ${theme.color}`} />
                                    <span className="text-xs text-gray-300">{theme.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {saving ? (
                            <span className="inline-flex items-center gap-2">
                                <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                Saving...
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2">
                                <ArrowDownTrayIcon className="h-5 w-5" />
                                Save Changes
                            </span>
                        )}
                    </button>
                </div>

                {/* Preview Section */}
                <div>
                    <div className="sticky top-8 bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                        <div className={`h-32 bg-gradient-to-br from-slate-700 to-slate-800`} />

                        <div className="p-6 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{formData.brand_name || 'Business Name'}</h2>
                                <p className="text-sm text-gray-400 mt-1">
                                    {formData.bio || 'Your short bio will appear here'}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-700">
                                <p className="text-gray-300 text-sm">
                                    {formData.brand_description || 'Your description will appear here'}
                                </p>
                            </div>

                            {formData.website && (
                                <div className="pt-4 border-t border-slate-700">
                                    <a
                                        href={formData.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-sm break-all"
                                    >
                                        {formData.website}
                                    </a>
                                </div>
                            )}

                            <div className="pt-4 border-t border-slate-700 flex gap-2">
                                <button className="flex-1 py-2 px-3 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition inline-flex items-center justify-center gap-2">
                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                    Message
                                </button>
                                <button className="flex-1 py-2 px-3 rounded-lg border border-slate-600 text-gray-300 text-sm hover:bg-slate-700 transition inline-flex items-center justify-center gap-2">
                                    <StarIcon className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
