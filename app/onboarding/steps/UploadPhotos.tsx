'use client';

import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";

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
        <div className="w-[420px] flex flex-col gap-4">
            <h2 className="text-lg font-medium text-center">Brand Assets</h2>

            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
            <input type="file" multiple accept="image/*" onChange={(e) => setPhotos(Array.from(e.target.files || []))} />

            <button onClick={handleUpload} className="h-11 bg-blue-600 text-white">
                {loading ? "Uploading..." : "Next"}
            </button>
        </div>
    );
}
