'use client';

import LoginPageNormal from '@/components/login_normUsers';
import SignUpPageNormal from '@/components/signup_normUsers';

const signInPageNormal = () => {
    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center gap-8">
            <LoginPageNormal/>
            <h1 className="text-blue-600 text-3xl">OR</h1>
            <SignUpPageNormal/>
        </div>
    );
};

export default signInPageNormal;