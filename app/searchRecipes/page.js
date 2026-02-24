"use client";

import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import SearchBar from "../components/SearchBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  async function fetchRecipes(searchQuery = "") {
    setLoading(true);
    setError("");

    try {
      const url = searchQuery
        ? `/api/recipes?q=${encodeURIComponent(searchQuery)}`
        : `/api/recipes`;

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
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

  // generate cache-busting src
  const getImageSrc = (id) => `/recipeImages/${id}.jpg?ts=${Date.now()}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800 max-w-auto mx-auto">
      <LoggedInNavBar />

      <div className="relative p-10 w-full flex flex-col items-center mt-10">
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
                onClick={() => router.push(`/recipePage/${recipe.recipe_id}`)}
                className="relative rounded-lg border-2 border-black h-64 w-64 lg:h-80 lg:w-96 flex items-center justify-center hover:scale-105 transition-transform duration-200 cursor-pointer"
              >
                {/* Load local image with cache-busting and unoptimized */}
                <Image
                  src={getImageSrc(recipe.recipe_id)}
                  alt={recipe.recipe_name}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />

                <h1 className="absolute bottom-0 left-0 right-0 text-center text-black bg-[#f8f9fa] py-2 rounded-b-lg">
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