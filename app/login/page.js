import Image from "next/image";
import NavBar from "../components/NavBar";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <NavBar />
            <div id="LoginPage" className="p-6">
                <div className="p-10 rounded-lg w-full flex flex-col items-center ">
                    <div className="relative p-2 rounded-lg w-full h-50 ">
                        <Image
                        className="object-contain"
                        src="/welcome-lasa.png" 
                        alt="Welcome to LASA"
                        fill
                        />
                    </div>
                    <form className="w-full max-w-md">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter your email"/>
                        </div>
                        <div className="mb-4 justify-center items-center">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded mt-1" placeholder="Enter your password"/>
                        </div>
                        <div className="flex flex-col gap-1 justify-center items-center">
                            <button type="submit" className="w-[var(--size)] bg-white text-black px-4 py-2 rounded border-2 border-black hover:bg-[var(--color-cyan-300)] transition">Login</button>

                            <p className="mt-4 text-gray-600">Don't have an account? <a href="/register" className="text-blue-500 hover:underline">Register here</a>.</p>
                        </div>
                    </form>
                </div>
            </div>   
        </div>    
    );
}