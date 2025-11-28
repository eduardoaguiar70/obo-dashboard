import { Bell, Search, User, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const [isSyncing, setIsSyncing] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            await fetch('https://n8n-n8n-start.kfocge.easypanel.host/webhook/DADOS-TRELLO-OBOHUB');
            // Optional: Reload page to reflect changes if the webhook updates backend data that we fetch on mount
            // window.location.reload(); 
            // For now, just visual feedback
            setTimeout(() => setIsSyncing(false), 1000);
        } catch (error) {
            console.error('Sync failed:', error);
            setIsSyncing(false);
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface/50 backdrop-blur-sm px-6 sticky top-0 z-10">
            <div className="flex items-center w-96">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full rounded-md border border-border bg-surfaceHighlight py-1.5 pl-10 pr-3 text-sm text-white placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </button>

                <button className="relative p-2 text-muted-foreground hover:text-white transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <User className="h-4 w-4 text-primary" />
                </div>
            </div>
        </header>
    );
}
