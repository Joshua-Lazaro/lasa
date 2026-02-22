"use client";

import LoggedInNavBar from "../components/LoggedInNavBar";
import { useState, useEffect } from "react";

// Helper: parse user input like "1/2", "2 1/2", or "3" into decimal
function parseQuantity(input) {
  input = input.trim();
  if (!input) return NaN;

  // Matches "whole fraction" like "2 1/2"
  const mixedMatch = input.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [, whole, num, denom] = mixedMatch;
    return parseInt(whole) + parseInt(num) / parseInt(denom);
  }

  // Matches simple fraction like "3/4"
  const fracMatch = input.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const [, num, denom] = fracMatch;
    return parseInt(num) / parseInt(denom);
  }

  // Otherwise try parse as decimal/whole number
  const val = parseFloat(input);
  return isNaN(val) ? NaN : val;
}

// Convert decimal → fraction/whole number for display
function formatQuantity(qty) {
  if (qty === null || qty === undefined) return "";
  const roundedQty = Math.round(qty * 16) / 16;
  if (Number.isInteger(roundedQty)) return { text: roundedQty.toString(), isFraction: false };

  const commonDenominators = [2, 3, 4, 8, 16];
  const whole = Math.floor(roundedQty);
  const fractionDecimal = roundedQty - whole;

  let bestNumerator = 0;
  let bestDenominator = 1;
  let minDiff = Infinity;

  for (let denom of commonDenominators) {
    const numer = Math.round(fractionDecimal * denom);
    const diff = Math.abs(fractionDecimal - numer / denom);
    if (diff < minDiff) {
      minDiff = diff;
      bestNumerator = numer;
      bestDenominator = denom;
    }
  }

  if (bestNumerator === 0) return { text: whole.toString(), isFraction: false };
  if (bestNumerator === bestDenominator) return { text: (whole + 1).toString(), isFraction: false };

  const fractionText = whole === 0 ? `${bestNumerator}/${bestDenominator}` : `${whole} ${bestNumerator}/${bestDenominator}`;
  return { text: fractionText, isFraction: true };
}

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [ingredientResults, setIngredientResults] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [error, setError] = useState("");

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data);
    } catch {
      setError("Could not load inventory.");
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.length > 1) {
      try {
        const res = await fetch(`/api/ingredients?q=${value}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setIngredientResults(data);
      } catch {
        setError("Ingredient search failed");
      }
    } else setIngredientResults([]);
  };

  const handleAddIngredient = async () => {
    setError("");
    if (!selectedIngredient) return setError("Select an ingredient");
    if (!quantity) return setError("Enter quantity");

    const qtyNumber = parseQuantity(quantity);
    if (isNaN(qtyNumber) || qtyNumber <= 0) return setError("Quantity must be positive");

    const existing = inventory.find(i => i.ingredient_id === selectedIngredient.ingredient_id);
    const newQuantity = existing ? existing.ingredient_quantity + qtyNumber : qtyNumber;

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient_id: selectedIngredient.ingredient_id,
          ingredient_name: selectedIngredient.ingredient_name,
          quantity: newQuantity,
          increment: unit
        })
      });
      if (!res.ok) throw new Error();

      setInventory(prev => {
        if (existing) {
          return prev.map(i => i.ingredient_id === existing.ingredient_id
            ? { ...i, ingredient_quantity: newQuantity, ingredient_measure: unit }
            : i
          );
        }
        return [...prev, { ingredient_id: selectedIngredient.ingredient_id, ingredient_name: selectedIngredient.ingredient_name, ingredient_quantity: qtyNumber, ingredient_measure: unit }];
      });

      setSearch(""); setQuantity(""); setSelectedIngredient(null); setIngredientResults([]);
    } catch {
      setError("Error adding/updating ingredient");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all ingredients?")) return;
    try {
      const res = await fetch("/api/inventory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true })
      });
      if (!res.ok) throw new Error();
      setInventory([]);
    } catch {
      setError("Failed to clear inventory.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />
      <div className="relative p-10 rounded-lg w-full flex flex-col items-center">

        {/* Search */}
        <div className="relative w-150 mb-4">
          <input type="text" placeholder="Search ingredients..." value={search} onChange={handleSearch}
            className="w-full p-2 border-2 border-black rounded-4xl text-center" />
          {ingredientResults.length > 0 &&
            <div className="absolute top-full left-0 w-full bg-white border border-black rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
              {ingredientResults.map(item => (
                <div key={item.ingredient_id} className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => { setSelectedIngredient(item); setSearch(item.ingredient_name); setIngredientResults([]); }}>
                  {item.ingredient_name}
                </div>
              ))}
            </div>
          }
        </div>

        {error && <div className="text-red-600 font-semibold mb-4">{error}</div>}

        {/* Input */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center items-start w-full p-4 gap-6">
          <input type="text" placeholder="Ingredient" value={search} readOnly
            className="w-80 p-2 border-2 border-black rounded-xl mb-4 text-center" />
          <input type="text" placeholder="Quantity" value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-40 p-2 border-2 border-black rounded-xl mb-4 text-center" />
          <select value={unit} onChange={e => setUnit(e.target.value)}
            className="w-32 p-2 border-2 border-black rounded-xl mb-4 text-center">
            <option value="pcs">pcs</option>
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="ml">ml</option>
            <option value="l">l</option>
          </select>
          <button onClick={handleAddIngredient}
            className="bg-gray-700 text-white px-5 py-2 rounded-xl hover:bg-gray-900 transition-colors">
            Add Ingredient
          </button>
          <button onClick={handleClearAll}
            className="bg-blue-400 text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition-colors">
            Clear All
          </button>
        </div>

        {/* Inventory */}
        <div className="flex justify-center items-center w-full p-4 gap-6 -mt-6">
          <div className="relative flex flex-col items-center border-2 rounded-xl w-350 h-120 p-4 gap-4">
            <h1 className="text-[#003049] text-2xl md:text-3xl font-bold drop-shadow-lg">
              Ingredients | Quantity
            </h1>

            {inventory.length === 0
              ? <p className="text-gray-500">No ingredients added yet.</p>
              : <ul className="grid auto-flow-row grid-cols-[repeat(auto-fill,minmax(200px,1fr))] overflow-auto auto-rows-max gap-x-8 gap-y-2 w-full h-full">
                  {inventory.map(item => {
                    const { text, isFraction } = formatQuantity(item.ingredient_quantity);
                    return (
                      <li key={item.ingredient_id} className={`bg-gray-100 p-2 rounded-lg text-center relative ${isFraction ? 'bg-yellow-100' : ''}`}>
                        <span className="font-semibold">{item.ingredient_name}</span><br />
                        {text} {item.ingredient_measure}
                        <button onClick={async () => {
                          try {
                            const res = await fetch("/api/inventory", {
                              method: "DELETE",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ ingredient_id: item.ingredient_id })
                            });
                            if (!res.ok) throw new Error();
                            setInventory(prev => prev.filter(i => i.ingredient_id !== item.ingredient_id));
                          } catch {
                            setError("Failed to delete ingredient.");
                          }
                        }}
                        className="absolute top-1 right-1 text-red-600 font-bold hover:text-red-800">×</button>
                      </li>
                    );
                  })}
                </ul>
            }
          </div>
        </div>
      </div>
    </div>
  );
}