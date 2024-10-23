"use client";

import { useState } from "react";

interface Member {
    id: string;
    maxAmount: string;
    restAmount: string;
}

interface CreateGroupData {
    name: string;
    adminBudget: string;
    members: Member[];
}

export default function CreateGroup() {
    const [groupData, setGroupData] = useState<CreateGroupData>({
        name: "",
        adminBudget: "",
        members: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (index: number, field: keyof Member, value: string) => {
        setGroupData((prev) => {
            const newMembers = [...prev.members];
            newMembers[index] = { ...newMembers[index], [field]: value };
            return { ...prev, members: newMembers };
        });
    };

    const addMember = () => {
        setGroupData((prev) => ({
            ...prev,
            members: [...prev.members, { id: "", maxAmount: "", restAmount: "" }],
        }));
    };

    const removeMember = (index: number) => {
        setGroupData((prev) => ({
            ...prev,
            members: prev.members.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch("/api/createGroup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    accessToken: localStorage.getItem("accessToken") || "",
                    refreshToken: localStorage.getItem("refreshToken") || "",
                },
                body: JSON.stringify({
                    createGroup: {
                        name: groupData.name,
                        adminBudget: parseFloat(groupData.adminBudget),
                        members: groupData.members.map((member) => ({
                            ...member,
                            maxAmount: parseFloat(member.maxAmount),
                            restAmount: parseFloat(member.restAmount),
                        })),
                    },
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create group");
            }

            setSuccess(true);
            setGroupData({ name: "", adminBudget: "", members: [] });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl  bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && (
                <p className="text-green-500 mb-4">Group created successfully!</p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="   Group Name"
                        value={groupData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full py-2.5 rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <input
                        type="number"
                        id="adminBudget"
                        name="adminBudget"
                        placeholder="   Admin Budget"
                        value={groupData.adminBudget}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block py-2.5 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Members</h3>
                    {groupData.members.map((member, index) => (
                        <div key={index} className="flex space-x-2 mb-2">
                            <input
                                type="text"
                                placeholder="Member ID"
                                value={member.id}
                                onChange={(e) =>
                                    handleMemberChange(index, "id", e.target.value)
                                }
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <input
                                type="number"
                                placeholder="Max Amount"
                                value={member.maxAmount}
                                onChange={(e) =>
                                    handleMemberChange(index, "maxAmount", e.target.value)
                                }
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <input
                                type="number"
                                placeholder="Rest Amount"
                                value={member.restAmount}
                                onChange={(e) =>
                                    handleMemberChange(
                                        index,
                                        "restAmount",
                                        e.target.value,
                                    )
                                }
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addMember}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                        Add Member
                    </button>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                >
                    {loading ? "Creating..." : "Create Group"}
                </button>
            </form>
        </div>
    );
}
