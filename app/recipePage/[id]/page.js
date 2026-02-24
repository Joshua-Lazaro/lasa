"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoggedInNavBar from "../../components/LoggedInNavBar";

export default function RecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchRecipe() {
      try {
        const res = await fetch(`/api/recipes/${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch recipe");
        }

        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading)
    return <p className="text-center mt-10">Loading recipe...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!recipe)
    return <p className="text-center mt-10">Recipe not found.</p>;

  // Split ingredients
  const ingredientsList = recipe.recipe_ingredient_list
    ? recipe.recipe_ingredient_list
        .split(/,|\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item !== "")
    : [];

  // Split steps
  const stepsList = recipe.recipe_steps
    ? recipe.recipe_steps
        .split(/\d+\.\s/)
        .map((item) => item.trim())
        .filter((item) => item !== "")
    : [];

 
  const getImageSrc = (id) => `/recipeImages/${id}.jpg?ts=${Date.now()}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />
      <div className="p-10 max-w-4xl mx-auto flex flex-col items-center">

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="self-start mb-4 px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg "
        >
          ← Back
        </button>

        {/* Recipe Image */}
        <div className="relative w-full h-80 lg:h-96 mb-8 rounded-lg overflow-hidden border-2 border-black">
          <Image
            src={getImageSrc(id)}
            alt={recipe.recipe_name}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <h1 className="text-3xl font-bold mb-8 text-center">
          {recipe.recipe_name}
        </h1>

        {/* Ingredients */}
        <div className="mb-10 border-2 border-black rounded-xl p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2">
            {ingredientsList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="border-2 border-black rounded-xl p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Cooking Steps</h2>
          <ol className="list-decimal pl-6 space-y-2">
            {stepsList.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}