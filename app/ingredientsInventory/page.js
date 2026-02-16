import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <NavBar />
            <h1>Ingredients Inventory</h1>
        </div>
    );
}