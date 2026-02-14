'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";

export default function Verification({ onNext }: { onNext: () => void }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async () => {
        if (!file) return;
        setLoading(true);

        const user = auth.currentUser;
        if (!user) return;

        await supabase.storage
            .from("verification")
            .upload(`${user.uid}/doc.png`, file);

        setLoading(false);
        onNext();
    };

    return (
        <div className="w-[420px] flex flex-col gap-4">
            <h2 className="text-lg font-medium text-center">Verification</h2>

            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />

            <button onClick={submit} className="h-11 bg-blue-600 text-white">
                {loading ? "Submitting..." : "Submit & Continue"}
            </button>
        </div>
    );
}
