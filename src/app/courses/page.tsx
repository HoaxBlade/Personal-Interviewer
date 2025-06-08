"use client";

import { useState } from "react";
import LeftNavbar from "@/components/other_components/components/leftNavBar";
import CoursesRightSideBar from "@/components/other_components/components/coursesRightSideBar";

const CoursesPage = () => {
  const [refreshSidebar, setRefreshSidebar] = useState(false);

  // Dummy handler for lesson selection
  const handleLessonSelect = (module: any, lesson: any, index: number, isCompleted: boolean) => {
    // Implement your logic here (e.g., set selected lesson, open content, etc.)
    console.log("Selected lesson:", lesson, "in module:", module);
  };

  // Dummy user object for now
  const user = { _id: "dummy-user-id" };

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

export default CoursesPage; 