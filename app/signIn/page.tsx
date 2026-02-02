'use client';

import LoginPage from '@/components/Login';
import SignUpPage from '@/components/Signup';

const signInPage = () => {
    return (
        <div className="flex gap-8 flex-wrap justify-center items-center">
            <LoginPage/>
            <h1 className="text-blue-600 text-5xl">OR</h1>
            <SignUpPage/>
        </div>
    )
}

export default signInPage
