'use client';

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error;
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
            <h1 className="text-3xl font-bold text-red-600">Something went wrong</h1>
            <p className="mt-2 text-gray-700">{error.message}</p>

            <button
                onClick={reset}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Try again
            </button>
        </div>
    );
}