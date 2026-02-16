'use client';

import { useState } from "react";
import RoleAndBrand from "./steps/RoleAndBrand";
import UploadPhotos from "./steps/UploadPhotos";
import ServicesAndPricing from "./steps/ServicesAndPricing";
import LocationStep from "./steps/Location";
import Verification from "./steps/Verification";
import Complete from "./steps/Complete";

export default function Onboarding() {
    const [step, setStep] = useState(0);

    const next = () => setStep((s) => s + 1);

    const steps = [
        <RoleAndBrand onNext={next} />,
        <UploadPhotos onNext={next} />,
        <ServicesAndPricing onNext={next} />,
        <LocationStep onNext={next} />,
        <Verification onNext={next} />,
        <Complete />
    ];

    const progressPercentage = ((step + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-8">
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                    <span>Step {step + 1} of {steps.length}</span>
                </div>
            </div>

            {/* Card Container */}
            <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/20 shadow-2xl overflow-hidden">
                {steps[step]}
            </div>
        </div>
    );
}
