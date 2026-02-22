
"use client";

import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); 
    onSearch(input);
  };

  return (
    <form onSubmit={handleSubmit} className="w-85 lg:w-full max-w-md mx-auto flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
        <input
            type="text"
            placeholder="Search recipes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="grow p-2 outline-none"
        />
        <button type="button" className="w-10 ml-2 text-white px-4 py-2 rounded-lg hover:scale-130 transition-transform duration-200 cursor-pointer">
            <img src="/aiSmartSuggest.png" alt="Filter" className="w-15 h-5 object-contain" />
        </button>
        <button
            type="submit"
            className="bg-blue-500 text-white  px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
        >
         Search
        </button>
    </form>
  );
}
