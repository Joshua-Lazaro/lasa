"use client";
import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function IngredientsInventory() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <LoggedInNavBar />
      <h1 className="text-2xl font-bold mb-4">Ingredients Inventory</h1>
    </div>
  );
}
