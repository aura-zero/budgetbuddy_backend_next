import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
    title: "BudgetBuddy",
    description: "Expence Tracker",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Navbar />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 ">{children}</main>
                </div>
            </body>
        </html>
    );
}
