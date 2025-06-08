"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Lock, Loader2, Unlock, CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/Accordion";

interface CoursesRightSideBarProps {
  onLessonSelect?: (...args: any[]) => void;
  refreshSidebar?: boolean;
  user?: any;
}

const CoursesRightSideBar = ({ onLessonSelect: _onLessonSelect, refreshSidebar: _refreshSidebar, user: _user }: CoursesRightSideBarProps) => {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [completedModules, setCompletedModules] = useState([]);
    
    const fetchData
}

export default CoursesRightSideBar;