import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const supabase = await createClient();

        // Fetch completed lessons for the user
        const { data: completedLessons, error: completedLessonsError } = await supabase
            .from('completed_lessons')
            .select(`
                id,
                lesson_id,
                completed_at,
                lesson:lessons (
                    id,
                    name
                )
            `)
            .eq('user_id', params.userId);

        if (completedLessonsError) throw completedLessonsError;

        return NextResponse.json(completedLessons);
    } catch (error) {
        console.error('Error fetching completed lessons:', error);
        return NextResponse.json(
            { error: 'Failed to fetch completed lessons' },
            { status: 500 }
        );
    }
} 