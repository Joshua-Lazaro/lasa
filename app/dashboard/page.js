import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <NavBar />
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

                {/* Dashboard Cards */}
                <div className="flex flex-col md:flex-row flex-wrap justify-center items-start w-full p-4 -mt-40 gap-6">
                    {[
                        { title: "Ingredients Inventory", href: "/ingredientsInventory" },
                        { title: "Search Recipes", href: "/searchRecipes" },
                        { title: "Create Your Own Recipes", href: "/ownRecipes" },
                    ].map((card, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center w-full sm:w-75 md:w-120">
                        <h2 className="text-center text-black text-2xl md:text-3xl font-bold drop-shadow-lg mb-4 px-2">
                            {card.title}
                        </h2>
                        <a href={card.href}
                            className="relative w-full h-100 md:h-130 md:w-100 border-2 border-black rounded-2xl cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center">
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