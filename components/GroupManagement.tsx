"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Users, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import GroupTransactions from "@/components/GroupTransection";

interface Member {
    id: string;
    maxAmount: string;
    restAmount: string;
}

interface Group {
    id: string;
    name: string;
    memberCount?: number;
}

interface GroupData {
    group: Group;
}

export default function GroupManagement() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [createGroupData, setCreateGroupData] = useState({
        name: "",
        adminBudget: "",
        members: [] as Member[],
    });
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await axios.get("/api/getGroups", {
                headers: {
                    accessToken: localStorage.getItem("accessToken") || "",
                    refreshToken: localStorage.getItem("refreshToken") || "",
                },
            });

            if (Array.isArray(response.data)) {
                setGroups(
                    response.data.map((item: GroupData) => ({
                        ...item.group,
                        memberCount: Math.floor(Math.random() * 10) + 5, // Temporary: Replace with actual member count
                    })),
                );
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await axios.post(
                "/api/createGroup",
                {
                    createGroup: {
                        name: createGroupData.name,
                        adminBudget: parseFloat(createGroupData.adminBudget),
                        members: createGroupData.members.map((member) => ({
                            ...member,
                            maxAmount: parseFloat(member.maxAmount),
                            restAmount: parseFloat(member.restAmount),
                        })),
                    },
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                },
            );

            await fetchGroups(); // Refresh groups list
            setCreateGroupData({ name: "", adminBudget: "", members: [] });
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="min-h-screen  text-white flex items-center justify-center">
            <div className="w-full max-w-7xl">
                {/* Fixed header with groups */}
                <div className="sticky top-0 z-10  shadow-md">
                    <div className="max-w-7xl mx-auto px-4">
                        <h1 className="text-2xl font-bold py-4">Your Groups</h1>
                        <ScrollArea className="w-full whitespace-nowrap rounded-md border border-[#2D3648]">
                            <div className="flex space-x-4 p-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="flex-shrink-0 w-24 h-24 rounded-lg bg-[#2D3648] flex flex-col items-center justify-center gap-2 hover:bg-[#3A4358] transition-colors cursor-pointer">
                                            <Plus className="w-8 h-8" />
                                            <span className="text-xs">Create Group</span>
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-[#1A1F2E] text-white border-[#2D3648]">
                                        <DialogHeader>
                                            <DialogTitle>Create New Group</DialogTitle>
                                        </DialogHeader>
                                        <form
                                            onSubmit={handleCreateGroup}
                                            className="space-y-4"
                                        >
                                            <Input
                                                placeholder="Group Name"
                                                value={createGroupData.name}
                                                onChange={(e) =>
                                                    setCreateGroupData((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className="bg-[#2D3648] border-none"
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Admin Budget"
                                                value={createGroupData.adminBudget}
                                                onChange={(e) =>
                                                    setCreateGroupData((prev) => ({
                                                        ...prev,
                                                        adminBudget: e.target.value,
                                                    }))
                                                }
                                                className="bg-[#2D3648] border-none"
                                            />
                                            <Button
                                                type="submit"
                                                disabled={isCreating}
                                                className="w-full bg-[#FF9601] hover:bg-[#FF9601]/90"
                                            >
                                                {isCreating
                                                    ? "Creating..."
                                                    : "Create Group"}
                                            </Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                {loading ? (
                                    [...Array(3)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="flex-shrink-0 w-24 h-24 rounded-lg bg-[#2D3648] animate-pulse"
                                        />
                                    ))
                                ) : error ? (
                                    <div className="flex items-center justify-center text-red-500">
                                        <AlertCircle className="mr-2" />
                                        <p>{error}</p>
                                    </div>
                                ) : (
                                    groups.map((group) => (
                                        <button
                                            key={group.id}
                                            onClick={() => setSelectedGroupId(group.id)}
                                            className={cn(
                                                "flex-shrink-0 w-24 h-24 rounded-lg bg-[#2D3648] p-2 flex flex-col items-center justify-center gap-2 hover:bg-[#3A4358] transition-colors cursor-pointer relative",
                                                selectedGroupId === group.id &&
                                                    "ring-2 ring-[#FF9601]",
                                            )}
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#3A4358] flex items-center justify-center">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-medium truncate w-full text-center">
                                                {group.name}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {group.memberCount} members
                                            </span>
                                            <div className="absolute top-1 right-1 w-2 h-2 rounded-full " />
                                        </button>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-6">
                    <ScrollArea className="h-[calc(100vh-240px)]">
                        {selectedGroupId ? (
                            <div>
                                {/* <div className="sticky top-0 z-20 pb-4 ">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setSelectedGroupId(null)}
                                        className="text-white bg-[#FF9601]"
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                                        Groups
                                    </Button>
                                </div> */}
                                <GroupTransactions groupId={selectedGroupId} />
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 mt-10">
                                Select a group to view transactions
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}
