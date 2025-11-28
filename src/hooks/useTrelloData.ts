import { useState, useEffect } from 'react';
import type { TrelloCard } from '../types/trello';
import { trelloService } from '../services/trelloService';

export function useTrelloData() {
    const [cards, setCards] = useState<TrelloCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                const data = await trelloService.getCards();

                // Process data: Clean client name
                const processedData = data.map(card => ({
                    ...card,
                    client: card.client ? card.client.split(',')[0].trim() : 'Sem Cliente'
                }));

                console.log('Status recebidos:', processedData.map(t => t.status));

                setCards(processedData);
            } catch (err) {
                setError('Failed to fetch Trello cards');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    return { cards, loading, error };
}
