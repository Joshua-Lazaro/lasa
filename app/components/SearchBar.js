"use client";

import { useState } from "react";

export default function SearchBar({ onSearch, onAiSuggest }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(input);
  };

  const handleAiClick = () => {
    if (onAiSuggest) onAiSuggest(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-85 lg:w-full max-w-md mx-auto flex items-center border-2 border-gray-300 rounded-lg overflow-hidden"
    >
      <input
        type="text"
        placeholder="Search recipes..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="grow p-2 outline-none"
      />

      {/*AI Image Button */}
      <button
        type="button"
        onClick={handleAiClick}
        className="w-16 h-10 flex justify-center items-center ml-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
      >
        <img
          src="/aiSmartSuggest.png"
          alt="AI Suggest"
          className="w-12 h-10 object-contain"
        />
      </button>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
      >
        Search
      </button>
    </form>
  );
}