"use client";
import Image from "next/image";
import Link from "next/link";

export default function LoggedInNavBar() {
  return (
     <nav className="sticky top-0 p-4 bg-[#f8f9fa] text-[#1a2b3c] flex justify-between items-center border-b-2 border-[#1a2b3c] pb-1 z-50"> 
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
            <div className="flex items-center space-x-4">
                <a href="/">
                    <img
                        src="/lasa-logo.png"
                        alt="Lasa Logo"
                        className="w-20 h-15 object-contain"
                    />
                </a>
            </div>
            <div className="space-x-3 text-xs ml-10 lg:text-base md:text-base">
                <Link href="/searchRecipes" className="hover:underline">Recipes</Link>
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <Link href="/ingredientsInventory" className="hover:underline">Inventory</Link>
                <Link href="/login" className="hover:underline">Logout</Link>
            </div>
        </div>
    </nav>
  );
}