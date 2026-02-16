"use client";

import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";

export default function SearchRecipes() {
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchRecipes(searchQuery = "") {
    setLoading(true);
    setError("");

    try {
      const url = searchQuery
        ? `/api/recipes?q=${encodeURIComponent(searchQuery)}`
        : `/api/recipes`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include", // send cookies for session
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch recipes");
      }

      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (searchTerm) => {
    fetchRecipes(searchTerm);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800  max-w-auto mx-auto">
      <LoggedInNavBar/>
      <div className="relative p-10 rounded-lg w-full flex flex-col items-center mt-10">
        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <p className="mt-10 text-black">Loading recipes...</p>
        ) : error ? (
          <p className="mt-10 text-red-500">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="mt-10 text-black">No recipes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 mb-20">
            {recipes.map((recipe) => (
              <div
                key={recipe.recipe_id}
                className="relative rounded-lg border-2 border-black h-50 w-70 lg:h-80 lg:w-120 flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                <Image
                  className="object-contain"
                  src="/img_placeholder.png"
                  alt={recipe.recipe_name}
                  fill
                />
                <h1 className="absolute bottom-0 left-0 right-0 text-center text-black bg-opacity-75 py-2">
                  {recipe.recipe_name}
                </h1>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
