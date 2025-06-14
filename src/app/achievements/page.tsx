"use client";

import LeftNavBar from "@/components/other_components/components/leftNavBar";
import { motion } from "framer-motion";

export default function AchievementsPage() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Navigation */}
            <LeftNavBar />
            
            {/* Main Content */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 overflow-auto"
            >
                <div className="p-8">
                    <motion.h1 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-2xl font-bold mb-4"
                    >
                        Achievements
                    </motion.h1>
                    
                    {/* Content will be added here */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-lg shadow-sm p-6"
                    >
                        <p className="text-gray-500">Your achievements will appear here.</p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
} 