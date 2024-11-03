import { Calendar, Home, Icon, icons, Inbox, Search, Settings } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { title } from "process";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },
    {
        title: "Transections",
        url: "/transection",
        icon: Inbox,
    },
    {
        title: "Budget",
        url: "#",
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
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <div className="flex h-screen w-[720px]">
            <Sidebar>
                <SidebarContent className="flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45% min-h-screen  items-center  justify-items-center overflow-x-hidden">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-[#FF9601] text-2xl mb-5">
                            BudgetBuddy
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className="text-white"
                                    >
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </div>
    );
}
