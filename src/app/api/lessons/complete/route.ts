import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { lessonId } = await request.json();

        if (!lessonId) {
            return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
        }

        // Check if the lesson is already completed
        const { data: existingCompletion, error: existingCompletionError } = await supabase
            .from('completed_lessons')
            .select('id')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .single();

        if (existingCompletionError && existingCompletionError.code !== 'PGRST116') { // PGRST116: no rows found
            throw existingCompletionError;
        }

        if (existingCompletion) {
            return NextResponse.json({ message: 'Lesson already marked as done.' });
        }

        const { error: insertError } = await supabase
            .from('completed_lessons')
            .insert({
                user_id: user.id,
                lesson_id: lessonId,
                completed_at: new Date().toISOString(),
            });

        if (insertError) {
            throw insertError;
        }

        return NextResponse.json({ success: true, message: 'Lesson marked as done.' });

    } catch (error) {
        console.error('Error marking lesson as done:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        return NextResponse.json(
            { error: 'Failed to mark lesson as done.', details: errorMessage },
            { status: 500 }
        );
    }
} 