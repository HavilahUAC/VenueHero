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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            {steps[step]}
        </div>
    );
}
