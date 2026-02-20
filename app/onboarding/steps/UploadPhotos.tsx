'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";
import { ArrowRightIcon, CheckIcon, FolderIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function UploadPhotos({ onNext }: { onNext: () => void }) {
    const [logo, setLogo] = useState<File | null>(null);
    const [photos, setPhotos] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const uploadFile = async (file: File, path: string) => {
        const { error } = await supabase.storage.from("brands").upload(path, file);
        if (error) throw error;
        return supabase.storage.from("brands").getPublicUrl(path).data.publicUrl;
    };

    const handleUpload = async () => {
        if (!logo) return;
        setLoading(true);

        const user = auth.currentUser;
        if (!user) return;

        const logoUrl = await uploadFile(logo, `${user.uid}/logo.png`);
        const photoUrls = [];

        for (const file of photos) {
            const url = await uploadFile(
                file,
                `${user.uid}/gallery/${crypto.randomUUID()}.png`
            );
            photoUrls.push(url);
        }

        await supabase.from("users").update({
            logo_url: logoUrl,
            photos: photoUrls
        }).eq("firebase_uid", user.uid);

        setLoading(false);
        onNext();
    };

    return (
        <div className="p-8 max-w-2xl w-full">
            <div className="text-center mb-8">
                <PhotoIcon className="h-12 w-12 text-blue-300 mb-3 mx-auto" />
                <h1 className="text-3xl font-bold text-white mb-2">Upload Your Brand Assets</h1>
                <p className="text-blue-200">Add a logo and photos of your venue</p>
            </div>

            <div className="space-y-6">
                {/* Logo Upload */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Brand Logo</label>
                    <label className="block cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setLogo(e.target.files?.[0] || null)}
                            className="hidden"
                        />
                        <div className={`p-6 rounded-xl border-2 border-dashed transition-all text-center ${
                            logo 
                                ? 'border-blue-400 bg-blue-400/10' 
                                : 'border-gray-600 bg-slate-700/30 hover:border-blue-400'
                        }`}>
                            <div className="text-3xl mb-2 flex items-center justify-center">
                                {logo ? <CheckIcon className="h-8 w-8 text-blue-300" /> : <FolderIcon className="h-8 w-8 text-gray-400" />}
                            </div>
                            <p className="text-gray-300 text-sm">{logo ? logo.name : 'Click to upload logo'}</p>
                        </div>
                    </label>
                </div>

                {/* Photos Upload */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Gallery Photos ({photos.length})</label>
                    <label className="block cursor-pointer">
                        <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                            className="hidden"
                        />
                        <div className={`p-6 rounded-xl border-2 border-dashed transition-all text-center ${
                            photos.length > 0
                                ? 'border-blue-400 bg-blue-400/10'
                                : 'border-gray-600 bg-slate-700/30 hover:border-blue-400'
                        }`}>
                            <div className="text-3xl mb-2 flex items-center justify-center">
                                {photos.length > 0 ? <CheckIcon className="h-8 w-8 text-blue-300" /> : <PhotoIcon className="h-8 w-8 text-gray-400" />}
                            </div>
                            <p className="text-gray-300 text-sm">{photos.length > 0 ? `${photos.length} photos selected` : 'Click to upload photos'}</p>
                        </div>
                    </label>
                </div>
            </div>

            <button 
                onClick={handleUpload} 
                disabled={!logo || loading}
                className="w-full h-12 mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                {loading ? "Uploading..." : (
                    <span className="inline-flex items-center justify-center gap-2">
                        Next
                        <ArrowRightIcon className="h-4 w-4" />
                    </span>
                )}
            </button>
        </div>
    );
}
