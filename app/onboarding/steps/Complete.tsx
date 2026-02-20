'use client';

import { useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "@heroicons/react/24/outline";

export default function Complete() {
    const router = useRouter();

    useEffect(() => {
        const finish = async () => {
            const user = auth.currentUser;
            if (!user) return;

            await supabase.from("users").update({
                has_completed_onboarding: true
            }).eq("firebase_uid", user.uid);

            // Small delay for visual effect
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            router.replace("/dashboard");
        };

        finish();
    }, [router]);

    return (
        <div className="p-8 max-w-2xl w-full">
            <div className="text-center">
                <SparklesIcon className="h-16 w-16 text-blue-300 mb-6 animate-bounce mx-auto" />
                <h1 className="text-3xl font-bold text-white mb-4">Setup Complete!</h1>
                <p className="text-blue-200 mb-8">Your account is all set. Redirecting to dashboard...</p>
                
                <div className="flex justify-center gap-2 mt-8">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
            </div>
        </div>
    );
}
