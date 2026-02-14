'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { supabase } from "../supabaseClient";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            const { data } = await supabase
                .from("users")
                .select("has_completed_onboarding")
                .eq("firebase_uid", user.uid)
                .single();

            if (data?.has_completed_onboarding) {
                router.replace("/dashboard");
            } else {
                router.replace("/onboarding");
            }

        } catch (error: any) {
            console.error("Login error:", error.message);
        }
    };

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const { data } = await supabase
                .from("users")
                .select("has_completed_onboarding")
                .eq("firebase_uid", user.uid)
                .single();

            if (data?.has_completed_onboarding) {
                router.replace("/dashboard");
            } else {
                router.replace("/onboarding");
            }

        } catch (error: any) {
            console.error("Google login error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-96 h-[28rem] flex flex-col justify-center items-center rounded-lg shadow-md p-6 bg-white">
            <h2 className="text-2xl text-blue-600 font-bold mb-6">Login</h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded-lg"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded-lg"
                    required
                />
                <button type="submit" className="bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700">
                    Login
                </button>
                <button
                    onClick={handleGoogleLogin}
                    className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700"
                >
                    Continue with Google
                </button>
            </form>
        </div>
    );
};

export default LoginPage;