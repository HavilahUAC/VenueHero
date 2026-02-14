'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";

export default function ServicesAndPricing({ onNext }: { onNext: () => void }) {
    const [service, setService] = useState("");
    const [price, setPrice] = useState("");
    const [services, setServices] = useState<any[]>([]);

    const addService = () => {
        if (!service || !price) return;
        setServices([...services, { name: service, price }]);
        setService("");
        setPrice("");
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
        <div className="w-[420px] flex flex-col gap-4">
            <h2 className="text-lg font-medium text-center">Services & Pricing</h2>

            <input
                placeholder="Service name"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="border p-2"
            />

            <input
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="border p-2"
            />

            <button onClick={addService} className="border p-2">
                Add Service
            </button>

            <ul className="text-sm">
                {services.map((s, i) => (
                    <li key={i}>{s.name} — ₦{s.price}</li>
                ))}
            </ul>

            <button onClick={save} className="h-11 bg-blue-600 text-white">
                Next
            </button>
        </div>
    );
}
