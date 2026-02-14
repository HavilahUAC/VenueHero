export default function Welcome({ onNext }: { onNext: () => void }) {
    return (
        <div className="w-[420px] text-center">
            <h1 className="text-2xl font-medium text-black">
                Welcome
            </h1>
            <p className="text-sm text-black/60 mt-2">
                Let’s get you set up.
            </p>

            <button
                type="button"
                onClick={onNext}
                className="mt-10 w-full h-[20px] bg-blue-600 rounded-lg text-white text-sm"
            >
                Continue
            </button>
        </div>
    );
}
