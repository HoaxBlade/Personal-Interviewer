"use client";

import { useState } from "react";
import LeftNavbar from "@/components/other_components/components/leftNavBar";
import CoursesRightSideBar from "@/components/other_components/components/coursesRightSideBar";

interface CoursesClientWrapperProps {
  user: { _id: string };
}

const CoursesClientWrapper: React.FC<CoursesClientWrapperProps> = ({ user }) => {
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  const handleLessonSelect = (module: any, lesson: any, index: number, isCompleted: boolean) => {
    console.log("Selected lesson:", lesson, "in module:", module);
    // You might want to set a selected lesson state here if needed
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Navigation */}
      <LeftNavbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Courses</h1>
          {/* Add your main courses content here */}
        </div>
      </div>

      {/* Right Sidebar */}
      <CoursesRightSideBar
        onLessonSelect={handleLessonSelect}
        refreshSidebar={refreshSidebar}
        user={user}
      />
    </div>
  );
};

export default CoursesClientWrapper; 