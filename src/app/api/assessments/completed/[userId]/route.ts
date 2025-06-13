import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const supabase = await createClient();

        // Fetch completed assessments for the user
        const { data: completedAssessments, error: completedAssessmentsError } = await supabase
            .from('completed_assessments')
            .select(`
                id,
                module_id,
                score,
                completed_at
            `)
            .eq('user_id', params.userId);

        if (completedAssessmentsError) throw completedAssessmentsError;

        return NextResponse.json(completedAssessments);
    } catch (error) {
        console.error('Error fetching completed assessments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch completed assessments' },
            { status: 500 }
        );
    }
} 