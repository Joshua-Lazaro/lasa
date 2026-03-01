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
      className="w-full lg:w-full max-w-md mx-auto flex items-center border-2 border-gray-300 rounded-xl overflow-hidden"
    >
      <input
        type="text"
        placeholder="Search recipes..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="grow p-2 outline-none"
      />

      <div className="flex flex-row">
        {/*AI Image Button */}
        <button
          type="button"
          onClick={handleAiClick}
          className="w-10 h-10 justify-center items-center hover:scale-110 transition-transform duration-200 cursor-pointer"
        >
          <img
            src="/aiSmartSuggest.png"
            alt="AI Suggest"
            className="w-10 h-10 object-contain"
          />
        </button>

        <button
          type="submit"
          className="bg-cyan-300 w-20 text-white rounded-r-l hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}