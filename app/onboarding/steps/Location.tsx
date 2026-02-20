'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";
import { ArrowRightIcon, MapPinIcon } from "@heroicons/react/24/outline";

export default function LocationStep({ onNext }: { onNext: () => void }) {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("Nigeria");
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!address || !city || !state || !zip) return;
        setLoading(true);

        const user = auth.currentUser;
        if (!user) return;

        await supabase.from("users").update({
            address,
            city,
            state,
            zip,
            country
        }).eq("firebase_uid", user.uid);

        setLoading(false);
        onNext();
    };

    return (
        <div className="p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
                <MapPinIcon className="h-12 w-12 text-blue-300 mb-3 mx-auto" />
                <h1 className="text-3xl font-bold text-white mb-2">Your Location</h1>
                <p className="text-blue-200">Where is your venue located?</p>
            </div>

            <div className="space-y-4">
                {/* Address */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Street Address</label>
                    <input
                        type="text"
                        placeholder="123 Main Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                    />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">City</label>
                        <input
                            type="text"
                            placeholder="Lagos"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">State</label>
                        <input
                            type="text"
                            placeholder="Lagos"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                        />
                    </div>
                </div>

                {/* ZIP & Country */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">ZIP Code</label>
                        <input
                            type="text"
                            placeholder="100001"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                    />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Country</label>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                        >
                            <option>Nigeria</option>
                            <option>Ghana</option>
                            <option>Kenya</option>
                            <option>South Africa</option>
                            <option>Egypt</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!address || !city || !state || !zip || loading}
                className="w-full h-12 mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? "Saving..." : (
                    <span className="inline-flex items-center justify-center gap-2">
                        Next
                        <ArrowRightIcon className="h-4 w-4" />
                    </span>
                )}
            </button>
        </div>
    );
}
