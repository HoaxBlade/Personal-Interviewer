"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    MessageSquare, 
    BookOpen, 
    Trophy, 
    FileText, 
    StickyNote,
    Settings,
    LogOut,
    icons
  } from 'lucide-react';
import path from 'path';

const LeftNavBar = () =>{
    const pathname = usePathname(); // Get the current location

    //logout logic goes here
    const handleLogout = () => {

    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
        { path: '/chat', label: 'Chat', icon: MessageSquare},
        { path: '/courses', label: 'Courses', icon: BookOpen},
        { path: '/achievements', label: 'Achievements', icon: Trophy},
        { path: '/assessments', label: 'Assessments', icon: FileText},
        { path: '/notes', label: 'My Notes', icon: StickyNote},
    ];

    return(
        <div className="h-screen bg-[#33333E] shadow-lg relative font-inter z-40">
            

        </div>
    )
}