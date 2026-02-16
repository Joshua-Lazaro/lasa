import Image from "next/image";
import LoggedInNavBar from "../components/LoggedInNavBar";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-white text-gray-800">
            <LoggedInNavBar />
            <h1>Own Recipes</h1>
        </div>
    );
}