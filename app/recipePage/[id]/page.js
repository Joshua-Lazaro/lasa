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

    if (id === "ai") {
      const stored = localStorage.getItem("aiRecipe");
      if (stored) {
        setRecipe(JSON.parse(stored));
        setLoading(false);
        return;
      }
    }

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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

  const ingredientsList = recipe.aiGenerated
    ? recipe.recipe_ingredient_list.split(",")
    : recipe.recipe_ingredient_list
        ?.split(/,|\r?\n/)
        .map((item) => item.trim())
        .filter((item) => item !== "");

  const stepsList = recipe.aiGenerated
    ? recipe.recipe_steps.split("\n")
    : recipe.recipe_steps
        ?.split(/\d+\.\s/)
        .map((item) => item.trim())
        .filter((item) => item !== "");

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />

      <div className="p-10 max-w-4xl mx-auto flex flex-col items-center">
        <button
          onClick={() => router.back()}
          className="self-start mb-4 px-4 py-2 bg-blue-400 hover:bg-blue-500 rounded-lg"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center">
          {recipe.recipe_name}
        </h1>

        <div className="mb-10 border-2 border-black rounded-xl p-6 w-full">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc pl-6 space-y-2">
            {ingredientsList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

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