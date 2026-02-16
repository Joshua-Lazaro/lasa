import Image from "next/image";
import NavBar from "../components/NavBar";
import SearchBar from "../components/SearchBar";
import Link from "next/link";

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <NavBar />
            <div className ="relative p-10 rounded-lg w-full flex flex-col items-center mt-10">
                 <SearchBar />
            </div>
           
        </div>
    );
}