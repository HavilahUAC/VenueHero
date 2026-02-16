'use client';

import { useState } from "react";
import { auth } from "@/firebaseConfig";
import { supabase } from "@/supabaseClient";

export default function RoleAndBrand({ onNext }: { onNext: () => void }) {
    const [role, setRole] = useState("");
    const [brandName, setBrandName] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!role || !brandName) return;
        setLoading(true);

        const user = auth.currentUser;
        if (!user) return;

        await supabase.from("users").update({
            role,
            brand_name: brandName,
            brand_description: brandDescription
        }).eq("firebase_uid", user.uid);

        setLoading(false);
        onNext();
    };

    return (
        <div className="p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
                <div className="text-5xl mb-3">🏢</div>
                <h1 className="text-3xl font-bold text-white mb-2">Your Role & Brand</h1>
                <p className="text-blue-200">Tell us about yourself and your business</p>
            </div>

            <div className="space-y-6">
                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Select Your Role</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                                role === "event_planner"
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400 ring-2 ring-cyan-400"
                                    : "border-gray-600 bg-slate-700/30 text-gray-300 hover:border-blue-400 hover:bg-slate-700/50"
                            }`}
                            onClick={() => setRole("event_planner")}
                        >
                            📋 Event Planner
                        </button>
                        <button
                            className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                                role === "venue"
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-blue-400 ring-2 ring-cyan-400"
                                    : "border-gray-600 bg-slate-700/30 text-gray-300 hover:border-blue-400 hover:bg-slate-700/50"
                            }`}
                            onClick={() => setRole("venue")}
                        >
                            🏢 Venue Owner
                        </button>
                    </div>
                </div>

                {/* Brand Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Brand Name</label>
                    <input
                        type="text"
                        placeholder="Your brand name..."
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                    />
                </div>

                {/* Brand Description */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Brand Description</label>
                    <textarea
                        placeholder="Tell us about your business..."
                        value={brandDescription}
                        onChange={(e) => setBrandDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition resize-none h-24"
                    />
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={!role || !brandName || loading}
                className="w-full h-12 mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? "Saving..." : "Next →"}
            </button>
        </div>
    );
}
