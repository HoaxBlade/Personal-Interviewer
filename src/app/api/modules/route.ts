import { createAdminClient } from "../../../utils/supabase/admin";
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = createAdminClient();

        // Step 1: Fetch all modules
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select('id, name, description, order_index')
            .order('order_index');

        if (modulesError) {
            console.error('Error fetching modules:', modulesError);
            throw modulesError;
        }

        // Step 2: Fetch all lessons
        const { data: lessons, error: lessonsError } = await supabase
            .from('lessons')
            .select('id, name, content, order_index, module_id');

        if (lessonsError) {
            console.error('Error fetching lessons:', lessonsError);
            throw lessonsError;
        }

        // Step 3: Combine them in the code
        const lessonsByModuleId = lessons.reduce((acc: any, lesson: any) => {
            const moduleId = lesson.module_id;
            if (!acc[moduleId]) {
                acc[moduleId] = [];
            }
            acc[moduleId].push(lesson);
            return acc;
        }, {} as Record<string, any[]>);

        // Sort lessons within each module
        for (const moduleId in lessonsByModuleId) {
            lessonsByModuleId[moduleId].sort((a: any, b: any) => a.order_index - b.order_index);
        }

        const combinedModules = modules.map((module: any) => ({
            ...module,
            lessons: lessonsByModuleId[module.id] || [],
        }));

        return NextResponse.json(combinedModules);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error('Error in GET /api/modules:', errorMessage);
        return NextResponse.json(
            { error: 'Failed to fetch modules', details: errorMessage },
            { status: 500 }
        );
    }
} 