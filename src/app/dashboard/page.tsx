"use client";

//import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import LeftNavBar from "@/components/other_components/components/leftNavBar";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for data fetching
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-100 items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                    <p className="text-black">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Navigation */}
            <LeftNavBar />
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                    {/* Add your dashboard content here */}
                </div>
            </div>
        </div>
    );
}
