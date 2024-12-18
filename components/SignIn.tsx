"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as jose from "jose";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const api = axios.create({
        baseURL: "/api",
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                if (accessToken) {
                    const isValid = await verifyToken(accessToken);
                    if (isValid) {
                        router.push("/");
                    } else {
                        throw new Error("Invalid access token");
                    }
                }
            } catch (error) {
                console.error("Auth check error:", error);
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }
        };
        checkAuth();
    }, [router]);

    const verifyToken = async (token: string) => {
        try {
            const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);
            await jose.jwtVerify(token, secret);
            return true;
        } catch (error) {
            console.error("Token verification error:", error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }
        setIsLoading(true);
        try {
            const response = await api.post("/login", { email, password });
            console.log("Login response:", response.data);
            const { setAccessToken, setRefreshToken } = response.data;
            if (setAccessToken && setRefreshToken) {
                localStorage.setItem("accessToken", setAccessToken);
                localStorage.setItem("refreshToken", setRefreshToken);
            } else {
                throw new Error("Invalid response: Missing tokens");
            }
            router.push("/");
        } catch (error) {
            console.error("Login error:", error);
            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message || "Invalid credentials"
                    : "Something went wrong. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center  items-center p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                <h2 className="mb-6 text-center text-black text-3xl font-bold">
                    Sign In
                </h2>
                {error && (
                    <div
                        className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-500"
                        role="alert"
                    >
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={isPasswordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            >
                                {isPasswordVisible ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
