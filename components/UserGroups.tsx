"use client";

import { useEffect, useState } from "react";

interface Group {
    id: string;
    name: string;
}

interface GroupData {
    group: Group;
}

export default function UserGroups() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch("/api/getGroups", {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user groups");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    setGroups(data.map((item: GroupData) => item.group));
                } else if (data.message) {
                    setGroups([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) {
        return (
            <div className="w-full max-w-md  bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
                <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                        <div
                            key={index}
                            className="h-8 bg-gray-200 rounded animate-pulse"
                        ></div>
                    ))}
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
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
            {groups.length > 0 ? (
                <ul className="space-y-2">
                    {groups.map((group) => (
                        <li
                            key={group.id}
                            className="bg-gray-100 rounded p-3 flex justify-between items-center"
                        >
                            <span className="font-medium">{group.name}</span>
                            <span className="text-sm text-gray-500">ID: {group.id}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">You are not in any group.</p>
            )}
        </div>
    );
}
