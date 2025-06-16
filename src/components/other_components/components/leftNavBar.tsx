"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    MessagesSquareIcon, 
    BookOpen, 
    Trophy, 
     
    NotebookPen,
    Settings,
    LogOut,
    BriefcaseBusiness
} from 'lucide-react';
import { createClient } from '../../../../supabase/client';

const LeftNavBar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            router.push('/sign-in');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard},
        { path: '/chat', label: 'Chat', icon: MessagesSquareIcon},
        { path: '/courses', label: 'Interview Prep', icon: BookOpen},
        { path: '/achievements', label: 'Achievements', icon: Trophy},
        { path: '/assessments', label: 'Mock Interviews', icon: BriefcaseBusiness},
        { path: '/notes', label: 'My Notes', icon: NotebookPen},
    ];

    return (
        <div className="h-screen bg-white relative font-inter z-40 shadow-lg">
            <Link href="/" className="flex items-center px-8 pt-8 mb-12 pl-5 text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Personal Interviewer
            </span>
            </Link>

            <nav className="px-4 space-y-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center p-4 rounded-[7px] transition duration-200
                                ${isActive
                                    ? "bg-gray-200 text-black font-semibold"
                                    : "hover:bg-gray-100 text-black"}
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white`}
                        >
                            <Icon
                                className="w-6 h-6"
                                color="#222"
                            />
                            <span className="ml-3 font-medium select-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-8 left-0 right-0 px-6">
                <Link href="/profile">
                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        className={`flex items-center w-full h-[55px] mb-4 p-2 border-2 bg-white ${
                            pathname === '/profile' 
                                ? "border-black bg-gray-100 text-black font-semibold" 
                                : "border-gray-300 text-black"
                        } shadow-md cursor-pointer hover:bg-gray-50 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white transition duration-200`}
                    >
                        <span className={`ml-12 select-none font-medium`}>
                            Profile
                        </span>
                    </motion.button>
                </Link>

                <div className="flex gap-2 h-[55px]">
                    <Link href="/settings">
                        <motion.button 
                            whileHover={{ scale: 1.05 }} 
                            whileTap={{ scale: 0.95 }} 
                            className={`flex items-center cursor-pointer justify-center h-[55px] w-[55px] p-2 border-2 bg-white ${
                                pathname === '/settings' 
                                    ? "border-black bg-gray-100 text-black font-semibold" 
                                    : "border-gray-300 text-black"
                            } shadow-md hover:bg-gray-50 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 focus:ring-offset-white transition duration-200`}
                        >
                            <Settings
                                className="w-6 h-6"
                                color="#222"
                            />
                        </motion.button>
                    </Link>

                    <motion.button 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }} 
                        className="flex items-center cursor-pointer justify-center flex-grow p-2 border-2 text-black bg-white border-gray-300 hover:border-red-500 shadow-md hover:bg-red-50 rounded-[7px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-white transition duration-200" 
                        onClick={handleLogout}
                    >
                        <LogOut className="w-6 h-6 mr-2" color="#222" />
                        <span className="select-none">Log out</span>
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default LeftNavBar;