"use client";

import { Calendar, Home, Inbox, Search, Settings, Plus } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Budget",
        url: "/budget",
        icon: Calendar,
    },
    {
        title: "Groups",
        url: "/groups",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/check",
        icon: Settings,
    },
    {
        title: "Create",
        url: "/create",
        icon: Plus,
    },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar className="border-r border-gray-200 dark:border-gray-800">
            <SidebarContent className="flex flex-col h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45%">
                <div className="flex items-center h-16 px-4">
                    <SidebarTrigger />
                    <SidebarGroupLabel className="text-[#FF9601] text-2xl ml-2">
                        BudgetBuddy
                    </SidebarGroupLabel>
                </div>
                <SidebarGroup className="flex-1 overflow-y-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.url}
                                    >
                                        <Link
                                            href={item.url}
                                            className="flex items-center text-white"
                                        >
                                            <item.icon className="mr-2 h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
