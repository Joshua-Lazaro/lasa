'use client';
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoggedInNavBar from "../components/LoggedInNavBar";
import MeasurementUnitPicker from "../components/MeasurementUnitPicker";

export default function OwnRecipeManager() {

    const MIN_SUBMIT_INTERVAL_MS = 1200;

    const router = useRouter();
    const isCreatingRef = useRef(false);
    const lastSubmitAtRef = useRef(0);

    const [recipeName, setRecipeName] = useState("");
    const [recipeSteps, setRecipeSteps] = useState([""]);
    const [ingredientNumber, setNumIngredients] = useState(1);
    const [ingredients, setIngredients] = useState(Array(1).fill(""));
    const [quantities, setQuantities] = useState(Array(1).fill(""));
    const [units, setUnits] = useState(Array(1).fill("pcs"));
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [isCreating, setIsCreating] = useState(false);

    const handleIngredientChange = (index, value) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index] = value;
        setIngredients(updatedIngredients);
    }

    const handleNumIngredientsChange = (value) => {
        const num = parseInt(value) || 0;
        setNumIngredients(num);
        setIngredients(Array(num).fill(""));
        setQuantities(Array(num).fill(""));
        setUnits(Array(num).fill("pcs"));
    }

    const handleQuantityChange = (index, value) => {
        const updatedQuantities = [...quantities];
        updatedQuantities[index] = value;
        setQuantities(updatedQuantities);
    }

    const handleUnitChange = (index, value) => {
        const updatedUnits = [...units];
        updatedUnits[index] = value;
        setUnits(updatedUnits);
    }

    const handleStepChange = () => {
        const lastStepIndex = recipeSteps.length - 1;
        if(recipeSteps[lastStepIndex].trim().length !== 0) {
            setRecipeSteps([...recipeSteps, ""]);
        } else {            
            alert("Please fill out the current step before adding a new one.");
        }
    }

    const handleRecipeField = (index, value) => {
        const updatedSteps = [...recipeSteps];
        updatedSteps[index] = value;
        setRecipeSteps(updatedSteps);
    }

    const handleDeleteStep = () => {
        if(recipeSteps.length > 1) {
            setRecipeSteps(prevSteps => prevSteps.slice(0, -1));
        } else {
            alert("Cannot remove the last step.");
        }
    }

    //CREATE RECIPE FUNCTION
    const handleCreateRecipe = async () => {
        const now = Date.now();

        // Guard against duplicate submissions from rapid/double clicks.
        if (isCreatingRef.current || now - lastSubmitAtRef.current < MIN_SUBMIT_INTERVAL_MS) {
            return;
        }

        if (!recipeName.trim()) {
            alert("Recipe name is required");
            return;
        }

        const formattedIngredients = ingredients.map((ingredient, index) => ({
            name: ingredient,
            quantity: quantities[index],
            unit: units[index]
        }));

        isCreatingRef.current = true;
        lastSubmitAtRef.current = now;
        setIsCreating(true);

        try {
            const response = await fetch("/api/personalRecipes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: recipeName,
                    ingredients: formattedIngredients,
                    steps: recipeSteps,
                    additional_notes: additionalNotes
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to create recipe");
                return;
            }

            router.push(`/searchOwnRecipes?created=${data.personal_recipe_id}`);

        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsCreating(false);
            setTimeout(() => {
                isCreatingRef.current = false;
            }, MIN_SUBMIT_INTERVAL_MS);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <LoggedInNavBar />
            
            <div className="flex justify-center p-5">
                <div className="w-full md:w-1/2 lg:w-4/5 p-10 rounded-lg flex flex-col items-center">
                    <h1 className="text-[#003049] text-2xl font-bold drop-shadow-lg mb-10 md:text-3xl">
                        Create Your Own Recipes
                    </h1>

                    <div className="container w-full ">
                        <label className="block text-[#1f263f] ">
                            Recipe Name
                        </label>
                        <input
                            type="text"
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                            className="w-full border-[#1f263f] border-2 rounded-2xl p-2 mb-10"
                            placeholder="Enter your recipe name"
                        />
                    </div>

                    <div className="container w-full">
                        <label className="block text-[#1f263f] mb-2">
                                Recipe Steps
                        </label>
                        <div className="w-full h-80 relative mb-0.5 border-2 border-[#1f263f] rounded-2xl">
                            <div className="flex flex-col h-auto">
                                <div className="flex flex-col gap-4 custome-scrollbar overflow-y-auto h-75 p-2">
                                    {recipeSteps.map((step, index) => (
                                        <input 
                                            key={index}
                                            type="text" 
                                            className="w-full border-gray-300 border-b-2 rounded rounded-1xl relative" 
                                            placeholder="Enter your recipe step"
                                            value={step}
                                            onChange={(e) => handleRecipeField(index, e.target.value)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-row gap-10 items-center justify-center">
                            <button onClick={handleStepChange} className="w-40 mt-4 px-4 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition">
                                Add Step
                            </button>
                            <button onClick={handleDeleteStep} className="w-40 mt-4 px-4 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition">
                                Remove Step
                            </button>
                        </div>
                    </div>
                    
                    <div className="container w-full mt-5">
                        <label className="block text-[#1f263f]">
                            Recipe Ingredients
                        </label>    

                        <div className="w-full h-85 border-2 border-[#1f263f] rounded-2xl mb-10">
                            <label className="block text-[#1f263f] m-2">
                                No. of Ingredients
                            </label> 
                            <div className="flex gap-4 items-center justify-center m-4">
                                <input 
                                    type="text" 
                                    placeholder="Enter number of ingredient" 
                                    className="w-full text-sm text-gray-500 items" 
                                    onChange={(e) => handleNumIngredientsChange(e.target.value)}
                                />
                            </div>

                            <div className="custom-scrollbar overflow-y-auto overflow-x-hidden h-60 m-4">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-2 items-end mb-4">
                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <input
                                                type="text"
                                                className="w-full h-full border-gray-300 border-b-2 rounded relative"
                                                placeholder="Enter ingredient name"
                                                value={ingredient}
                                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="0"
                                                className="w-16 p-2 border-2 border-black rounded-xl text-center"
                                                value={quantities[index]}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            />

                                            <MeasurementUnitPicker
                                                value={units[index]}
                                                onChange={(value) => handleUnitChange(index, value)}
                                                wrapperClassName="relative w-20"
                                                inputClassName="w-20 p-2 border-2 border-black rounded-xl text-center bg-white"
                                                dropdownClassName="absolute right-0 z-20 mt-1 w-32 max-h-44 overflow-y-auto custom-scrollbar bg-white border-2 border-black rounded-xl shadow-lg"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div> 
                        </div>
                    </div>

                    <div className="container w-full mb-8">
                        <label className="block text-[#1f263f] mb-2">
                            Additional Notes
                        </label>
                        <textarea
                            value={additionalNotes}
                            onChange={(e) => setAdditionalNotes(e.target.value)}
                            className="w-full border-[#1f263f] border-2 rounded-2xl p-3 min-h-28 resize-y"
                            placeholder="Add notes, links, or anything helpful (optional)"
                        />
                    </div>

                    <button 
                        onClick={handleCreateRecipe}
                        disabled={isCreating}
                        className="px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#1f263f]"
                    >
                        {isCreating ? "Creating..." : "Create Recipe"}
                    </button>

                </div>
            </div>
        </div>
    );
}