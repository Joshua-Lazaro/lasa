"use client";
import Image from "next/image";
import Link from "next/link";

export default function SearchBar() {
  return (
    <form className="w-full max-w-md mx-auto flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <input
            type="text"
            placeholder="Search..."
            className="grow p-2 outline-none"
        />
        <button type="button" className="ml-2 text-white px-4 py-2 rounded-lg hover:scale-130 transition-transform duration-200 cursor-pointer">
            <img src="/aiSmartSuggest.png" alt="Filter" className="w-15 h-5 object-contain" />
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors">
            Search
        </button>

    </form>
  );
}