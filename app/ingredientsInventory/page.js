import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <LoggedInNavBar />
            {/* Dashboard Welcome Image */}
            <div className="relative p-10 rounded-lg w-full flex flex-col items-center ">
                
                {/* Search Bar */}
                <input type="text" placeholder="Search ingredients..." className="w-150 p-2 border-2 border-black rounded-4xl mb-4 text-center" />

                <div className="flex flex-col md:flex-row flex-wrap justify-center items-start w-full p-4 gap-6">
                  <input type="text" placeholder="Ingredient" className="w-80 p-2 border-2 border-black rounded-xl mb-4 text-center" />
                  <input type="text" placeholder="Quantity" className="w-40 p-2 border-2 border-black rounded-xl mb-4 text-center" />
                  <button className="bg-gray-700 text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition-colors">Add Ingredient</button>
                </div>
                <div className="flex justify-center items-center w-full p-4 gap-6">
                  <div className="relative flex flex-col items-center border-2 rounded-xl w-350 h-120 p-4 gap-4">
                    <h1 className="text-[#003049] text-2xl md:text-3xl font-bold drop-shadow-lg">
                      Ingredients | Quantity
                    </h1>
                    <ul className="grid auto-flow-row grid-cols-[repeat(auto-fill,minmax(200px,1fr))] overflow-auto auto-rows-max gap-x-8 gap-y-2 w-full h-full">
                      <li>Tomatoes - 5</li>
                      <li>Onions - 3</li>
                      <li>Garlic - 10 cloves</li>
                      <li>Salt - 1 tsp</li>
                      <li>Pepper - 1 tsp</li>
                      <li>Carrots - 2</li>
                      <li>Chicken - 1kg</li>
                      <li>Oil - 2 tbsp</li>
                      <li>Butter - 1 tbsp</li>
                      <li>Tomatoes - 5</li>
                      <li>Onions - 3</li>
                      <li>Garlic - 10 cloves</li>
                      <li>Salt - 1 tsp</li>
                      <li>Pepper - 1 tsp</li>
                      <li>Carrots - 2</li>
                      <li>Chicken - 1kg</li>
                      <li>Oil - 2 tbsp</li>
                      <li>Butter - 1 tbsp</li>
                      <li>Tomatoes - 5</li>
                      <li>Onions - 3</li>
                      <li>Garlic - 10 cloves</li>
                      <li>Salt - 1 tsp</li>
                      <li>Pepper - 1 tsp</li>
                      <li>Carrots - 2</li>
                      <li>Chicken - 1kg</li>
                      <li>Oil - 2 tbsp</li>
                      <li>Butter - 1 tbsp</li>
                      <li>Tomatoes - 5</li>
                      <li>Onions - 3</li>
                      <li>Garlic - 10 cloves</li>
                      <li>Salt - 1 tsp</li>
                      <li>Pepper - 1 tsp</li>
                      <li>Carrots - 2</li>
                      <li>Chicken - 1kg</li>
                      <li>Oil - 2 tbsp</li>
                      <li>Butter - 1 tbsp</li> 
                    </ul>
                </div>
              </div>
            </div>
        </div>
    );
}