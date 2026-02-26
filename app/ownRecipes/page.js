'use client';
import Image from "next/image";
import { useState } from "react";
import LoggedInNavBar from "../components/LoggedInNavBar";
import Link from "next/link";

export default function OwnRecipeManager() {

    const [recipeSteps, setRecipeSteps] = useState([""]);
    const [ingredientNumber, setNumIngredients] = useState(1);
    const [unit, setUnit] = useState('pcs');
    const [ingredients, setIngredients] = useState(Array(1).fill(""));
    const [quantities, setQuantities] = useState(Array(1).fill(""));
    const [units, setUnits] = useState(Array(1).fill("pcs"));

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

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <LoggedInNavBar />
            
            <div className="flex justify-center p-5">
                <div className="w-full md:w-1/2 lg:w-4/5 p-10 rounded-lg flex flex-col items-center">
                    <h1 className="text-[#003049] text-2xl font-bold drop-shadow-lg mb-10 md:text-3xl">
                        Create Your Own Recipes
                    </h1>
                    <div className="container w-full ">
                        <label htmlFor="recipeName" className="block text-[#1f263f] ">
                            Recipe Name
                        </label>
                        <input
                            type="text"
                            className="w-full border-[#1f263f] border-2 rounded-2xl p-2 mb-10"
                            placeholder="Enter your recipe name"
                        />
                    </div>
                    <div className="container w-full">
                        <label htmlFor="recipeSteps" className="block text-[#1f263f] mb-2">
                                Recipe Steps
                        </label>
                        <div className="w-full h-80 relative mb-0.5 border-2 border-[#1f263f] rounded-2xl">
                            <div className="flex flex-col h-auto">
                                <div id="recipeStepsContainer" className="flex flex-col gap-4 custome-scrollbar overflow-y-auto h-75 p-2">
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
                            <button onClick={handleStepChange} className="w-40 mt-4 px-4 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                                Add Step
                            </button>
                            <button onClick={handleDeleteStep} className="w-40 mt-4 px-4 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                                Remove Step
                            </button>
                        </div>
                    </div>
                    
                    <div className="container w-full mt-10">
                        <label htmlFor="recipeIngredients" className="block text-[#1f263f]">
                            Recipe Ingredients
                        </label>    

                        <div className="w-full h-85 border-2 border-[#1f263f] rounded-2xl mb-10">
                            <label htmlFor="recipeIngredients" className="block text-[#1f263f] m-2">
                                No. of Ingredients
                            </label> 
                            <div className="flex gap-4 items-center justify-center m-4">
                                <input type="text" placeholder="Enter number of ingredient" className="w-full text-sm text-gray-500 items" onChange={(e) => handleNumIngredientsChange(e.target.value)}/>
                            </div>

                            <div className="custom-scrollbar overflow-y-auto h-60 m-4">
                                {ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex gap-4 items-end mb-4">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <input
                                                type="text"
                                                className="w-full h-full border-gray-300 border-b-2 rounded relative"
                                                placeholder="Enter ingredient name"
                                                value={ingredient}
                                                onChange={(e) => handleIngredientChange(index, e.target.value)}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-1 items-end">
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="text"
                                                    id={`quantity-${index}`}
                                                    placeholder="0"
                                                    className="w-20 p-2 border-2 border-black rounded-xl text-center"
                                                    value={quantities[index]}
                                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                />

                                                <select
                                                    value={units[index]}
                                                    onChange={(e) => handleUnitChange(index, e.target.value)}
                                                    className="w-24 p-2 border-2 border-black rounded-xl text-center appearance-none bg-white"
                                                >
                                                    <option value="pcs">pcs</option>
                                                    <option value="g">g</option>
                                                    <option value="kg">kg</option>
                                                    <option value="ml">ml</option>
                                                    <option value="l">l</option>
                                                </select>
                                            </div>  
                                        </div>
                                    </div>
                                ))}
                            </div> 
                        </div>
                    </div>

                        <button className="px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                            Create Recipe
                        </button>
                </div>
            </div>
        </div>
    );
}