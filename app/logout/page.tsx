"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logout() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                "/api/logout",
                {},
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                },
            );

            if (response.status === 200) {
                // Clear local storage
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                // Redirect to login page or home page
                router.push("/login"); // Adjust this path as needed
            } else {
                throw new Error("Logout failed");
            }
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "An error occurred during logout"
                    : "An error occurred during logout",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50 transition-colors duration-200"
            >
                {loading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
}
