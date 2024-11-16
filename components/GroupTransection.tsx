"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format, getMonth, getWeek } from "date-fns";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
    month: number;
    week: number;
    category: {
        id: string;
        name: string;
        maxAmount: number;
        restAmount: number;
    };
    user: {
        id: string;
        name: string;
    };
}

function filterTransactions(
    transactions: Transaction[],
    filters: { month?: number; week?: number },
): Transaction[] {
    return transactions.filter((transaction) => {
        const monthMatch = filters.month ? transaction.month === filters.month : true;
        const weekMatch = filters.week ? transaction.week === filters.week : true;
        return monthMatch && weekMatch;
    });
}

export default function GroupTransactions({ groupId }: { groupId: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
    const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined);
    const [viewMode, setViewMode] = useState<"all" | "monthly" | "weekly">("all");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/getTransaction/${groupId}`, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                });
                const transactionsWithDateInfo = response.data.map(
                    (transaction: Transaction) => ({
                        ...transaction,
                        month: getMonth(new Date(transaction.date)) + 1,
                        week: getWeek(new Date(transaction.date)),
                    }),
                );
                setTransactions(transactionsWithDateInfo);
                setFilteredTransactions(transactionsWithDateInfo);
            } catch (err) {
                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message || "Failed to fetch transactions"
                        : "An error occurred while fetching transactions",
                );
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchTransactions();
        }
    }, [groupId]);

    useEffect(() => {
        let filtered = transactions;
        if (viewMode === "monthly" && selectedMonth) {
            filtered = filterTransactions(transactions, { month: selectedMonth });
        } else if (viewMode === "weekly" && selectedWeek) {
            filtered = filterTransactions(transactions, { week: selectedWeek });
        }
        setFilteredTransactions(filtered);
    }, [transactions, selectedMonth, selectedWeek, viewMode]);

    if (loading) {
        return (
            <div className="w-full p-4 space-y-4 bg-[#111B27] text-white">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Loading transactions...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-[#111B27] text-white">
                <div
                    className="bg-red-900 border border-red-600 text-red-100 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-auto space-y-4 text-white">
            <div className="flex justify-between items-center">
                <Tabs
                    defaultValue="all"
                    className="w-auto"
                    onValueChange={(value) =>
                        setViewMode(value as "all" | "monthly" | "weekly")
                    }
                >
                    <TabsList className="bg-[#1A1F2E]">
                        <TabsTrigger
                            value="all"
                            className="data-[state=active]:bg-[#FF9601] text-white"
                        >
                            All
                        </TabsTrigger>
                        <TabsTrigger
                            value="monthly"
                            className="data-[state=active]:bg-[#FF9601] text-white"
                        >
                            Monthly
                        </TabsTrigger>
                        <TabsTrigger
                            value="weekly"
                            className="data-[state=active]:bg-[#FF9601] text-white"
                        >
                            Weekly
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {viewMode === "monthly" && (
                <Select onValueChange={(value) => setSelectedMonth(Number(value))}>
                    <SelectTrigger className="w-[180px] bg-[#1A1F2E] text-white border-none">
                        <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2E] text-white border-[#2D3648]">
                        {[...Array(12)].map((_, i) => (
                            <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                                className="hover:bg-[#2D3648]"
                            >
                                {format(new Date(2023, i, 1), "MMMM")}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {viewMode === "weekly" && (
                <Select onValueChange={(value) => setSelectedWeek(Number(value))}>
                    <SelectTrigger className="w-[180px] bg-[#1A1F2E] text-white border-none">
                        <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1F2E] text-white border-[#2D3648]">
                        {[...Array(53)].map((_, i) => (
                            <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}
                                className="hover:bg-[#2D3648]"
                            >
                                Week {i + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <Card className="bg-[#1A1F2E] border-none p-4 drop-shadow-md">
                <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2">
                        <thead>
                            <tr>
                                <th className="text-left px-4 py-2 text-sm font-normal text-gray-400">
                                    Date
                                </th>
                                <th className="text-left px-4 py-2 text-sm font-normal text-gray-400">
                                    Description
                                </th>
                                <th className="text-left px-4 py-2 text-sm font-normal text-gray-400">
                                    Amount
                                </th>
                                <th className="text-left px-4 py-2 text-sm font-normal text-gray-400">
                                    Category
                                </th>
                                <th className="text-left px-4 py-2 text-sm font-normal text-gray-400">
                                    Paid by
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="bg-[#2D3648]/30 hover:bg-[#2D3648] transition-colors"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-300 rounded-l-lg">
                                        {format(
                                            new Date(transaction.date),
                                            "MMM d, yyyy",
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-300">
                                        {transaction.description}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-300">
                                        ₹ {transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-300">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500/80"></div>
                                            {transaction.category.name}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-300 rounded-r-lg">
                                        {transaction.user.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
