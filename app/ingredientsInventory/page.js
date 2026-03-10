"use client";

import LoggedInNavBar from "../components/LoggedInNavBar";
import { useState, useEffect } from "react";
import MeasurementUnitPicker from "../components/MeasurementUnitPicker";

// Parsing fractions to decimal
function parseQuantity(input) {
  input = input.trim();
  if (!input) return NaN;

  const mixedMatch = input.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [, whole, num, denom] = mixedMatch;
    return parseInt(whole) + parseInt(num) / parseInt(denom);
  }

  const fracMatch = input.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const [, num, denom] = fracMatch;
    return parseInt(num) / parseInt(denom);
  }

  const val = parseFloat(input);
  return isNaN(val) ? NaN : val;
}

// Format decimal quantities back to mixed fractions for display
function formatQuantity(qty) {
  if (qty === null || qty === undefined) return { text: "", isFraction: false };

  const whole = Math.floor(qty);
  const fractionDecimal = qty - whole;

  if (fractionDecimal === 0) return { text: whole.toString(), isFraction: false };

  const denominators = [2, 3, 4, 8];
  let bestNumer = 0;
  let bestDenom = 1;
  let minDiff = Infinity;

  for (let d of denominators) {
    const n = Math.round(fractionDecimal * d);
    const diff = Math.abs(fractionDecimal - n / d);
    if (diff < minDiff) {
      minDiff = diff;
      bestNumer = n;
      bestDenom = d;
    }
  }

  if (bestNumer === 0) return { text: whole.toString(), isFraction: false };
  if (bestNumer === bestDenom) return { text: (whole + 1).toString(), isFraction: false };

  const fractionText = whole === 0 ? `${bestNumer}/${bestDenom}` : `${whole} ${bestNumer}/${bestDenom}`;
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
  const [isLoading, setLoading] = useState(false);

  useEffect(() => { fetchInventory(); }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/inventory");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInventory(data.map(item => ({
        ...item,
        ingredient_quantity: parseFloat(item.ingredient_quantity)
      })));
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

    const inputQty = parseQuantity(quantity);
    if (isNaN(inputQty) || inputQty <= 0) return setError("Quantity must be positive");

    setLoading(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredient_id: selectedIngredient.ingredient_id,
          ingredient_name: selectedIngredient.ingredient_name,
          quantity: inputQty,
          measure: unit
        })
      });
      if (!res.ok) throw new Error();

      await fetchInventory();

      setSearch(""); setQuantity(""); setSelectedIngredient(null); setIngredientResults([]);
    } catch {
      setError("Error adding/updating ingredient");
    } finally {
      setLoading(false);
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
      await fetchInventory();
    } catch {
      setError("Failed to clear inventory.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <LoggedInNavBar />
      <div className="relative w-full px-4 py-6 sm:px-6 lg:px-10 flex flex-col items-center">

        {/* Search */}
        <div className="relative w-full max-w-xl mb-4">
          <input type="text" placeholder="Search ingredients..." value={search} onChange={handleSearch}
            className="w-full p-2 border-2 border-[#1f263f] rounded-2xl text-center bg-white" />
          {ingredientResults.length > 0 &&
            <div className="absolute top-full left-0 w-full bg-white border-2 border-[#1f263f] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
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
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center items-stretch sm:items-start w-full max-w-5xl p-2 sm:p-4 gap-3 sm:gap-4">
          <input type="text" placeholder="Ingredient" value={search} readOnly
            className="w-full sm:w-64 md:w-72 p-2 border-2 border-[#1f263f] rounded-xl text-center bg-white" />
          <input type="text" placeholder="Quantity" value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="w-full sm:w-36 p-2 border-2 border-[#1f263f] rounded-xl text-center bg-white" />
          <MeasurementUnitPicker
            value={unit}
            onChange={setUnit}
            wrapperClassName="relative w-full sm:w-32"
            inputClassName="w-full sm:w-32 p-2 border-2 border-[#1f263f] rounded-xl text-center bg-white"
            dropdownClassName="absolute z-20 mt-1 w-full sm:w-44 max-h-44 overflow-y-auto custom-scrollbar bg-white border-2 border-[#1f263f] rounded-xl shadow-lg"
          />
          <button onClick={handleAddIngredient} disabled={isLoading}
            className="bg-[#1f263f] text-[#f8f9fa] px-5 py-2 rounded-xl hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#1f263f]">
            {isLoading ? "Adding..." : "Add Ingredient"}
          </button>
          <button onClick={handleClearAll}
            className="bg-[#003049] text-[#f8f9fa] px-5 py-2 rounded-xl hover:bg-cyan-300 transition-colors">
            Clear All
          </button>
        </div>

        {/* Inventory */}
        <div className="flex justify-center items-center w-full p-2 sm:p-4">
          <div className="relative flex flex-col items-center border-2 border-[#1f263f] rounded-2xl w-full max-w-6xl min-h-[28rem] max-h-[70vh] p-4 sm:p-6 gap-4">
            <h1 className="text-[#003049] text-2xl md:text-3xl font-bold drop-shadow-lg">
              Ingredients | Quantity
            </h1>

            {inventory.length === 0
              ? <p className="text-gray-500">No ingredients added yet.</p>
              : <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto auto-rows-max gap-3 w-full h-full pr-1">
                  {inventory.map(item => {
                    const { text, isFraction } = formatQuantity(item.ingredient_quantity);
                    return (
                      <li key={item.ingredient_id} className={`p-2 rounded-lg text-center relative ${isFraction ? 'bg-yellow-100' : 'bg-gray-100'}`}>
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
                            await fetchInventory();
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