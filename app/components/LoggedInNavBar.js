"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoggedInNavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
     <nav className="sticky top-0 bg-[#f8f9fa] text-[#1a2b3c] border-b-2 border-[#1a2b3c] z-50 px-4 py-3"> 
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center justify-between w-full sm:w-auto">
                <Link href="/dashboard" className="text-2xl font-bold flex flex-row items-center">
                    <span className="flex flex-row">
                        <h1 className="text-[#1a2b3c]">LA</h1><h1 className="text-cyan-300">SA</h1>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="sm:hidden px-3 py-1 border border-[#1a2b3c] rounded-md text-sm font-semibold"
                >
                    Menu ▼
                </button>
            </div>

            <div className={`${isMenuOpen ? "flex" : "hidden"} w-full flex-col gap-2 pt-1 text-sm md:text-base sm:w-auto sm:pt-0 sm:flex sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-x-3 sm:gap-y-1`}>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="hover:underline">Home</Link>
                <Link href="/searchRecipes" onClick={() => setIsMenuOpen(false)} className="hover:underline">Recipes</Link>
                <Link href="/searchOwnRecipes" onClick={() => setIsMenuOpen(false)} className="hover:underline">My Recipes</Link>
                <Link href="/ingredientsInventory" onClick={() => setIsMenuOpen(false)} className="hover:underline">Inventory</Link>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="hover:underline">Logout</Link>
            </div>
        </div>
    </nav>
  );
}