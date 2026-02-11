"use client";
import Image from "next/image";

export default function NavBar() {
  return (
     <nav className="sticky top-0 p-4 bg-white text-gray-800 flex justify-between items-center border-b-2 border-gray-400 pb-1 z-50"> 
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <img
                src="/lasa-logo.png"
                alt="Lasa Logo"
                className="w-20 h-20 object-contain"
                />
            </div>
            <div className="space-x-4">
                {/*<Link href="" className="hover:underline">Sign In</Link>
                <Link href="" className="hover:underline">Register</Link>
                */}
            </div>
        </div>
    </nav>
  );
}