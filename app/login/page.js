"use client";

import Image from "next/image";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Invalid username or password");
      setSuccess(false);
    } else {
      setError("");
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-800">
      <NavBar />
      <div id="LoginPage" className="p-6">
        <div className="p-10 rounded-lg w-full flex flex-col items-center ">
          <div className="relative p-2 rounded-lg w-full h-50 ">
            <Image
              className="object-contain"
              src="/welcome-lasa.png"
              alt="Welcome to LASA"
              fill
            />
          </div>
          <form className="w-full max-w-md" onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-[#1f263f]">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 justify-center items-center">
              <label htmlFor="password" className="block text-[#1f263f]">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border border-gray-300 rounded mt-1"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && (
              <p className="text-green-500 mb-2">✅ Logged in successfully!</p>
            )}
            <div className="flex flex-col gap-1 justify-center items-center">
              <button
                type="submit"
                className="w-[var(--size)] bg-[#f8f9fa] text-black px-4 py-2 rounded border-2 border-black hover:bg-[var(--color-cyan-300)] transition text-center"
              >
                Login
              </button>
              <p className="mt-4 text-gray-600">
                Don't have an account?{" "}
                <a href="/register" className="text-blue-500 hover:underline">
                  Register here
                </a>.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
