'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";

interface ProfileProps {
    onNext: () => void;
}

export default function Profile({ onNext }: ProfileProps) {
    const [role, setRole] = useState("");
    const [brandName, setBrandName] = useState("");
    const [brandDescription, setBrandDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!role || !brandName) return;

        setLoading(true);
        const user = auth.currentUser;
        if (!user) return;

        await supabase
            .from("users")
            .update({
                role,
                brand_name: brandName,
                brand_description: brandDescription,
            })
            .eq("firebase_uid", user.uid);

        setLoading(false);
        onNext();
    };

    return (
        <div className="w-[420px] flex flex-col gap-6">
            <h1 className="text-xl font-medium text-black text-center">
                Your Role & Brand
            </h1>

            {/* Role Selection */}
            <div className="flex justify-center gap-4">
                <button
                    className={`px-6 py-3 border ${
                        role === "event_planner" ? "border-black bg-black text-white" : "border-black/20"
                    }`}
                    onClick={() => setRole("event_planner")}
                >
                    Event Planner
                </button>

                <button
                    className={`px-6 py-3 border ${
                        role === "venue" ? "border-black bg-black text-white" : "border-black/20"
                    }`}
                    onClick={() => setRole("venue")}
                >
                    Venue
                </button>
            </div>

            {/* Brand Name */}
            <input
                type="text"
                placeholder="Brand Name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full h-11 px-3 border border-black/20 outline-none"
            />

            {/* Brand Description */}
            <textarea
                placeholder="Short Description"
                value={brandDescription}
                onChange={(e) => setBrandDescription(e.target.value)}
                className="w-full px-3 py-2 border border-black/20 outline-none resize-none h-24"
            />

            <button
                onClick={handleSubmit}
                className="w-full h-11 bg-blue-600 text-white text-sm font-medium"
                disabled={!role || !brandName || loading}
            >
                {loading ? "Saving..." : "Continue"}
            </button>
        </div>
    );
}
