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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordion";

interface Lesson {
  id: string;
  name: string;
  content: string;
}

interface Module {
  id: string;
  name: string;
  lessons: Lesson[];
}

interface CompletedLesson {
  lesson: { id: string };
}

interface CompletedAssessment {
  module: string;
}

interface User {
  id: string;
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
  isOpen: boolean;
  toggle: () => void;
}

const CoursesRightSideBar: React.FC<CoursesRightSideBarProps> = ({
  onLessonSelect,
  refreshSidebar,
  user,
  isOpen,
  toggle,
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
      if (user?.id) {
        const lessonsResponse = await fetch(`/api/lessons/completed/${user.id}`);
        if (!lessonsResponse.ok) throw new Error("Failed to fetch completed lessons");
        const lessonsData = await lessonsResponse.json();
        setCompletedLessons(lessonsData);

        // Fetch completed assessments
        const assessmentsResponse = await fetch(`/api/assessments/completed/${user.id}`, {
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
  }, [user?.id, refreshSidebar]);

  const isLessonCompleted = (lessonId: string) =>
    completedLessons.some((cl) => cl.lesson.id === lessonId);

  const isModuleCompleted = (module: Module) =>
    module.lessons.every((lesson) => isLessonCompleted(lesson.id));

  const isAssessmentCompleted = (moduleId: string) =>
    completedAssessments.some((ca) => ca.module === moduleId);

  const isModuleAccessible = (moduleIndex: number) => {
    if (moduleIndex === 0) return true;
    const previousModule = modules[moduleIndex - 1];
    return (
      previousModule &&
      isModuleCompleted(previousModule)
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

  const sidebarVariants = {
    open: { width: "24rem", transition: { duration: 0.3, ease: "easeOut" } },
    closed: { width: "4rem", transition: { duration: 0.3, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="bg-white text-black h-full flex flex-col border-l border-gray-200 relative"
    >
      <button
        onClick={toggle}
        className="absolute -left-4 top-5 bg-white border-2 border-gray-300 rounded-full p-1 z-10 hover:bg-gray-100 transition-colors"
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      <div className={`flex-1 flex flex-col min-h-0 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        <div className="bg-gray-200 h-20 flex items-center justify-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] flex-shrink-0">
          <BriefcaseBusiness className="w-8 h-8 text-black mr-3" />
          <h1 className="text-2xl font-medium text-black">Course Overview</h1>
        </div>
        <div className="bg-white px-3 pb-3 flex-1 overflow-y-auto">
          <Accordion type="single" collapsible>
            {modules.map((module, index) => {
              const isCompleted = isModuleCompleted(module);
              const isAccessible = isModuleAccessible(index);
              const assessmentCompleted = isAssessmentCompleted(module.id);

              let iconStateProp: "locked" | "unlocked" | "completed";
              if (isCompleted && assessmentCompleted) {
                iconStateProp = "completed";
              } else if (isAccessible) {
                iconStateProp = "unlocked";
              } else {
                iconStateProp = "locked";
              }

              return (
                <AccordionItem key={module.id} value={`module-${index}`}>
                  <AccordionTrigger
                    moduleNumber={`Module ${index + 1}`}
                    moduleDescription={module.name}
                    iconState={iconStateProp}
                  >
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="pl-5">
                      {module.lessons.map((lesson) => {
                        const isNotComplete = !isLessonCompleted(lesson.id);
                        return (
                          <li
                            key={lesson.id}
                            onClick={(e) => {
                              if (!isOpen) {
                                toggle();
                              }
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
                      <li className="mt-4 mb-2 w-full">
                        <motion.button
                          onClick={() => {
                            if (isCompleted && isAccessible) {
                              // You can add your navigation logic here
                              // e.g., router.push("/assessments?module=" + module.id)
                            }
                          }}
                          className={`w-full cursor-pointer transition-all duration-100 flex items-center justify-start rounded bg-white py-2 ${
                            !isCompleted || !isAccessible
                              ? "opacity-50 pointer-events-none"
                              : "hover:bg-gray-200"
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
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </motion.div>
  );
};

export default CoursesRightSideBar;