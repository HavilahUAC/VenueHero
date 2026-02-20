'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";
import { ArrowRightIcon, CheckCircleIcon, CheckIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

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
        <div className="p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
                <CheckCircleIcon className="h-12 w-12 text-blue-300 mb-3 mx-auto" />
                <h1 className="text-3xl font-bold text-white mb-2">Verification</h1>
                <p className="text-blue-200">Submit a document for account verification</p>
            </div>

            <div className="space-y-6">
                <label className="block cursor-pointer">
                    <input 
                        type="file" 
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    <div className={`p-8 rounded-xl border-2 border-dashed transition-all text-center ${
                        file 
                            ? 'border-blue-400 bg-blue-400/10' 
                            : 'border-gray-600 bg-slate-700/30 hover:border-blue-400'
                    }`}>
                        <div className="text-3xl mb-2 flex items-center justify-center">
                            {file ? <CheckIcon className="h-8 w-8 text-blue-300" /> : <DocumentTextIcon className="h-8 w-8 text-gray-400" />}
                        </div>
                        <p className="text-gray-300">{file ? file.name : 'Click to upload verification document'}</p>
                        <p className="text-gray-400 text-xs mt-1">ID, License, or Certificate</p>
                    </div>
                </label>
            </div>

            <button 
                onClick={submit} 
                disabled={!file || loading}
                className="w-full h-12 mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? "Submitting..." : (
                    <span className="inline-flex items-center justify-center gap-2">
                        Submit & Continue
                        <ArrowRightIcon className="h-4 w-4" />
                    </span>
                )}
            </button>
        </div>
    );
}
