"use client";

import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import SearchBar from "../components/SearchBar";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  // Normal search: pass the query as a URL param
  const handleSearch = (searchTerm) => {
    const encoded = encodeURIComponent(searchTerm);
    router.push(`/searchRecipes?q=${encoded}`);
  };

  // AI suggestion: redirect with aiSuggest param
  const handleAiSuggest = () => {
    router.push(`/searchRecipes?aiSuggest=true`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />

      {/* Dashboard Welcome Image */}
      <div className="relative p-10 rounded-lg w-full flex flex-col items-center -mt-40">
        <div className="relative rounded-lg w-full h-120">
          <Image
            className="object-contain"
            src="/dashboard-lasa.png"
            alt="Cook with LASA"
            fill
          />
        </div>

        {/* Search Bar */}
        <div className="relative rounded-lg w-full flex flex-col items-center -mt-40 mb-20">
          <SearchBar
            onSearch={handleSearch}
            onAiSuggest={handleAiSuggest}
          />
        </div>

        {/* Dashboard Cards */}
        <div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-items-center items-start p-4 -mt-20 gap-6">
          {[
            { title: "Inventory", href: "/ingredientsInventory" },
            { title: "Search Recipes", href: "/searchRecipes" },
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