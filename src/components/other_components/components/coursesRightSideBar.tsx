"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Loader2,
  OctagonAlert,
  CheckCircle2,
  Lock,
  Unlock,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordion";

interface Lesson {
  _id: string;
  name: string;
}

interface Module {
  _id: string;
  name: string;
  lessons: Lesson[];
}

interface CompletedLesson {
  lesson: { _id: string };
}

interface CompletedAssessment {
  module: string;
}

interface User {
  _id: string;
}

interface CoursesRightSideBarProps {
  onLessonSelect: (
    module: Module,
    lesson: Lesson,
    index: number,
    isCompleted: boolean
  ) => void;
  refreshSidebar: boolean;
  user: User;
}

const CoursesRightSideBar: React.FC<CoursesRightSideBarProps> = ({
  onLessonSelect,
  refreshSidebar,
  user,
}) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>([]);
  const [completedAssessments, setCompletedAssessments] = useState<CompletedAssessment[]>([]);

  const fetchData = async () => {
    try {
      // Fetch modules
      const modulesResponse = await fetch("/api/modules");
      if (!modulesResponse.ok) throw new Error("Failed to fetch modules");
      const modulesData = await modulesResponse.json();
      setModules(modulesData);

      // Fetch completed lessons
      if (user?._id) {
        const lessonsResponse = await fetch(`/api/lessons/completed/${user._id}`);
        if (!lessonsResponse.ok) throw new Error("Failed to fetch completed lessons");
        const lessonsData = await lessonsResponse.json();
        setCompletedLessons(lessonsData);

        // Fetch completed assessments
        const assessmentsResponse = await fetch(`/api/assessments/completed/${user._id}`, {
          credentials: "include",
        });
        if (!assessmentsResponse.ok) throw new Error("Failed to fetch completed assessments");
        const assessmentsData = await assessmentsResponse.json();
        setCompletedAssessments(assessmentsData);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [user?._id, refreshSidebar]);

  const isLessonCompleted = (lessonId: string) =>
    completedLessons.some((cl) => cl.lesson._id === lessonId);

  const isModuleCompleted = (module: Module) =>
    module.lessons.every((lesson) => isLessonCompleted(lesson._id));

  const isAssessmentCompleted = (moduleId: string) =>
    completedAssessments.some((ca) => ca.module === moduleId);

  const isModuleAccessible = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    const previousModule = modules[moduleIndex - 1];
    return (
      previousModule &&
      isModuleCompleted(previousModule) &&
      isAssessmentCompleted(previousModule._id)
    );
  };

  if (loading)
    return (
      <div className="p-4 text-black h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-red-500 h-screen flex flex-col items-center justify-center bg-white">
        <OctagonAlert className="h-10 w-10 mb-2" />
        <strong>Error:</strong> {error}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white text-black h-screen flex flex-col border-l border-gray-200 w-full max-w-sm"
    >
      <div className="bg-gray-200 h-20 flex items-center justify-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
        <BriefcaseBusiness className="w-8 h-8 text-black mr-3" />
        <h1 className="text-2xl font-medium text-black">Course Overview</h1>
      </div>
      <div className="bg-white px-3 pb-3 h-full overflow-auto">
        <Accordion type="single" collapsible>
          {modules.map((module, index) => {
            const isCompleted = isModuleCompleted(module);
            const isAccessible = isModuleAccessible(index);
            const assessmentCompleted = isAssessmentCompleted(module._id);

            let iconStateProp: "locked" | "unlocked" | "completed";
            if (isCompleted && assessmentCompleted) {
              iconStateProp = "completed";
            } else if (isAccessible) {
              iconStateProp = "unlocked";
            } else {
              iconStateProp = "locked";
            }

            return (
              <AccordionItem key={module._id} value={`module-${index}`}>
                <AccordionTrigger
                  moduleNumber={`Module ${index + 1}`}
                  moduleDescription={module.name}
                  iconState={iconStateProp}
                >
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-5">
                    {module.lessons.map((lesson) => {
                      const isNotComplete = !isLessonCompleted(lesson._id);
                      return (
                        <li
                          key={lesson._id}
                          onClick={(e) => {
                            if (!isAccessible) return;
                            e.preventDefault();
                            e.stopPropagation();
                            onLessonSelect(
                              module,
                              lesson,
                              index,
                              !isNotComplete
                            );
                          }}
                          className={`cursor-pointer mt-4 flex items-center transition-all duration-200 ease-in-out ${
                            !isAccessible
                              ? "pointer-events-none text-gray-400"
                              : "hover:text-blue-600"
                          }`}
                        >
                          <span
                            className={`h-4 w-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                              isNotComplete
                                ? "border-gray-300"
                                : "bg-green-500 border-green-500"
                            }`}
                          >
                            {!isNotComplete && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </span>
                          {lesson.name}
                        </li>
                      );
                    })}

                    {/* Module Assessment Button */}
                    <motion.button
                      onClick={() => {
                        if (isCompleted && isAccessible) {
                          // You can add your navigation logic here
                          // e.g., router.push("/assessments?module=" + module._id)
                        }
                      }}
                      className={`mt-4 mb-2 w-full cursor-pointer transition-all duration-200 flex items-center justify-center rounded bg-white py-2 ${
                        !isCompleted || !isAccessible
                          ? "opacity-50 pointer-events-none"
                          : "hover:bg-blue-100"
                      }`}
                    >
                      {!assessmentCompleted ? (
                        <Lock className="h-4 w-4 mr-2 text-gray-400" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      )}
                      <span>
                        {assessmentCompleted
                          ? "Assessment Completed"
                          : "Take Assessment"}
                      </span>
                      {!isCompleted && !assessmentCompleted && (
                        <span className="ml-1 text-xs text-gray-400">
                          (Complete all lessons first)
                        </span>
                      )}
                    </motion.button>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </motion.div>
  );
};

export default CoursesRightSideBar;