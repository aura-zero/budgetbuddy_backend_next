"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";
import GroupMemberSelector from "@/components/GroupMembers";

interface Category {
    id: string;
    name: string;
    maxAmount: number;
    restAmount: number;
}

interface Group {
    id: string;
    name: string;
}

export default function CreateComponent() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newCategory, setNewCategory] = useState({ name: "", maxAmount: "" });
    const [newTransaction, setNewTransaction] = useState({
        description: "",
        amount: "",
        categoryId: "",
        transactionOwner: "",
    });

    useEffect(() => {
        fetchGroups();
        const storedGroupId = localStorage.getItem("selectedGroupId");
        if (storedGroupId) {
            setSelectedGroupId(storedGroupId);
        }
    }, []);

    useEffect(() => {
        if (selectedGroupId) {
            fetchCategories(selectedGroupId);
            localStorage.setItem("selectedGroupId", selectedGroupId);
        }
    }, [selectedGroupId]);

    const fetchGroups = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/getGroups", {
                headers: {
                    accessToken: localStorage.getItem("accessToken") || "",
                    refreshToken: localStorage.getItem("refreshToken") || "",
                },
            });
            setGroups(response.data.map((item: { group: Group }) => item.group));
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to fetch groups"
                    : "An error occurred",
            );
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async (groupId: string) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/getCategory/${groupId}`, {
                headers: {
                    accessToken: localStorage.getItem("accessToken") || "",
                    refreshToken: localStorage.getItem("refreshToken") || "",
                },
            });
            setCategories(response.data);
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to fetch categories"
                    : "An error occurred",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroupId) {
            setError("Please select a group first");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post(
                "/api/setCategory",
                {
                    setCategory: {
                        name: newCategory.name,
                        maxAmount: Number(newCategory.maxAmount),
                        groupId: selectedGroupId,
                    },
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                },
            );
            setNewCategory({ name: "", maxAmount: "" });
            fetchCategories(selectedGroupId);
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to create category"
                    : "An error occurred",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGroupId) {
            setError("Please select a group first");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await axios.post(
                "/api/setTransaction",
                {
                    addTransaction: {
                        description: newTransaction.description,
                        amount: Number(newTransaction.amount),
                        categoryId: newTransaction.categoryId,
                        groupId: selectedGroupId,
                        transactionOwner: newTransaction.transactionOwner,
                    },
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                },
            );
            setNewTransaction({
                description: "",
                amount: "",
                categoryId: "",
                transactionOwner: "",
            });
        } catch (err) {
            setError(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || "Failed to create transaction"
                    : "An error occurred",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGroupChange = (value: string) => {
        setSelectedGroupId(value);
        localStorage.setItem("selectedGroupId", value);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF9601]" />
            </div>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-[#1A1F2E] text-white border-none">
            <CardHeader>
                <CardTitle>Create</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <h3>On Group</h3>
                    <Select
                        value={selectedGroupId || undefined}
                        onValueChange={handleGroupChange}
                    >
                        <SelectTrigger className="w-full bg-[#2D3648] border-none">
                            <SelectValue placeholder="Select Group" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1F2E] text-white border-[#2D3648]">
                            {groups.map((group) => (
                                <SelectItem
                                    key={group.id}
                                    value={group.id}
                                    className="hover:bg-[#2D3648]"
                                >
                                    {group.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {selectedGroupId && (
                    <Tabs defaultValue="category">
                        <TabsList className="grid w-full grid-cols-2 bg-[#2D3648]">
                            <TabsTrigger
                                value="category"
                                className="data-[state=active]:bg-[#FF9601]"
                            >
                                Category
                            </TabsTrigger>
                            <TabsTrigger
                                value="transaction"
                                className="data-[state=active]:bg-[#FF9601]"
                            >
                                Transaction
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="category">
                            <form onSubmit={handleCreateCategory} className="space-y-4">
                                <Input
                                    placeholder="Category Name"
                                    value={newCategory.name}
                                    onChange={(e) =>
                                        setNewCategory((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="bg-[#2D3648] border-none"
                                />
                                <Input
                                    type="number"
                                    placeholder="Max Amount"
                                    value={newCategory.maxAmount}
                                    onChange={(e) =>
                                        setNewCategory((prev) => ({
                                            ...prev,
                                            maxAmount: e.target.value,
                                        }))
                                    }
                                    className="bg-[#2D3648] border-none"
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-[#FF9601] hover:bg-[#FF9601]/90"
                                >
                                    Create Category
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="transaction">
                            <form
                                onSubmit={handleCreateTransaction}
                                className="space-y-4"
                            >
                                <Input
                                    placeholder="Description"
                                    value={newTransaction.description}
                                    onChange={(e) =>
                                        setNewTransaction((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className="bg-[#2D3648] border-none"
                                />
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    value={newTransaction.amount}
                                    onChange={(e) =>
                                        setNewTransaction((prev) => ({
                                            ...prev,
                                            amount: e.target.value,
                                        }))
                                    }
                                    className="bg-[#2D3648] border-none"
                                />
                                <Select
                                    onValueChange={(value) =>
                                        setNewTransaction((prev) => ({
                                            ...prev,
                                            categoryId: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className="w-full bg-[#2D3648] border-none">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1A1F2E] text-white border-[#2D3648]">
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id}
                                                className="hover:bg-[#2D3648]"
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <GroupMemberSelector
                                    groupId={selectedGroupId}
                                    onSelectOwner={(userId) =>
                                        setNewTransaction((prev) => ({
                                            ...prev,
                                            transactionOwner: userId,
                                        }))
                                    }
                                />
                                <Button
                                    type="submit"
                                    className="w-full bg-[#FF9601] hover:bg-[#FF9601]/90"
                                >
                                    Create Transaction
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                )}
                {error && (
                    <div className="mt-4 p-2 bg-red-500/20 border border-red-500 rounded text-red-100">
                        <AlertCircle className="inline mr-2" />
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
