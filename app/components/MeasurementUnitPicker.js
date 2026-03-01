"use client";

import { useMemo, useState } from "react";

const MEASUREMENT_OPTIONS = [
  "pcs", "piece", "pieces", "serving", "pinch", "dash", "drop", "sprig", "leaf", "clove", "slice", "strip", "stalk", "bunch",
  "teaspoon", "tsp", "tablespoon", "tbsp", "dessertspoon",
  "cup", "fl oz", "fluid ounce", "pint", "pt", "quart", "qt", "gallon", "gal",
  "milliliter", "ml", "centiliter", "cl", "deciliter", "dl", "liter", "l",
  "milligram", "mg", "gram", "g", "kilogram", "kg", "ounce", "oz", "pound", "lb",
  "inch", "in", "centimeter", "cm", "millimeter", "mm",
  "can", "tin", "jar", "bottle", "packet", "pack", "sachet", "box", "bag",
  "head", "fillet", "whole", "cube", "stick", "sheet", "roll",
];

function getUnitScore(option, query) {
  const normalizedOption = option.toLowerCase();
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) return 0;
  if (normalizedOption === normalizedQuery) return 1000;
  if (normalizedOption.startsWith(normalizedQuery)) return 700 - normalizedOption.length;

  const includesIndex = normalizedOption.indexOf(normalizedQuery);
  if (includesIndex >= 0) return 400 - includesIndex;

  return 0;
}

function getClosestUnits(query) {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return [...MEASUREMENT_OPTIONS].sort((a, b) => a.localeCompare(b));
  }

  return MEASUREMENT_OPTIONS
    .map((option) => ({ option, score: getUnitScore(option, normalizedQuery) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.option.localeCompare(b.option))
    .map((item) => item.option);
}

export default function MeasurementUnitPicker({
  value,
  onChange,
  placeholder = "unit",
  wrapperClassName = "relative w-24",
  inputClassName = "w-24 p-2 border-2 border-black rounded-xl text-center bg-white",
  dropdownClassName = "absolute z-20 mt-1 w-36 max-h-44 overflow-y-auto custom-scrollbar bg-white border-2 border-black rounded-xl shadow-lg",
  maxResults = 60,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const closestUnits = useMemo(() => getClosestUnits(value || ""), [value]);

  return (
    <div className={wrapperClassName}>
      <input
        type="text"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 120)}
        className={inputClassName}
        placeholder={placeholder}
      />

      {isOpen && (
        <div className={dropdownClassName}>
          {closestUnits.slice(0, maxResults).map((option) => (
            <button
              type="button"
              key={option}
              onMouseDown={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-cyan-100 transition"
            >
              {option}
            </button>
          ))}
          {closestUnits.length === 0 && (
            <p className="px-3 py-2 text-sm text-gray-500">No matching unit</p>
          )}
        </div>
      )}
    </div>
  );
}
