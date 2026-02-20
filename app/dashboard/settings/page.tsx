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
    BriefcaseIcon,
    CheckCircleIcon,
    Cog6ToothIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
    PaperAirplaneIcon,
    RocketLaunchIcon,
    TrashIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
    const router = useRouter();
    const [profileData, setProfileData] = useState<any>(null);
    const [services, setServices] = useState<any[]>([]);
    const [newService, setNewService] = useState({ name: '', price: '', currency: 'USD' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isPushed, setIsPushed] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [activeTab, setActiveTab] = useState('services');

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

            const { data } = await supabase
                .from('users')
                .select('*')
                .eq('firebase_uid', user.uid)
                .single();

            if (data) {
                setProfileData(data);
                setServices(data.pricing || []);
                setIsPushed(data.is_pushed_to_market || false);
            }

            setLoading(false);
        };

        fetchData();
    }, [router]);

    const handleAddService = () => {
        if (!newService.name || !newService.price) {
            alert('Please fill in all fields');
            return;
        }

        const updatedServices = [...services, newService];
        setServices(updatedServices);
        setNewService({ name: '', price: '', currency: 'USD' });
    };

    const handleRemoveService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        const user = auth.currentUser;
        if (!user) return;

        setSaving(true);

        await supabase
            .from('users')
            .update({
                pricing: services,
                services: services.map(s => s.name)
            })
            .eq('firebase_uid', user.uid);

        setSaving(false);
        alert('Settings saved successfully!');
    };

    const handlePushToMarketplace = async () => {
        const user = auth.currentUser;
        if (!user) return;

        // Check if profile meets requirements
        if (services.length === 0) {
            alert('You need at least one service to push to marketplace.');
            return;
        }

        if (!profileData?.brand_name) {
            alert('Please add a brand name first.');
            return;
        }

        setIsPublishing(true);

        try {
            console.log('Starting marketplace push process...');
            console.log('User UID:', user.uid);
            console.log('Services to save:', services);

            // First, save services if not saved
            const savePayload = {
                pricing: services,
                services: services.map(s => s.name)
            };

            console.log('Save payload:', savePayload);

            const { error: saveError } = await supabase
                .from('users')
                .update(savePayload)
                .eq('firebase_uid', user.uid);

            if (saveError) {
                console.error('Error saving services:', {
                    message: saveError.message,
                    details: saveError.details,
                    hint: saveError.hint,
                    code: saveError.code
                });
                alert(`Error saving services: ${saveError.message || 'Please try again.'}`);
                setIsPublishing(false);
                return;
            }

            console.log('Services saved successfully');

            // Then push to marketplace
            const pushPayload = {
                is_pushed_to_market: !isPushed
            };

            console.log('Push payload:', pushPayload);

            const { error: pushError } = await supabase
                .from('users')
                .update(pushPayload)
                .eq('firebase_uid', user.uid);

            if (pushError) {
                console.error('Error pushing to marketplace:', {
                    message: pushError.message,
                    details: pushError.details,
                    hint: pushError.hint,
                    code: pushError.code,
                    status: pushError.status
                });
                alert(`Error updating marketplace status: ${pushError.message || 'Please try again.'}`);
                setIsPublishing(false);
                return;
            }

            console.log(`Successfully updated is_pushed_to_market to: ${!isPushed}`);
            setIsPushed(!isPushed);
            alert(
                isPushed
                    ? 'Removed from marketplace.'
                    : 'Pushed to marketplace successfully. Your profile is now live, and regular users will see you on the marketplace page.'
            );
            console.log('Successfully toggled marketplace status:', !isPushed);
        } catch (error) {
            console.error('Unexpected error:', error);
            alert(`Unexpected error: ${error instanceof Error ? error.message : 'Please try again.'}`);
        } finally {
            setIsPublishing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-300">Loading...</p>
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
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Cog6ToothIcon className="h-8 w-8" />
                    Settings
                </h1>
                <p className="text-gray-400">Manage your services, pricing, and account settings</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-slate-700">
                <button
                    onClick={() => setActiveTab('services')}
                    className={`px-4 py-3 font-medium transition border-b-2 ${
                        activeTab === 'services'
                            ? 'border-blue-500 text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                    <span className="inline-flex items-center gap-2">
                        <BriefcaseIcon className="h-5 w-5" />
                        Services & Pricing
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-3 font-medium transition border-b-2 ${
                        activeTab === 'profile'
                            ? 'border-blue-500 text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                    <span className="inline-flex items-center gap-2">
                        <UserCircleIcon className="h-5 w-5" />
                        Profile Settings
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('account')}
                    className={`px-4 py-3 font-medium transition border-b-2 ${
                        activeTab === 'account'
                            ? 'border-blue-500 text-white'
                            : 'border-transparent text-gray-400 hover:text-gray-300'
                    }`}
                >
                    <span className="inline-flex items-center gap-2">
                        <KeyIcon className="h-5 w-5" />
                        Account Settings
                    </span>
                </button>
            </div>

            {/* Services Tab */}
            {activeTab === 'services' && (
                <div className="space-y-6">
                    {/* Push Reminder Banner */}
                    {!isPushed && services.length > 0 && (
                        <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <RocketLaunchIcon className="h-8 w-8 text-blue-300" />
                                <div>
                                    <h3 className="text-white font-bold mb-1">Ready to reach customers?</h3>
                                    <p className="text-gray-300 mb-4">Your services are ready! Push your profile to the marketplace to start receiving inquiries from event planners.</p>
                                    <p className="text-gray-400 text-sm">Scroll down to the "Marketplace Status" section to push now!</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add New Service */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Add New Service</h3>

                        <div className="grid grid-cols-4 gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Service name"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                className="col-span-2 px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={newService.price}
                                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                className="px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />
                            <select
                                value={newService.currency}
                                onChange={(e) => setNewService({ ...newService, currency: e.target.value })}
                                className="px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            >
                                {currencies.map(c => (
                                    <option key={c.code} value={c.code}>{c.code}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleAddService}
                            className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                        >
                            + Add Service
                        </button>
                    </div>

                    {/* Services List */}
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Your Services ({services.length})</h3>

                        {services.length === 0 ? (
                            <p className="text-gray-400">No services added yet. Add your first service above!</p>
                        ) : (
                            <div className="space-y-3">
                                {services.map((service, idx) => {
                                    const currencySymbol = currencies.find(c => c.code === service.currency)?.symbol || service.currency;
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                                            <div>
                                                <p className="text-white font-medium">{service.name}</p>
                                                <p className="text-gray-400 text-sm">{currencySymbol}{service.price}</p>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveService(idx)}
                                                className="px-3 py-1 text-red-400 hover:bg-red-600/20 rounded-lg transition text-sm"
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    <TrashIcon className="h-4 w-4" />
                                                    Remove
                                                </span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Marketplace Status */}
                    <div className={`${isPushed ? 'bg-green-900/20 border-green-700' : 'bg-slate-800/50 border-slate-700'} border rounded-xl p-6`}>
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">Marketplace Status</h3>
                                <p className={`${isPushed ? 'text-green-400' : 'text-gray-400'}`}>
                                    {isPushed ? 'Currently live on marketplace' : 'Not visible to customers'}
                                </p>
                            </div>
                            {isPushed ? (
                                <EyeIcon className="h-8 w-8 text-green-400" />
                            ) : (
                                <EyeSlashIcon className="h-8 w-8 text-gray-400" />
                            )}
                        </div>
                        <button
                            onClick={handlePushToMarketplace}
                            disabled={isPublishing || services.length === 0}
                            className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                                isPushed
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isPublishing ? (
                                <span className="inline-flex items-center gap-2">
                                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                                    Processing...
                                </span>
                            ) : isPushed ? (
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircleIcon className="h-5 w-5" />
                                    Remove from Marketplace
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-2">
                                    <PaperAirplaneIcon className="h-5 w-5" />
                                    Push to Marketplace
                                </span>
                            )}
                        </button>
                        {services.length === 0 && (
                            <p className="text-red-400 text-sm mt-3 inline-flex items-center gap-2">
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                Add at least one service before pushing to marketplace
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
                <div className="space-y-6">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Brand Name</label>
                                <input
                                    type="text"
                                    value={profileData?.brand_name || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-gray-400 cursor-not-allowed"
                                />
                                <p className="text-gray-400 text-xs mt-1">Edit in profile customization</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Location</label>
                                <p className="text-white">{profileData?.city}, {profileData?.state}, {profileData?.country}</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Role</label>
                                <p className="text-white capitalize">{profileData?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
                <div className="space-y-6">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Account Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={auth.currentUser?.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-gray-400 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Account Status</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <p className="text-white">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4">Danger Zone</h3>
                        <p className="text-gray-300 mb-4">Delete your account and all associated data permanently</p>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm">
                            <span className="inline-flex items-center gap-2">
                                <TrashIcon className="h-4 w-4" />
                                Delete Account
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Save Button (Services Tab) */}
            {activeTab === 'services' && (
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-8 w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
            )}
        </div>
    );
}
