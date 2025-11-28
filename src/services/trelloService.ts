import type { TrelloCard } from "../types/trello";

const WEBHOOK_URL = 'https://n8n-n8n-start.kfocge.easypanel.host/webhook/DADOS-TRELLO-OBOHUB';

export const trelloService = {
    getCards: async (): Promise<TrelloCard[]> => {
        try {
            const response = await fetch(WEBHOOK_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching Trello cards:', error);
            // Return empty array or throw error depending on desired behavior
            // For now, return empty array to prevent crash, but log error
            return [];
        }
    }
};
