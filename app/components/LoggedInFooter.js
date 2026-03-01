
import Link from "next/link";

export default function LoggedInFooter() {
    return (
        <footer className="bottom-0 bg-linear-to-r from-[#1f263f] to-cyan-300 text-white p-6 mt-10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                {/* Copyright */}
                <p>&copy; 2026 LASA. All rights reserved.</p>

                {/* Essential Links */}
                <div className="flex gap-6">
                <a href="/dashboard" className="hover:text-gray-300">Dashboard</a>
                <a href="/profile" className="hover:text-gray-300">Profile</a>
                <a href="/api/auth/signout" className="hover:text-gray-300">Logout</a>
                </div>
            </div>
        </footer>
    );
}