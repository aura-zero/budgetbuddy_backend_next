"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertCircle } from "lucide-react";

interface GroupMember {
    id: string;
    userId: string;
    maxAmount: number;
    restAmount: number;
    user: {
        name: string;
    };
}

interface GroupMemberSelectorProps {
    groupId: string;
    onSelectOwner: (userId: string) => void;
}

export default function GroupMemberSelector({
    groupId,
    onSelectOwner,
}: GroupMemberSelectorProps) {
    const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/getUser/${groupId}`, {
                    headers: {
                        accessToken: localStorage.getItem("accessToken") || "",
                        refreshToken: localStorage.getItem("refreshToken") || "",
                    },
                });
                setGroupMembers(response.data);
            } catch (err) {
                console.error("Error fetching group members:", err);
                setError(
                    axios.isAxiosError(err)
                        ? err.response?.data?.message || "Failed to fetch group members"
                        : "An error occurred",
                );
            } finally {
                setLoading(false);
            }
        };

        if (groupId) {
            fetchGroupMembers();
        }
    }, [groupId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#FF9601]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-2 bg-red-500/20 border border-red-500 rounded text-red-100">
                <AlertCircle className="inline mr-2" />
                {error}
            </div>
        );
    }

    return (
        <Select onValueChange={onSelectOwner}>
            <SelectTrigger className="w-full bg-[#2D3648] border-none text-white">
                <SelectValue placeholder="Select Transaction Owner" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1F2E] text-white border-[#2D3648]">
                {groupMembers.map((member) => (
                    <SelectItem
                        key={member.id}
                        value={member.userId}
                        className="hover:bg-[#2D3648]"
                    >
                        {member.user.name} (₹{member.restAmount} / ₹{member.maxAmount})
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
