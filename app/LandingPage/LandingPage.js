import Image from "next/image";
import NavBar from "../components/NavBar";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <NavBar />
            <div id="landing-page" className="grow h-15 justify-items-center text-center p-5">
                <div className="relative w-full h-155 mb-50 rounded-lg overflow-hidden shadow-lg">
                        <div className="bg-black opacity-50">
                            <Image 
                                className="p-4 rounded-lg shadow-md"
                                src="/landing-img.png"
                                alt="Filipino cuisine."
                                fill
                                style={{
                                    transform: "scale(1.1)",
                                    transformOrigin: "32% 38%",
                                    objectPosition: "32% 38%",
                                    objectFit: "cover",
                                }}
                                priority={true} 
                            />
                        </div>
                </div>
            </div>

           <div className="absolute inset-0 flex items-center justify-start pl-20">
                <div className="p-4 rounded flex flex-col items-start text-left">
                    <div className="p-4 rounded flex flex-col items-start text-left">
                        <h1 className="text-black text-4xl font-bold drop-shadow-lg mb-10">
                                       Discover the Rich Flavors of Filipino Cuisine
                        </h1>
                        <p className="text-gray-900 mt-2 max-w-md drop-shadow-lg">
                            Explore a world of vibrant flavors, unique ingredients, and rich culinary traditions with our Filipino recipe website. From classic dishes to modern twists, we bring you the best of Filipino cuisine right at your fingertips.
                        </p>
                        <div className="flex-row space-x-10">
                            <button className="w-[var(--size)] mt-4 px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                                Sign In
                            </button>
                            <button className="px-6 py-2 bg-[var(--color-cyan-300)] text-gray-100 rounded-xl hover:bg-blue-700 transition">
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    );
}