import { supabase } from '../lib/supabase';

export interface ProductivityCard {
    card_id: string;
    titulo: string;
    data_prazo: string;
    membros: string[]; // Supabase returns array for text[]
    cliente: string;
    status: string;
    data_conclusao: string;
}

export const productivityService = {
    fetchProductivityHistory: async (startDate: Date, endDate: Date): Promise<ProductivityCard[]> => {
        try {
            // 1. Validate Dates
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.warn('Invalid dates provided to fetchProductivityHistory');
                return [];
            }

            // 2. Format Range (Start of Day / End of Day)
            const queryStart = new Date(startDate);
            queryStart.setHours(0, 0, 0, 0);

            const queryEnd = new Date(endDate);
            queryEnd.setHours(23, 59, 59, 999);

            const startStr = queryStart.toISOString();
            const endStr = queryEnd.toISOString();

            // Fetch broader data (filter status in JS for flexibility)
            const { data, error } = await supabase
                .from('trello_cards_history')
                .select('*')
                .gte('data_conclusao', startStr)
                .lte('data_conclusao', endStr);

            if (error) {
                console.error('Error fetching productivity history:', error);
                throw error;
            }

            // 3. Client-side Filtering (Robust Status & Date)
            const filteredData = (data as ProductivityCard[]).filter(item => {
                const itemStatus = (item.status || '').trim().toUpperCase();
                const itemDate = new Date(item.data_conclusao);

                // Status Check
                const isStatusValid = itemStatus === 'FINALIZADOS';

                // Inclusive Date Check (already filtered by SQL, but verifying validity)
                const isDateValid = !isNaN(itemDate.getTime()) &&
                    itemDate >= queryStart &&
                    itemDate <= queryEnd;

                return isStatusValid && isDateValid;
            });

            // 4. Debugging
            if (filteredData.length === 0 && data && data.length > 0) {
                console.log('DEBUG: Filtro retornou vazio. Primeiro item recebido:', {
                    status_raw: data[0].status,
                    status_parsed: (data[0].status || '').trim().toUpperCase(),
                    data_raw: data[0].data_conclusao,
                    query_start: startStr,
                    query_end: endStr
                });
            }

            return filteredData;
        } catch (error) {
            console.error('Error in fetchProductivityHistory:', error);
            return [];
        }
    },

    syncTrelloData: async (): Promise<boolean> => {
        try {
            const response = await fetch('https://n8n-n8n-start.kfocge.easypanel.host/webhook/DADOS-TRELLO-OBOHUB', {
                method: 'POST',
                mode: 'cors',
            });
            return response.ok;
        } catch (error) {
            console.error('Error syncing Trello data:', error);
            return false;
        }
    }
};
