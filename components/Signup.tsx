'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { supabase } from "../supabaseClient";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            await supabase.from("users").insert({
                firebase_uid: user.uid,
                email: user.email,
                name: user.displayName || null,
                has_completed_onboarding: false,
            });

            // 🔑 ALWAYS onboarding
            router.replace("/onboarding");

        } catch (error: any) {
            console.error("Signup error:", error.message);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await supabase.from("users").upsert({
                firebase_uid: user.uid,
                email: user.email,
                name: user.displayName || null,
                has_completed_onboarding: false,
            });

            router.replace("/onboarding");

        } catch (error: any) {
            console.error("Google signup error:", error.message);
        }
    };

    return (
        <div className="w-96 h-[28rem] flex flex-col justify-center items-center rounded-lg shadow-md p-6 bg-white">
            <h2 className="text-2xl text-blue-600 font-bold mb-6">Sign Up</h2>
            <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
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
                    Sign Up
                </button>
                <button
                    onClick={handleGoogleSignUp}
                    className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-600"
                >
                    Continue with Google
                </button>
                <div className="flex w-10 h-10 bg-gray-600">

                </div>
            </form>
        </div>
    );
};

export default SignUpPage;