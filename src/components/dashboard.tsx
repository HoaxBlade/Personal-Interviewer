"use client";

import { Link } from "react-router-dom";
//import IconStore from "../components/IconStore";
//import RightSideBar from "../components/RightSideBar";
import { motion } from "framer-motion";
import LeftNavBar from "./other_components/components/leftNavBar";

export default function Dashboard() {
    return (
        <div className="flex h-screen bg-white">
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