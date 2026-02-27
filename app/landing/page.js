import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <NavBar />
            <div id="landing-page" className="">
                <div className="relative w-auto h-155 mb-50  overflow-hidden">
                    <div className="bg-black opacity-80 w-full h-full">
                        <Image 
                            className="w-full h-48 object-cover object-left shadow-md sm:w-full sm:h-96"
                            src="/lasa-landing.png"
                            alt="Filipino cuisine."
                            fill
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-start pl-5 sm:pl-3"> {/* Image behind text */}
                        <div className="p-4 flex flex-col items-start text-left">
                            <div className="rounded flex flex-col items-start text-left space-y-3">
                                <h1 className="text-[#1f263f] text-4xl font-bold drop-shadow-lg mb-10">
                                    Discover the Rich Flavors of Filipino Cuisine
                                </h1>
                                <p className="text-[#1f263f] w-2/3 sm:w-2/4 drop-shadow-lg">
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