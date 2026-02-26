import Image from "next/image";
import NavBar from "../components/NavBar";

export default function Register() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#1f263f]">
            <NavBar />
            <div id="LoginPage" className="p-6">
                <div className="p-10 rounded-lg w-full flex flex-col items-center ">
                    <div className="relative p-2 rounded-lg w-full h-50 ">
                        <Image
                            className="object-contain"
                            src="/lasa-logo.png" 
                            alt="Welcome to LASA"
                            fill
                        />
                    </div>
                    <form className="w-full max-w-md">
                        <div className="mb-4 flex flex-row gap-4">
                            <input type="text" id="firstName" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter your first name"/>
                            <input type="text" id="middleName" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter your middle name"/>
                        </div>

                        <div className="mb-4 flex flex-row gap-4">
                            <input type="text" id="lastName" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter your last name"/>
                        </div>

                        <div className="mb-4 flex flex-row gap-4 justify-center items-center">
                            <select className="w-full p-2 border border-gray-300 rounded mt-1" defaultValue="" required>
                                <option value="" disabled>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <input type="text" id="month" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="MM"/>
                            <input type="text" id="day" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="DD"/>
                            <input type="text" id="year" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="YYYY"/>
                        </div>
                        <select className="w-full p-2 border border-gray-300 rounded mt-1 mb-4" defaultValue="" required>
                                <option value="" disabled>Type</option>
                                <option value="beginner">Beginner</option>
                                <option value="home_cook">Home Cook</option>
                                <option value="enthusiast">Enthusiast</option>
                        </select>
                        <div className="mb-4 flex flex-row gap-4">
                            <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter your email"/>
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <button type="submit" className="w-9rem bg-[#f8f9fa] px-4 py-2 rounded border-2 shadow-md border-[#1f263f] hover:bg-[var(--color-cyan-300)] transition">
                                Create Account
                            </button>
                        </div>
                    </form>
                </div>
            </div>   
        </div>    
    );
}