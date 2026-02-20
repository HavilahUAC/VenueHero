'use client';

import { useState, useEffect, type ComponentType, type SVGProps } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebaseConfig";
import { supabase } from "@/supabaseClient";
import {
    BoltIcon,
    FaceFrownIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    HeartIcon,
    LightBulbIcon,
    MoonIcon,
    PhotoIcon,
    SparklesIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

type MoodOption = {
    id: number;
    value: string;
    label: string;
    color: string;
    icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const moodOptions: MoodOption[] = [
    { id: 1, value: 'happy', label: 'Happy', color: 'bg-yellow-400', icon: FaceSmileIcon },
    { id: 2, value: 'laughing', label: 'Laughing', color: 'bg-yellow-300', icon: HandThumbUpIcon },
    { id: 3, value: 'loved', label: 'Loved', color: 'bg-pink-400', icon: HeartIcon },
    { id: 4, value: 'cool', label: 'Cool', color: 'bg-blue-400', icon: SparklesIcon },
    { id: 5, value: 'thinking', label: 'Thinking', color: 'bg-purple-400', icon: LightBulbIcon },
    { id: 6, value: 'tired', label: 'Tired', color: 'bg-indigo-400', icon: MoonIcon },
    { id: 7, value: 'amazed', label: 'Amazed', color: 'bg-orange-400', icon: BoltIcon },
    { id: 8, value: 'frustrated', label: 'Frustrated', color: 'bg-red-400', icon: FaceFrownIcon },
];

const OnboardingPage = () => {
    const [step, setStep] = useState<1 | 2>(1);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!auth.currentUser) {
            router.replace("/login");
        }
    }, [router]);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file is an image
            if (!file.type.startsWith("image/")) {
                setError("Please select an image file.");
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB.");
                return;
            }

            setAvatarFile(file);
            setError(null);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextStep = async () => {
        if (!avatarFile) {
            setError("Please upload an avatar image.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            // Upload avatar to Supabase storage
            const fileExt = avatarFile.name.split(".").pop();
            const fileName = `${user.uid}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, avatarFile);

            if (uploadError) {
                console.error("Upload error:", uploadError.message);
                setError("Failed to upload avatar. Please try again.");
                setLoading(false);
                return;
            }

            // Get public URL
            const { data } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            // Save avatar URL to Supabase
            const { error: dbError } = await supabase
                .from("normal_users")
                .update({
                    avatar_url: data.publicUrl,
                })
                .eq("firebase_uid", user.uid);

            if (dbError) {
                console.error("DB error:", dbError.message);
                setError("Failed to save avatar. Please try again.");
                setLoading(false);
                return;
            }

            setLoading(false);
            setStep(2);
        } catch (error: any) {
            setError(error.message || "An error occurred. Please try again.");
            console.error("Avatar upload error:", error);
            setLoading(false);
        }
    };

    const handleFinish = async () => {
        if (selectedMood === null) {
            setError("Please select your mood for today.");
            return;
        }

        setError(null);
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                setError("User not authenticated.");
                setLoading(false);
                return;
            }

            const selectedMoodData = moodOptions.find(m => m.id === selectedMood);

            // Update user with mood and mark onboarding complete
            const { error: supabaseError } = await supabase
                .from("normal_users")
                .update({
                    mood_emoji: selectedMoodData?.value,
                    has_completed_onboarding: true,
                    updated_at: new Date().toISOString(),
                })
                .eq("firebase_uid", user.uid);

            if (supabaseError) {
                console.error("Supabase update error:", supabaseError.message);
                setError("Failed to save mood. Please try again.");
                setLoading(false);
                return;
            }

            router.replace("/");
        } catch (error: any) {
            setError(error.message || "An error occurred. Please try again.");
            console.error("Onboarding error:", error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
                {/* Progress Indicator */}
                <div className="flex gap-2 mb-8">
                    <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </div>

                {error && (
                    <div className="w-full bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <>
                        {/* Step 1: Avatar Upload */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 inline-flex items-center justify-center gap-2 w-full">
                                <PhotoIcon className="h-8 w-8" />
                                Upload Your Avatar
                            </h1>
                            <p className="text-lg text-gray-600">Choose a profile picture that represents you</p>
                        </div>

                        <div className="flex flex-col items-center gap-6 mb-8">
                            {avatarPreview ? (
                                <div className="relative">
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="w-40 h-40 rounded-full object-cover border-4 border-blue-600"
                                    />
                                    <button
                                        onClick={() => {
                                            setAvatarFile(null);
                                            setAvatarPreview(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700"
                                    >
                                        <XMarkIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                                    <PhotoIcon className="h-10 w-10 text-gray-500" />
                                </div>
                            )}

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    disabled={loading}
                                />
                                <span className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 inline-block transition-colors">
                                    {avatarPreview ? "Change Image" : "Choose Image"}
                                </span>
                            </label>
                        </div>

                        <button
                            onClick={handleNextStep}
                            disabled={!avatarFile || loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                        >
                            {loading ? "Uploading..." : "Next"}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Step 2: Mood Selection */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2 inline-flex items-center justify-center gap-2 w-full">
                                <FaceSmileIcon className="h-8 w-8" />
                                How's Your Mood Today?
                            </h1>
                            <p className="text-lg text-gray-600">Choose a mood that describes how you're feeling</p>
                        </div>

                        {/* Mood Grid */}
                        <div className="grid grid-cols-4 gap-3 mb-8">
                            {moodOptions.map((mood) => {
                                const MoodIcon = mood.icon;
                                return (
                                    <button
                                        key={mood.id}
                                        onClick={() => setSelectedMood(mood.id)}
                                        className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                            selectedMood === mood.id
                                                ? `${mood.color} border-gray-800 text-white shadow-lg scale-105`
                                                : 'border-gray-200 bg-gray-50 hover:border-blue-400'
                                        }`}
                                    >
                                        <MoodIcon className="h-8 w-8" />
                                        <span className="text-xs font-medium">{mood.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-full font-semibold hover:bg-gray-400 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleFinish}
                                disabled={selectedMood === null || loading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? "Saving..." : "Finish"}
                            </button>
                        </div>
                    </>
                )}

                <p className="text-center text-gray-600 text-xs mt-6">
                    You can update these anytime in your profile settings
                </p>
            </div>
        </div>
    );
};

export default OnboardingPage;
