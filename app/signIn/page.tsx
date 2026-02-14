'use client';

import LoginPage from '@/components/Login';
import SignUpPage from '@/components/Signup';

const signInPage = () => {
    return (
        <div className="min-h-screen bg-gray-200 flex justify-center items-center gap-8">
            <LoginPage />
            <h1 className="text-blue-600 text-5xl">OR</h1>
            <SignUpPage />
        </div>
    );
};

export default signInPage;