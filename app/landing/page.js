"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [stats, setStats] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [statsError, setStatsError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("/api/register", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error || "Failed to load user statistics");
                }

                const orderMap = { Beginner: 1, "Home Cook": 2, Enthusiast: 3 };
                const cleanedStats = (Array.isArray(data.stats) ? data.stats : [])
                    .filter((item) => Number(item.count) > 0)
                    .sort((a, b) => {
                        const rankA = orderMap[a.label] ?? 99;
                        const rankB = orderMap[b.label] ?? 99;
                        return rankA - rankB;
                    });

                setStats(cleanedStats);
                setTotalUsers(Number(data.total_users || 0));
            } catch (err) {
                setStatsError(err.message);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
            <NavBar />
            <div id="landing-page" className="">
                <div className="relative w-auto h-155 mb-50  overflow-hidden">
                    <div className="bg-black opacity-80 w-full h-full">
                        <Image 
                            className="w-full h-48 object-cover object-left shadow-md sm:w-full sm:h-96"
                            src="/lasa-landing.png"
                            alt="Filipino cuisine."
                            fill
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-start pl-5 sm:pl-3"> {/* Image behind text */}
                        <div className="p-4 flex flex-col items-start text-left">
                            <div className="rounded flex flex-col items-start text-left space-y-3">
                                <h1 className="text-[#1f263f] text-4xl font-bold drop-shadow-lg mb-10">
                                    Discover the Rich Flavors of Filipino Cuisine
                                </h1>
                                <p className="text-[#1f263f] w-2/3 sm:w-2/4 drop-shadow-lg">
                                    Explore a world of vibrant flavors, unique ingredients, and rich culinary traditions with our Filipino recipe website. From classic dishes to modern twists, we bring you the best of Filipino cuisine right at your fingertips.
                                </p>
                                <div className="flex flex-col gap-4 sm:flex-row sm:gap-10 mt-10">
                                    <Link href="/login">
                                        <button className="w-(--size) px-6 py-2 bg-[#1f263f] text-[#f8f9fa] rounded-xl hover:bg-cyan-300 transition">
                                            Sign In
                                        </button>
                                    </Link>
                                    <Link href="/register">
                                        <button className="px-6 py-2 bg-cyan-300 text-gray-100 rounded-xl hover:bg-blue-700 transition">
                                            Create Account
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-6 pb-16 -mt-36">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-[#003049] text-2xl md:text-3xl font-bold text-center mb-2">
                            Community User Types
                        </h2>
                        <p className="text-center text-[#1f263f] mb-8">
                            Total Users: {totalUsers}
                        </p>

                        {statsError ? (
                            <p className="text-center text-red-500">{statsError}</p>
                        ) : stats.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {stats.map((item) => (
                                    <div
                                        key={item.user_type}
                                        className="rounded-2xl bg-white p-6 text-center shadow-md"
                                    >
                                        <h3 className="text-xl font-bold text-[#003049]">{item.label}</h3>
                                        <p className="mt-2 text-[#1f263f]">Users: {item.count}</p>
                                        <p className="text-[#1f263f]">Percentage: {item.percentage}%</p>
                                    </div>
                                ))}
                            </div>
                        ) : null
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}