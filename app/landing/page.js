import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <NavBar />
            <div id="landing-page" className="p-5">
                <div className="relative w-auto h-155 mb-50  overflow-hidden">
                    <div className="bg-black opacity-50 ">
                        <Image 
                            className="w-full h-48 object-cover shadow-md"
                            src="/landing-img.png"
                            alt="Filipino cuisine."
                            fill
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-start pl-10 sm:pl-30"> {/* Image behind text */}
                        <div className="p-4 rounded flex flex-col items-start text-left">
                            <div className="rounded flex flex-col items-start text-left space-y-3">
                                <h1 className="text-[#003049] text-4xl font-bold drop-shadow-lg mb-10">
                                    Discover the Rich Flavors of Filipino Cuisine
                                </h1>
                                <p className="text-[#1f263f] max-w-xl drop-shadow-lg">
                                    Explore a world of vibrant flavors, unique ingredients, and rich culinary traditions with our Filipino recipe website. From classic dishes to modern twists, we bring you the best of Filipino cuisine right at your fingertips.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row sm:gap-10 mt-10">
                                    <Link href="/login">
                                        <button className="w-[var(--size)] px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link href="/register">
                                        <button className="px-6 py-2 bg-[var(--color-cyan-300)] text-gray-100 rounded-xl hover:bg-blue-700 transition">
                                            Create Account
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}