'use client';

import { useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

export default function Complete() {
    const router = useRouter();

    useEffect(() => {
        const finish = async () => {
            const user = auth.currentUser;
            if (!user) return;

            await supabase.from("users").update({
                has_completed_onboarding: true
            }).eq("firebase_uid", user.uid);

            router.replace("/dashboard");
        };

        finish();
    }, [router]);

    return (
        <div className="text-center">
            <p className="text-sm text-black/60 mt-20">Finishing setup...</p>
        </div>
    );
}
