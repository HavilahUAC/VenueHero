'use client';

import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import { supabase } from "@/supabaseClient";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            
            // Fetch user profile from Supabase to get avatar
            if (currentUser) {
                const { data, error } = await supabase
                    .from("normal_users")
                    .select("avatar_url, mood_emoji")
                    .eq("firebase_uid", currentUser.uid)
                    .single();

                if (data) {
                    setUserProfile(data);
                }
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const userInitial = user?.displayName?.[0] || user?.email?.[0] || "U";

    return (
        <nav className="w-full sticky top-0 z-50 bg-gray-300">
            {/* Centered container with padding */}
            <div className="max-w-7xl mx-auto flex items-center justify-between h-[70px] px-6">
                {/* Logo */}
                <h1 className="font-mono text-xl">VenueHero</h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-6 items-center">
                    {!loading && user ? (
                        <>
                            {/* User Avatar */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10">
                                    {userProfile?.avatar_url ? (
                                        <img
                                            src={userProfile.avatar_url}
                                            alt="User avatar"
                                            className="w-full h-full rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                            {userInitial.toUpperCase()}
                                        </div>
                                    )}
                                    {userProfile?.mood_emoji && (
                                        <span className="absolute -bottom-1 -right-1 text-lg bg-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-blue-600">
                                            {userProfile.mood_emoji}
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-700 font-medium">{user.displayName || user.email?.split('@')[0]}</span>
                            </div>
                            {/* Logout Button */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/getStarted" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Sign In as a Venue
                            </Link>
                            <Link href="/normalUsers" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded bg-blue-600 text-white"
                    >
                        {isOpen ? (
                            <XMarkIcon className="h-6 w-6" />
                        ) : (
                            <Bars3Icon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {isOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 pb-4 bg-gray-200 px-6">
                    {!loading && user ? (
                        <>
                            <div className="flex flex-col items-center gap-2 py-4 border-b border-gray-300 w-full">
                                <div className="relative w-14 h-14">
                                    {userProfile?.avatar_url ? (
                                        <img
                                            src={userProfile.avatar_url}
                                            alt="User avatar"
                                            className="w-full h-full rounded-full object-cover border-2 border-white"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                                            {userInitial.toUpperCase()}
                                        </div>
                                    )}
                                    {userProfile?.mood_emoji && (
                                        <span className="absolute -bottom-1 -right-1 text-2xl bg-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-blue-600">
                                            {userProfile.mood_emoji}
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-700 font-medium text-sm">{user.displayName || user.email?.split('@')[0]}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/getStarted" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-center">
                                Sign In as Venue
                            </Link>
                            <Link href="/normalUsers" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full text-center">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;