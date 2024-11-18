import UserInfo from "@/components/UserInfo";
import CreateGroup from "@/components/CreateGroup";
import UserGroups from "@/components/UserGroups";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
export default function Home() {
    return (
        // <div className="flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45% h-screen w-screen ">
        <div>
            {/* <UserInfo /> */}

            <div className="flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45% min-h-screen flex-col items-center justify-start overflow-x-hidden text-white">
                {/* <header className="w-full max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/logos/budget-buddy.png"
                            alt="Budget Buddy Logo"
                            width={40}
                            height={40}
                        />
                        <span className="text-xl font-bold">Budget Buddy</span>
                    </div>
                </header> */}

                <main className="flex-grow w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Welcome to Budget Buddy
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl">
                        Your personal finance companion for smart budgeting and expense
                        tracking.
                    </p>

                    <div className="mb-12">
                        <Image
                            src="/logos/budget-buddy.png"
                            alt="Budget Buddy"
                            width={480}
                            height={360}
                            priority
                        />
                    </div>

                    <Button size="lg" className="mb-16 bg-blue-500 text-lg ">
                        Get Started
                    </Button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                        <Card className="bg-white/10 backdrop-blur-lg text-white">
                            <CardHeader>
                                <CardTitle className="text-2xl">Easy Tracking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Monitor your expenses effortlessly with our intuitive
                                    interface.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-lg  text-white">
                            <CardHeader>
                                <CardTitle className="text-2xl">Smart Insights</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Get personalized financial insights to help you make
                                    better decisions.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-white/10 backdrop-blur-lg  text-white">
                            <CardHeader>
                                <CardTitle className="text-2xl">
                                    Group Budgeting
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    Collaborate on budgets with friends and family for
                                    shared expenses.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </main>

                <footer className="w-full max-w-7xl mx-auto px-4 py-6 text-center">
                    <p>&copy; 2024 Budget Buddy. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
}
