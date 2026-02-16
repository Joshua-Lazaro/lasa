"use client";
import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function IngredientsInventory() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <NavBar />
      <h1 className="text-2xl font-bold mb-4">Ingredients Inventory</h1>

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() =>
          signIn("credentials", {
            username: "admin",
            password: "1234",
            callbackUrl: "/searchRecipes",
          })
        }
      >
        Login
      </button>
    </div>
  );
}
