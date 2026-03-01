"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoggedInNavBar from "../components/LoggedInNavBar";

function ingredientToLine(ingredient) {
	if (typeof ingredient === "string") return ingredient;
	if (!ingredient || typeof ingredient !== "object") return "";

	const quantity = ingredient.quantity ? `${ingredient.quantity} ` : "";
	const unit = ingredient.unit ? `${ingredient.unit} ` : "";
	const name = ingredient.name || "";
	return `${quantity}${unit}${name}`.trim();
}

function toLines(value) {
	if (!Array.isArray(value)) return "";
	return value.map((item) => ingredientToLine(item)).join("\n");
}

function splitLines(value) {
	return (value || "")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
}

export default function SearchOwnRecipes() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [query, setQuery] = useState("");
	const [selectedRecipeId, setSelectedRecipeId] = useState(null);

	const [editTitle, setEditTitle] = useState("");
	const [editIngredients, setEditIngredients] = useState("");
	const [editSteps, setEditSteps] = useState("");

	const selectedRecipe = useMemo(
		() => recipes.find((recipe) => recipe.personal_recipe_id === selectedRecipeId) || null,
		[recipes, selectedRecipeId]
	);

	const filteredRecipes = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) return recipes;

		return recipes.filter((recipe) =>
			recipe.personal_recipe_name.toLowerCase().includes(normalizedQuery)
		);
	}, [recipes, query]);

	const fetchRecipes = async () => {
		setLoading(true);
		setError("");

		try {
			const response = await fetch("/api/personalRecipes", {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Failed to load your recipes");
			}

			setRecipes(data);

			const createdParam = searchParams.get("created");
			const createdId = createdParam ? Number(createdParam) : null;

			if (createdId && data.some((recipe) => recipe.personal_recipe_id === createdId)) {
				setSelectedRecipeId(createdId);
			} else if (data.length > 0) {
				setSelectedRecipeId((prev) => prev ?? data[0].personal_recipe_id);
			} else {
				setSelectedRecipeId(null);
			}
		} catch (err) {
			setError(err.message);
			setRecipes([]);
			setSelectedRecipeId(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchRecipes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!selectedRecipe) {
			setEditTitle("");
			setEditIngredients("");
			setEditSteps("");
			return;
		}

		setEditTitle(selectedRecipe.personal_recipe_name || "");
		setEditIngredients(toLines(selectedRecipe.personal_recipe_ingredients));
		setEditSteps(toLines(selectedRecipe.personal_recipe_steps));
	}, [selectedRecipe]);

	const handleSelectRecipe = (recipeId) => {
		setSelectedRecipeId(recipeId);
	};

	const handleSaveRecipe = async () => {
		if (!selectedRecipe) return;

		if (!editTitle.trim()) {
			alert("Recipe title is required.");
			return;
		}

		try {
			const response = await fetch("/api/personalRecipes", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					personal_recipe_id: selectedRecipe.personal_recipe_id,
					personal_recipe_name: editTitle,
					personal_recipe_ingredients: splitLines(editIngredients),
					personal_recipe_steps: splitLines(editSteps),
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Failed to update recipe");
			}

			setRecipes((prevRecipes) =>
				prevRecipes.map((recipe) =>
					recipe.personal_recipe_id === data.personal_recipe_id ? data : recipe
				)
			);
			alert("Recipe updated.");
		} catch (err) {
			alert(err.message);
		}
	};

	const handleDeleteRecipe = async () => {
		if (!selectedRecipe) return;

		const shouldDelete = window.confirm("Delete this recipe?");
		if (!shouldDelete) return;

		try {
			const response = await fetch("/api/personalRecipes", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					personal_recipe_id: selectedRecipe.personal_recipe_id,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				throw new Error(data.error || "Failed to delete recipe");
			}

			const remainingRecipes = recipes.filter(
				(recipe) => recipe.personal_recipe_id !== selectedRecipe.personal_recipe_id
			);
			setRecipes(remainingRecipes);
			setSelectedRecipeId(remainingRecipes.length > 0 ? remainingRecipes[0].personal_recipe_id : null);

			const params = new URLSearchParams(searchParams.toString());
			if (params.has("created")) {
				params.delete("created");
				router.replace(`/searchOwnRecipes${params.toString() ? `?${params.toString()}` : ""}`);
			}
		} catch (err) {
			alert(err.message);
		}
	};

	return (
		<div className="min-h-screen bg-[#f8f9fa] text-gray-800">
			<LoggedInNavBar />

			<div className="relative p-10 w-full flex flex-col items-center mt-10">
				<h1 className="text-[#003049] text-2xl font-bold drop-shadow-lg mb-8 md:text-3xl">
					Your Created Recipes
				</h1>

				<button
					onClick={() => router.push("/ownRecipes")}
					className="px-6 py-2 mb-6 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition"
				>
					Create Recipe
				</button>

				<input
					type="text"
					placeholder="Search your recipe title..."
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					className="w-85 lg:w-full max-w-md mx-auto border-2 border-gray-300 rounded-lg p-2 outline-none"
				/>

				{loading ? (
					<p className="mt-10">Loading...</p>
				) : error ? (
					<p className="mt-10 text-red-500">{error}</p>
				) : filteredRecipes.length === 0 ? (
					<p className="mt-10">No recipes found.</p>
				) : (
					<div
						className={`w-full max-w-7xl mx-auto grid justify-items-center gap-8 mt-10 mb-10 ${
							filteredRecipes.length === 1
								? "grid-cols-1"
								: filteredRecipes.length === 2
									? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2"
									: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
						}`}
					>
						{filteredRecipes.map((recipe) => (
							<button
								key={recipe.personal_recipe_id}
								onClick={() => handleSelectRecipe(recipe.personal_recipe_id)}
								className={`relative rounded-lg border-2 h-40 w-64 lg:w-96 p-6 text-left transition-transform duration-200 hover:scale-105 ${
									recipe.personal_recipe_id === selectedRecipeId
										? "border-[#003049] bg-[#e5f2ff]"
										: "border-[#1f263f] bg-white"
								}`}
							>
								<h2 className="text-[#1f263f] text-xl font-semibold wrap-break-word">
									{recipe.personal_recipe_name}
								</h2>
								<p className="text-sm mt-2 text-gray-600">Click to view recipe</p>
							</button>
						))}
					</div>
				)}

				{selectedRecipe && (
					<div className="w-full max-w-4xl border-2 border-[#1f263f] rounded-2xl p-6 mb-12 bg-white">
						<label className="block text-[#1f263f] mb-2">Recipe Title</label>
						<input
							type="text"
							value={editTitle}
							onChange={(event) => setEditTitle(event.target.value)}
							className="w-full border-[#1f263f] border-2 rounded-2xl p-2 mb-6"
						/>

						<label className="block text-[#1f263f] mb-2">Ingredients (one line each)</label>
						<textarea
							value={editIngredients}
							onChange={(event) => setEditIngredients(event.target.value)}
							className="w-full border-[#1f263f] border-2 rounded-2xl p-2 mb-6 h-40"
						/>

						<label className="block text-[#1f263f] mb-2">Steps (one line each)</label>
						<textarea
							value={editSteps}
							onChange={(event) => setEditSteps(event.target.value)}
							className="w-full border-[#1f263f] border-2 rounded-2xl p-2 mb-6 h-52"
						/>

						<div className="flex gap-4 justify-center">
							<button
								onClick={handleSaveRecipe}
								className="px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition"
							>
								Save Changes
							</button>

							<button
								onClick={handleDeleteRecipe}
								className="px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition"
							>
								Delete Recipe
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
