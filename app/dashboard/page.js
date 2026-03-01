"use client";

import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";

export default function Dashboard() {
  const [recipes, setRecipes] = useState([]);
  const [randomized, setRandomized] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState("User");
  const router = useRouter();

useEffect(() => {
  async function loadSessionName() {
    const session = await getSession();
    const rawName = session?.user?.name || "";
    const extractedFirstName = rawName.trim().split(/\s+/)[0] || "User";
    setFirstName(extractedFirstName);
  }

  loadSessionName();

  const savedRandomized = sessionStorage.getItem("randomizedRecipes");
  if (savedRandomized) {
    setRandomized(JSON.parse(savedRandomized));
    setIsReady(true);
    return;
  }

  async function fetchRecipes() {
    setIsReady(false);
    const recipeData = await retrieveRecipes();

    const shuffled = [...recipeData].sort(() => 0.5 - Math.random());
    setRandomized(shuffled.slice(0, 5));
    sessionStorage.setItem("randomizedRecipes", JSON.stringify(shuffled.slice(0, 5)));

    setIsReady(true);
  }
    fetchRecipes();
  }, []); 

  // Normal search: pass the query as a URL param
  const handleSearch = (searchTerm) => {
    const encoded = encodeURIComponent(searchTerm);
    router.push(`/searchRecipes?q=${encoded}`);
  };

  // AI suggestion: redirect with aiSuggest param
  const handleAiSuggest = () => {
    router.push(`/searchRecipes?aiSuggest=true`);
  };

  async function retrieveRecipes() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/recipes", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch recipes");
      }
      const data = await res.json();
      setRecipes(data);
      return data;
    } catch (err) {
      setError(err.message);
      setRecipes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }

  const getImageSrc = (id) => `/recipeImages/${id}.jpg?ts=${Date.now()}`;

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />

      {/* Dashboard Welcome Image */}
      <div className="relative p-10 rounded-lg w-full flex flex-col items-center ">
        <h1 className="text-4xl md:text-5xl font-bold text-[#003049] drop-shadow-lg mb-14 px-2">
            Welcome {firstName}!
        </h1>

        {/* Search Bar */}
        <div className="w-full items-center mt-10 mb-10">
          <SearchBar
            onSearch={handleSearch}
            onAiSuggest={handleAiSuggest}
          />
        </div>

        <div className="w-full h-100 pb-5" >{/* Recommendation Cards */}
          <h2 className="text-left text-[#003049] text-2xl md:text-3xl font-bold drop-shadow-lg mb-5 px-2">
            Recommended for You
          </h2>
          <div className="flex flex-row h-full w-full gap-6 px-4 rounded-lg shadow-lg p-6 items-center justify-center bg-[url('/checkered-bg.png')] object-bottom-left bg-repeat">
            <div className="custom-scrollbar flex flex-row sm:flex sm:flex-row overflow-x-auto p-5 gap-12 sm:gap-10">
            {randomized.map((recipe, index) => (
              <div
                key={recipe.recipe_id}
                className={`relative w-60 h-70 sm:w-50 sm:h-65 rounded-2xl shrink-0 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center animate-reveal`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Image
                  src={getImageSrc(recipe.recipe_id)}
                  onClick={() => router.push(`/recipePage/${recipe.recipe_id}`)}
                  alt={recipe.recipe_name}
                  fill
                  className="object-cover rounded-lg object-top-left"
                  unoptimized
                />
                <h1 className="absolute bottom-0 left-0 right-0 text-center bg-[#f8f9fa] py-1 rounded-b-lg text-sm">
                  {recipe.recipe_name}
                </h1>
              </div>
            ))}
            </div> 
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-items-center items-start mt-15 p-4 gap-6">
          {[
            { title: "Inventory", href: "/ingredientsInventory" },
            { title: "Browse Recipes", href: "/searchRecipes" },
            { title: "Create Recipes", href: "/ownRecipes" },
            { title: "My Recipes", href: "/searchOwnRecipes" },
          ].map((card, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full max-w-xs"
            >
              <h2 className="text-center text-[#003049] text-2xl md:text-3xl font-bold drop-shadow-lg mb-4 px-2">
                {card.title}
              </h2>
              <a
                href={card.href}
                className="relative w-full h-96 md:h-115 border-2 border-black rounded-2xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
              >
                <div className="w-[90%] h-[90%] relative">
                  <Image
                    src="/img_placeholder.png"
                    alt={`${card.title} Image`}
                    fill
                    className="object-contain"
                  />
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}