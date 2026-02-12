import Image from "next/image";
import NavBar from "../components/NavBar";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <NavBar />
            <div id="LoginPage" className="p-6">
                <div className="p-10 rounded-lg w-full flex flex-col items-center ">
                    <div className="relative p-2 rounded-lg w-full h-48 ">
                        <Image
                        className="object-contain"
                        src="/welcome-lasa.png" 
                        alt="Welcome to LASA"
                        fill
                        />
                    </div>
                    <p className="text-gray-600">Please sign in to your account to continue.</p>

                </div>
            </div>   
        </div>    
    );
}