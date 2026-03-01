"use client";

import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import SearchBar from "../components/SearchBar";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoggedInFooter from "../components/LoggedInFooter";

function SearchRecipesContent() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch normal recipes from DB
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
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  // Fetch AI suggestions based on inventory
  async function handleAiSuggest() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ai/suggest", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "AI suggestion failed");
      }

      const aiRecipes = await res.json();

      const formattedRecipes = aiRecipes.map((r) => ({
        recipe_id: r.recipe_id || "ai-generated-" + r.recipe_name,
        recipe_name: r.recipe_name,
        recipe_ingredient_list: r.recipe_ingredient_list,
        recipe_steps: r.recipe_steps,
        matchedIngredients: r.matchedIngredients || [],
        aiGenerated: true,
      }));

      setRecipes(formattedRecipes);
    } catch (err) {
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }

  // Trigger search or AI suggestion based on URL params
  useEffect(() => {
    const query = searchParams.get("q");
    const ai = searchParams.get("aiSuggest");

    if (ai) {
      handleAiSuggest();
    } else if (query) {
      fetchRecipes(query);
    } else {
      fetchRecipes();
    }
  }, [searchParams]);

  const handleSearch = (searchTerm) => {
    fetchRecipes(searchTerm);
    router.replace(`/searchRecipes?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleAiClick = () => {
    handleAiSuggest();
    router.replace("/searchRecipes?aiSuggest=true");
  };

  const getImageSrc = (id) => `/recipeImages/${id}.jpg?ts=${Date.now()}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />

      <div className="flex items-center justify-center mt-5">
        <h1 className="text-4xl md:text-5xl items-center font-bold text-[#003049] drop-shadow-lg mt-14 px-2">
          <span className="flex flex-row gap-2">
            <h1 className="text-[#1a2b3c]">Recipe</h1>
            <h1 className="text-[var(--color-cyan-300)]">Search</h1>
          </span>
        </h1>
      </div>
      <div className="relative p-10 w-full flex flex-col items-center mt-5">
        <SearchBar onSearch={handleSearch} onAiSuggest={handleAiClick} />

        {/** TO DO: IMPLEMENT PROPER LOADING SCREEN */}
        {loading ? (
          <p className="mt-10">Loading...</p>
        ) : error ? (
          <p className="mt-10 text-red-500">{error}</p>
        ) : recipes.length === 0 ? (
          <p className="mt-10">Add ingredients to receive AI-recommended dishes!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 mb-20">
            {recipes.map((recipe) => (
              <div
                key={recipe.recipe_id}
                onClick={() => {
                  if (recipe.aiGenerated) {
                    localStorage.setItem(
                      "aiRecipe",
                      JSON.stringify(recipe)
                    );
                    router.push("/recipePage/ai");
                  } else {
                    router.push(`/recipePage/${recipe.recipe_id}`);
                  }
                }}
                className="relative rounded-lg border-2 border-[#1f263f] h-64 w-64 lg:h-80 lg:w-96 flex flex-col justify-end hover:scale-105  hover:border-[var(--color-cyan-300)] transition-transform duration-200 cursor-pointer"
              >
                <Image
                  src={recipe.aiGenerated ? getImageSrc(recipe.recipe_id) : getImageSrc(recipe.recipe_id)}
                  alt={recipe.recipe_name}
                  fill
                  className="object-cover rounded-lg object-center hover:opacity-50 transform transition-opacity duration-200"
                  unoptimized
                />

                {/* Recipe name */}
                <h1 className="absolute bottom-0 left-0 right-0 text-center text-[#003049] bg-[#f8f9fa] py-2 rounded-b-lg">
                  {recipe.recipe_name}
                </h1>

                {/* Highlight matched ingredients */}
                {recipe.matchedIngredients?.length > 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-200 text-xs px-2 py-1 rounded max-w-[90%] overflow-hidden text-ellipsis whitespace-nowrap z-10">
                    {recipe.matchedIngredients.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <LoggedInFooter />
    </div>
  );
}

export default function SearchRecipes() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f9fa]" />}>
      <SearchRecipesContent />
    </Suspense>
  );
}