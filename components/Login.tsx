'use client';

const LoginPage = () => {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-sm flex-1 bg-white rounded-2xl shadow-md border border-gray-100 p-6 sm:p-8 flex flex-col">

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center">
                    Welcome Back
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600 text-center">
                    Sign in to continue to <span className="text-blue-600 font-medium">VenueHero</span>
                </p>

                {/* Form */}
                <form className="mt-6 space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                            placeholder="••••••••"
                        />
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 sm:py-3 px-4 rounded-lg bg-blue-600 text-white
            font-medium text-sm sm:text-base hover:bg-blue-700 transition focus:outline-none
            focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                        Sign In
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="px-3 text-sm text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4
            border border-gray-300 rounded-lg text-sm sm:text-base hover:bg-gray-50 transition">
                        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
                        Continue with Google
                    </button>
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4
            border border-gray-300 rounded-lg text-sm sm:text-base hover:bg-gray-50 transition">
                        <img src="/apple-icon.svg" alt="Apple" className="w-5 h-5" />
                        Continue with Apple
                    </button>
                </div>
            </div>
        </main>
    );
}

export default LoginPage;