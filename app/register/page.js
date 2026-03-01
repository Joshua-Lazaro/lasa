"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialForm = {
    username: "",
    password: "",
    user_firstname: "",
    user_middlename: "",
    user_lastname: "",
    gender: "",
    date_of_birth: "",
    user_type: "",
};

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    gender: Number(formData.gender),
                    user_type: Number(formData.user_type),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to create account");
            }

            setSuccess("Account created successfully! Redirecting to login...");
            setFormData(initialForm);
            setTimeout(() => router.push("/login"), 1200);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] text-[#1f263f]">
            <NavBar />

            <div className="p-6">
                <div className="p-6 md:p-10 rounded-lg w-full flex flex-col items-center">
                    <div className="relative p-2 rounded-lg w-full h-44 md:h-50 max-w-xl">
                        <Image
                            className="object-contain"
                            src="/lasa-logo.png"
                            alt="Create LASA Account"
                            fill
                        />
                    </div>

                    <form
                        className="w-full max-w-3xl rounded-2xl p-6 md:p-8 bg-white"
                        onSubmit={handleSubmit}
                    >
                        <h1 className="text-2xl md:text-3xl font-bold text-[#003049] mb-6 text-center">
                            Create Account
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="user_firstname"
                                value={formData.user_firstname}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="First name"
                                required
                            />
                            <input
                                type="text"
                                name="user_middlename"
                                value={formData.user_middlename}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Middle name (optional)"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                name="user_lastname"
                                value={formData.user_lastname}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Last name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="" disabled>
                                    Gender
                                </option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="3">Other</option>
                            </select>

                            <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            />

                            <select
                                name="user_type"
                                value={formData.user_type}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                required
                            >
                                <option value="" disabled>
                                    User Type
                                </option>
                                <option value="1">Beginner</option>
                                <option value="2">Home Cook</option>
                                <option value="3">Enthusiast</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Username"
                                required
                            />
                            <div className="relative w-full">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full p-2 pr-10 border border-gray-300 rounded"
                                    placeholder="Password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-0 px-3 text-[#1f263f]"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            Password must be at least 8 characters with uppercase, lowercase, number, and special character.
                        </p>

                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {success && <p className="text-green-600 mb-4">{success}</p>}

                        <div className="flex flex-col gap-2 justify-center items-center">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#1f263f] text-[#f8f9fa] px-6 py-2 rounded-xl hover:bg-cyan-300 transition disabled:opacity-60"
                            >
                                {isSubmitting ? "Creating..." : "Create Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}