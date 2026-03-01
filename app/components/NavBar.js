"use client";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
     <nav className="sticky top-0 p-4 bg-[#f8f9fa] text-[#1a2b3c] flex justify-between items-center border-b-2 border-[#1a2b3c] pb-1 z-50"> 
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center space-x-4">
                {/*<a href="/">
                    <img
                        src="/lasa-logo.png"
                        alt="Lasa Logo"
                        className="w-20 h-15 object-contain"
                    />
                </a>*/}
                <Link href="/" className="text-2xl font-bold flex flex-row items-center">
                    <span className="flex flex-row">
                        <h1 className="text-[#1a2b3c]">LA</h1><h1 className="text-[var(--color-cyan-300)]">SA</h1>
                    </span>
                </Link>
            </div>
            <div className="space-x-4">
                <Link href="/login" className="hover:underline">Sign In</Link>
                <Link href="/register" className="hover:underline">Register</Link>
            </div>
        </div>
    </nav>
  );
}