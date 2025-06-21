import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();

        // Fetch modules with their lessons
        const { data: modules, error: modulesError } = await supabase
            .from('modules')
            .select(`
                id,
                name,
                description,
                order_index,
                lessons (
                    id,
                    name,
                    content,
                    order_index
                )
            `)
            .order('order_index')
            .order('order_index', { foreignTable: 'lessons', ascending: true });

        if (modulesError) throw modulesError;

        return NextResponse.json(modules);
    } catch (error) {
        console.error('Error fetching modules:', error);
        return NextResponse.json(
            { error: 'Failed to fetch modules' },
            { status: 500 }
        );
    }
} 