"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: string;
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

export default function GroupTransactions({ groupId }: { groupId: string }) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                groupId = "67193398934074225e0c5cc1";
                const response = await axios.get(`/api/getTransaction/${groupId}`, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                });
                setTransactions(response.data);
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

        fetchTransactions();
    }, [groupId]);

    if (loading) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-4xl mx-auto p-4">
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Group Transactions</h2>
            {transactions.length === 0 ? (
                <p className="text-gray-500">No transactions found for this group.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(
                                            new Date(transaction.date),
                                            "MMM d, yyyy",
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {transaction.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₹{transaction.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.category.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {transaction.user.name}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
