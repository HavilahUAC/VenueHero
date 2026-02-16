'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";

export default function ServicesAndPricing({ onNext }: { onNext: () => void }) {
    const [service, setService] = useState("");
    const [price, setPrice] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [services, setServices] = useState<any[]>([]);

    const currencies = [
        { code: "USD", symbol: "$" },
        { code: "EUR", symbol: "€" },
        { code: "GBP", symbol: "£" },
        { code: "NGN", symbol: "₦" },
        { code: "GHS", symbol: "₵" },
        { code: "ZAR", symbol: "R" },
        { code: "KES", symbol: "KSh" }
    ];

    const addService = () => {
        if (!service || !price) return;
        setServices([...services, { name: service, price, currency }]);
        setService("");
        setPrice("");
        setCurrency("USD");
    };

    const removeService = (index: number) => {
        setServices(services.filter((_, i) => i !== index));
    };

    const save = async () => {
        const user = auth.currentUser;
        if (!user) return;

        await supabase.from("users").update({
            services: services.map(s => s.name),
            pricing: services
        }).eq("firebase_uid", user.uid);

        onNext();
    };

    return (
        <div className="p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
                <div className="text-5xl mb-3">💰</div>
                <h1 className="text-3xl font-bold text-white mb-2">Services & Pricing</h1>
                <p className="text-blue-200">Tell us what services you offer and your pricing</p>
                <p className="text-gray-400 text-sm mt-3">You need at least one service to enable your account. You can add or update services anytime.</p>
            </div>

            <div className="space-y-6">
                {/* Service Input */}
                <div className="grid grid-cols-4 gap-3">
                    <input
                        placeholder="Service name"
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="col-span-2 px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                    />
                    <input
                        placeholder="Price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                    />
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-slate-700/50 border border-gray-600 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition"
                    >
                        {currencies.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.code}
                            </option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={addService}
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-blue-400 text-blue-300 hover:bg-slate-700 transition font-semibold"
                >
                    + Add Service
                </button>

                {/* Services List */}
                {services.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-300">Added Services:</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {services.map((s, i) => {
                                const currencySymbol = currencies.find(c => c.code === s.currency)?.symbol || s.currency;
                                return (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-700/50 border border-gray-600">
                                        <span className="text-white">{s.name} — {currencySymbol}{s.price}</span>
                                        <button
                                            onClick={() => removeService(i)}
                                            className="text-red-400 hover:text-red-300 text-lg"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            <button 
                onClick={save} 
                disabled={services.length === 0}
                className="w-full h-12 mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                Next →
            </button>
        </div>
    );
}
