"use client";

import { useState, useEffect } from "react";
import LeftNavbar from "@/components/other_components/components/leftNavBar";
import CoursesRightSideBar from "@/components/other_components/components/coursesRightSideBar";
import LessonDisplay from "@/components/other_components/LessonDisplay";

interface CoursesClientWrapperProps {
  user: { id: string };
}

interface Lesson {
  id: string;
  name: string;
  content: string;
}

interface Module {
  id: string;
  name: string;
}

const CoursesClientWrapper: React.FC<CoursesClientWrapperProps> = ({ user }) => {
  const [refreshSidebar, setRefreshSidebar] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLessonSelect = (module: any, lesson: any, index: number, isCompleted: boolean) => {
    setSelectedLesson(lesson);
    setSelectedModule({ id: module.id, name: module.name });
    setIsLessonCompleted(isCompleted);
  };

  const handleContentRegenerated = (newContent: string) => {
    if (selectedLesson) {
      setSelectedLesson({ ...selectedLesson, content: newContent });
      setRefreshSidebar(prev => !prev);
    }
  };

  const handleMarkAsDone = async () => {
    if (!selectedLesson) return;

    const response = await fetch('/api/lessons/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId: selectedLesson.id }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Failed to mark lesson as done');
    }

    setIsLessonCompleted(true);
    setRefreshSidebar(prev => !prev); // Refresh sidebar to show updated status
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation */}
      <LeftNavbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
          {selectedLesson && selectedModule ? (
            <LessonDisplay
              lesson={selectedLesson}
              moduleName={selectedModule.name}
              onContentRegenerated={handleContentRegenerated}
              onMarkAsDone={handleMarkAsDone}
              isCompleted={isLessonCompleted}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Welcome to your Courses</h1>
                <p className="text-gray-600">Select a lesson from the right sidebar to get started.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      {isClient ? (
        <CoursesRightSideBar
          onLessonSelect={handleLessonSelect}
          refreshSidebar={refreshSidebar}
          user={user}
          isOpen={isSidebarOpen}
          toggle={toggleSidebar}
        />
      ) : (
        <div className="w-96 flex-shrink-0" />
      )}
    </div>
  );
};

export default CoursesClientWrapper; 