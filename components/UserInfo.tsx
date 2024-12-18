"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface UserInfo {
    id: string;
    userName: string;
    name: string;
    email: string;
    avatar_url: string;
}

export default function UserInfo() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get("/api/whoAmI", {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                });

                setUserInfo(response.data.userInformation);
            } catch (err) {
                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message || "An error occurred"
                        : "An error occurred",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-md  bg-white shadow-md rounded-lg p-6 my-auto">
                <h2 className="text-2xl font-bold mb-4">User Information</h2>
                <div className="space-y-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Error</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6 my-auto">
            <h2 className="text-2xl font-bold mb-4">User Information</h2>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        {userInfo?.avatar_url ? (
                            <img
                                src={userInfo.avatar_url}
                                alt={userInfo.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-xl font-bold text-gray-500">
                                {userInfo?.name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{userInfo?.name}</p>
                        <p className="text-sm text-gray-500">@{userInfo?.userName}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-500">{userInfo?.email}</p>
                </div>
                <div>
                    <p className="text-sm font-medium">User ID</p>
                    <p className="text-sm text-gray-500">{userInfo?.id}</p>
                </div>
            </div>
        </div>
    );
}
