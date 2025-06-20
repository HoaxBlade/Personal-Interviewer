"use client";

import LeftNavBar from "@/components/other_components/components/leftNavBar";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2 } from "lucide-react";
import { createClient } from '@/supabase/client';
import MarkdownRenderer from "@/components/markdown-renderer";

interface Message {
    text: string;
    sender: "user" | "agent";
}

const ChatPage = () => {
    const [userName, setUserName] = useState<string>("");
    const supabase = createClient();

    const [messages, setMessages] = useState<Message[]>(() => {
        if (typeof window !== 'undefined') {
            const savedMessages = localStorage.getItem("chatMessages");
            if (savedMessages) {
                return JSON.parse(savedMessages);
            }
        }
        return [
            {
                text: "Hello! How can I help you today?",
                sender: "agent",
            },
        ];
    });

    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Fetch user data when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: users } = await supabase
                        .from('users')
                        .select('full_name')
                        .eq('id', user.id)
                        .single();
                    
                    if (users?.full_name) {
                        setUserName(users.full_name);
                        // Update the initial greeting message with the user's name
                        setMessages(prev => {
                            if (prev.length > 0 && prev[0].sender === 'agent') {
                                return [
                                    {
                                        text: `Hello ${users.full_name}! How can I help you today?`,
                                        sender: "agent",
                                    },
                                    ...prev.slice(1)
                                ];
                            }
                            return prev;
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSendMessage = async () => {
        if (input.trim() === "") return;

        const userMessage: Message = {
            text: input,
            sender: "user",
        };

        setMessages((prev: Message[]) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            
            const agentMessage: Message = {
                text: data.response,
                sender: "agent",
            };
            
            setMessages((prev: Message[]) => [...prev, agentMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                text: "Sorry, I encountered an error. Please try again.",
                sender: "agent",
            };
            setMessages((prev: Message[]) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Save messages to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("chatMessages", JSON.stringify(messages));
        }
    }, [messages]);

    // Clear messages on refresh
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (typeof window !== 'undefined') {
                localStorage.removeItem("chatMessages");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-screen bg-gray-100"
        >
            {/* Left Navigation */}
            <LeftNavBar />

            {/* Main Content */}
            <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col relative"
            >
                {/* Chat Header */}
                <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-16 border-b flex items-center px-6"
                >
                    <div className="flex items-center gap-3">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center"
                        >
                            <span className="text-white font-semibold text-lg">AI</span>
                        </motion.div>
                        <h2 className="text-xl font-semibold">Chat Assistant</h2>
                    </div>
                </motion.div>

                {/* Chat Messages */}
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    <AnimatePresence>
                        {messages.map((msg: Message, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <motion.div
                                    whileHover={{ scale: 1 }}
                                    className={`max-w-[70%] rounded-lg p-3 ${
                                        msg.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    {msg.sender === 'agent' ? (
                                        <MarkdownRenderer content={msg.text} />
                                    ) : (
                                        msg.text
                                    )}
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Loading Indicator */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg flex items-center gap-2 z-50"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="w-4 h-4 text-blue-500" />
                            </motion.div>
                            <p className="text-sm text-gray-600">Thinking...</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Input */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="border-t p-4"
                >
                    <div className="flex items-center gap-2">
                        <motion.input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" &&
                                !isLoading &&
                                handleSendMessage()
                            }
                            placeholder="Ask your doubts here..."
                            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSendMessage}
                            disabled={isLoading}
                            className={`p-2 rounded-lg ${
                                isLoading
                                    ? 'bg-gray-200 cursor-not-allowed'
                                    : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                >
                                    <Loader2 className="w-5 h-5" />
                                </motion.div>
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ChatPage;