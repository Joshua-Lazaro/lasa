'use client';
import Image from "next/image";
import { useState } from "react";
import LoggedInNavBar from "../components/LoggedInNavBar";
import Link from "next/link";

export default function OwnRecipeManager() {

    const [recipeSteps, setRecipeSteps] = useState([""]);

    const handleStepChange = () => {
        const lastStepIndex = recipeSteps.length - 1;
        if(recipeSteps[lastStepIndex].trim().length === 0) {
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
                <div className="w-full md:w-full lg:w-1/2 p-10 rounded-lg flex flex-col items-center">
                    <h1 className="text-[#003049] text-3xl font-bold drop-shadow-lg mb-10">
                        Create Your Own Recipes
                    </h1>
                    
                    <div className="w-full h-80 relative mb-0.5 border-2 border-black rounded-2xl">
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
                        <div className="flex flex-row gap-10">
                            <button onClick={handleStepChange} className="w-40 mt-4 px-4 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                                Add Step
                            </button>
                            <button onClick={handleDeleteStep} className="w-40 mt-4 px-4 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                                Remove Step
                            </button>
                        </div>
                    <div className="w-full h-45 border-2 border-black rounded-2xl mt-10 mb-10">

                    </div>

                    <Link href="/createRecipe">
                        <button className="px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-[var(--color-cyan-300)] transition">
                            Create Recipe
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}