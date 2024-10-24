"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, Users, DollarSign, Settings, ChevronRight } from "lucide-react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navItems = [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Groups", href: "/groups", icon: Users },
        { name: "Transactions", href: "/transection", icon: DollarSign },
        { name: "Settings", href: "/check", icon: Settings },
    ];

    return (
        <div className="bg-[#161622]">
            <button
                className="fixed top-4 left-4 z-40 md:hidden bg-[#161622] text-white p-2 rounded-md"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <aside
                className={`fixed top-0 left-0 z-30 w-64 h-full bg-[#161622] text-white transition-transform duration-300 ease-in-out transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    <h2 className="text-2xl font-bold">Buddy</h2>
                    <button
                        className="md:hidden text-gray-400 hover:text-white"
                        onClick={toggleSidebar}
                        aria-label="Close sidebar"
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6">
                    <ul>
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                                            pathname === item.href
                                                ? "bg-gray-700 text-white"
                                                : ""
                                        }`}
                                    >
                                        <IconComponent size={20} className="mr-3" />
                                        {item.name}
                                        {pathname === item.href && (
                                            <ChevronRight size={20} className="ml-auto" />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>
        </div>
    );
}
