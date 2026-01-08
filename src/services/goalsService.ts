import { supabase } from '../lib/supabase';

export interface ClientGoal {
    id?: number;
    client_name: string;
    goal_value: number;
    updated_at?: string;
}

export const goalsService = {
    fetchGoals: async (): Promise<ClientGoal[]> => {
        try {
            const { data, error } = await supabase
                .from('client_goals')
                .select('*');

            if (error) {
                console.error('Error fetching goals:', error);
                throw error;
            }

            return data || [];
        } catch (error) {
            console.error('Error in fetchGoals:', error);
            return [];
        }
    },

    upsertGoal: async (clientName: string, goalValue: number): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('client_goals')
                .upsert(
                    { client_name: clientName, goal_value: goalValue },
                    { onConflict: 'client_name' }
                );

            if (error) {
                console.error('Error updating goal:', error);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error in upsertGoal:', error);
            return false;
        }
    }
};
