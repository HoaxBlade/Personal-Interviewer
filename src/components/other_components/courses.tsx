"use client";

import LeftNavBar from "@/components/other_components/components/leftNavBar";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

const CoursesPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Left Navigation */}
            <LeftNavBar />
            
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Courses</h1>
                    
                </div>
            </div>
        </div>
    );
}

export default CoursesPage;