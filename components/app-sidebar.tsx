import {
    Calendar,
    Home,
    Plus,
    Icon,
    icons,
    Inbox,
    Search,
    Settings,
    Group,
} from "lucide-react";
import UserInfo from "./UserInfo";
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
import { title } from "process";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "#",
        icon: Home,
    },

    {
        title: "Friends",
        url: "#",
        icon: Plus,
    },
    {
        title: "Groups",
        url: "/groups",
        icon: Group,
    },
    {
        title: "Create",
        url: "/create",
        icon: Plus,
    },
    {
        title: "Settings",
        url: "UserInfo",
        icon: Settings,
    },
];

export function AppSidebar() {
    return (
        <div className="flex ">
            <Sidebar>
                <SidebarContent className="flex bg-[#07011F] items-center  justify-items-center ">
                    <SidebarGroup>
                        <SidebarGroupLabel className="text-[#FF9601] text-2xl mb-5">
                            BudgetBuddy
                        </SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                        className="text-white drop-shadow-sm "
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
            <div className="drop-shadow-sm ">
                <SidebarTrigger />
            </div>
        </div>
    );
}
