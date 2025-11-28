export interface TrelloCard {
    id: string;
    task: string;
    status: string;
    client: string;
    members: string;
    description: string;
    deadline: string | null;
    is_late: boolean;
    url: string;
}
