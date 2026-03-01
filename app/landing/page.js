"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
    const [stats, setStats] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [statsError, setStatsError] = useState("");

    const carousel = [
        "/recipeImages/1.jpg",
        "/recipeImages/2.jpg",
        "/recipeImages/3.jpg",
        "/recipeImages/4.jpg",
        "/recipeImages/5.jpg",
        "/recipeImages/15.jpg"
    ];

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
            <div id="landing-page" className="flex flex-col gap-0">
                <div className="relative w-auto h-150 sm:h-155 mb-10 overflow-hidden"> 
                    <div className="bg-black opacity-80 w-full h-full">
                        <Image 
                            className="w-full h-full object-cover object-left sm:object-center-top shadow-md sm:w-full sm:h-96"
                            src="/lasa-landing.png"
                            alt="Filipino cuisine."
                            fill
                        />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-start pl-5 pt-12 sm:pl-10 sm:pt-5"> {/* Text infront image */}
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
                
                <div id="container">
                    <div className="w-auto m-1 sm:m-10"> {/* Who is it for section -placeholder */}
                        <h1>
                            Who is Lasa for?
                        </h1>
                        <div className="w-auto">
                            <ul>
                                <li>
                                    <p>
                                        Enjoy a collection of step-by-step recipes that make mastering Pinoy flavors easy and stress-free.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Get personalized suggestions based on your inventory to stop wasting food and make the most of what you have.
                                    </p>
                                </li>
                                <li>
                                    <p>
                                        Keep your favorite recipes organized and find fresh inspiration for what to cook next.
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/** FEATURES */}
                    <div className="w-full h-auto">
                        <h1 className="text-2xl font-bold text-center pt-5 pb-5 sm:text-3xl sm:p-15">Cook and Record Recipes</h1>
                        <div className="flex flex-col items-center h-auto justify-center gap-10 sm:flex-row sm:gap-40">
                            <div className="bg-white rounded-2xl shadow-md h-90 flex flex-col w-75 items-center justify-center gap-5">
                                <div className="relative w-full h-30">
                                    <Image
                                        src="/aiSmartSuggest.png"
                                        alt="Filipino cuisine."
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-5">
                                    <h1>AI Suggestion</h1>
                                    <p className="text-center">Lasa's AI suggests recipes based on your inventory</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md h-90 flex flex-col w-70 items-center justify-center gap-5">
                                <div className="relative w-full h-30">
                                    <Image
                                        src="/aiSmartSuggest.png"
                                        alt="Filipino cuisine."
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-5">
                                    <h1>Ingredient Inventory</h1>
                                    <p className="text-center">Users can input what ingredients they have to enable ai suggestions</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-md h-90 flex flex-col w-70 items-center justify-center gap-5">
                                <div className="relative w-full h-30">
                                    <Image
                                        src="/aiSmartSuggest.png"
                                        alt="Filipino cuisine."
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                                <div className="flex flex-col items-center justify-center gap-5">
                                    <h1>Recipe Keeper</h1>
                                    <p className="text-center">Lasa allows users to record their own recipes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full h-auto">
                        <div className="flex flex-col items-center h-auto justify-center gap-10 sm:flex-row sm:gap-40"></div>
                        <div className="p-10 w-full sm:p-10 " onHover> {/** CTA - PLACEHOLDER*/}
                            <p>Join others in LASA</p>
                            <Link href="/login">
                                <button className="bg-bg-cyan-300">Hungry for inspiration?</button>
                            </Link>
                        </div>
                    </div>

                    {/** Image showcase */}
                    <div className="h-full w-full gap-6 px-4 p-6 items-center justify-center bg-[url('/checkered-bg.png')] bg-repeat">
                       <div className="w-full h-auto overflow-x-auto sm:overflow-x-hidden sm:overflow-y-hidden">
                            <div className="flex flex-row gap-1 h-70 w-full sm:h-100">
                                {carousel.map((imgPath, index) => (
                                <div key={index} className={'relative w-20 h-70 sm:h-100 sm:w-[55%] lg:w-[30%] aspect-2/4 rounded-2xlcursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center animate-reveal'}>
                                    <Image
                                    src={imgPath}
                                    alt={`Carousel Image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                                 ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="h-auto w-full px-6 pt-10 pb-16 ">
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

                <div> {/** To do: FINAL CTA */}

                </div>

            </div>
        </div>
    );
}