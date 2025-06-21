"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Wand2, CheckCircle } from 'lucide-react';
import MarkdownRenderer from '../markdown-renderer';

interface LessonDisplayProps {
    lesson: { id: string; name: string; content: string; };
    moduleName: string;
    onContentRegenerated: (newContent: string) => void;
    onMarkAsDone: () => Promise<void>;
    isCompleted: boolean;
}

const LessonDisplay: React.FC<LessonDisplayProps> = ({ lesson, moduleName, onContentRegenerated, onMarkAsDone, isCompleted }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateContent = async (lessonId: string, lang: string, instr: string) => {
        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch('/api/lessons/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    lessonId: lessonId,
                    preferredLanguage: lang,
                    additionalInstructions: instr,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to generate content');
            }

            const data = await response.json();
            onContentRegenerated(data.content);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!lesson.content && !isGenerating) {
            generateContent(lesson.id, 'English', '');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lesson.id, lesson.content]);

    const handleRegenerateClick = () => {
        generateContent(lesson.id, 'English', 'Make it more detailed');
    };

    const handleMarkAsDoneClick = async () => {
        setIsCompleting(true);
        setError(null);
        try {
            await onMarkAsDone();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to mark as done');
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden"
        >
            <div className="text-center mb-6 flex-shrink-0">
                <p className="text-sm text-gray-500">{moduleName}</p>
                <h1 className="text-3xl font-bold text-gray-800">{lesson.name}</h1>
            </div>

            <hr className='bg-black border-0 h-0.5 rounded'></hr>

            <div className="prose max-w-none flex-1 overflow-y-auto mt-10">
                {(isGenerating && !lesson.content) ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                        <p className="ml-4 text-gray-600">Generating lesson...</p>
                    </div>
                ) : (
                    <MarkdownRenderer content={lesson.content} />
                )}
            </div>

            {error && <div className="text-red-500 bg-red-100 p-3 rounded-md my-4 flex-shrink-0">{error}</div>}

            <div className="mt-auto pt-6 border-t border-gray-200 flex items-center justify-end gap-4 flex-shrink-0">
                <button
                    onClick={handleRegenerateClick}
                    disabled={isGenerating || isCompleting}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 flex items-center"
                >
                    {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    Regenerate
                </button>
                <button
                    onClick={handleMarkAsDoneClick}
                    disabled={isCompleted || isCompleting || isGenerating}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center"
                >
                    {isCompleting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                    {isCompleted ? 'Completed' : 'Mark as Done'}
                </button>
            </div>
        </motion.div>
    );
};

export default LessonDisplay; 