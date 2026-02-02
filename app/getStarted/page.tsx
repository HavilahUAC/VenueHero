'use client';

const GetStartedPage = () => {
    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 md:p-14 text-center">

                {/* Heading */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
                    Get started with <span className="text-blue-600">VenueHero</span>
                </h1>

                <p className="mt-4 text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                    List your venue, manage bookings, and connect with event organizers —
                    all from one simple dashboard.
                </p>

                {/* CTA */}
                <div className="mt-8">
                    <a
                        href="/signIn"
                        className="inline-flex items-center justify-center px-6 sm:px-8 py-3
        rounded-full bg-blue-600 text-white text-sm sm:text-base font-medium
        hover:bg-blue-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Get Started
                    </a>
                </div>

                {/* Divider */}
                <div className="my-12 border-t border-gray-100" />

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-left">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            Grow your visibility
                        </h3>
                        <p className="text-sm text-gray-600">
                            Reach event organizers actively searching for venues like yours.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            Manage bookings easily
                        </h3>
                        <p className="text-sm text-gray-600">
                            Track availability, requests, and confirmed bookings in one place.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                            Increase revenue
                        </h3>
                        <p className="text-sm text-gray-600">
                            Turn unused space into consistent income with better demand.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default GetStartedPage
