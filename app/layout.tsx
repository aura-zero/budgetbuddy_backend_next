import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const metadata: Metadata = {
    title: "BudgetBuddy",
    description: "Expense Tracker",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <body className="flex h-full flex-col antialiased bg-[#07011F] text-white">
                <Navbar />
                <SidebarProvider>
                    <div className="flex flex-1 overflow-hidden">
                        <AppSidebar />
                        <main className="flex-1 overflow-y-auto p-4">{children}</main>
                    </div>
                </SidebarProvider>
            </body>
        </html>
    );
}
