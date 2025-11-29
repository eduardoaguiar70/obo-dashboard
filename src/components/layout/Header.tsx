import { Bell, Search, User, RefreshCw, Command } from 'lucide-react';
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
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-sm px-6 sticky top-0 z-10">
            <div className="flex items-center w-96">
                <div className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-4 w-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar no sistema..."
                        className="block w-full rounded-xl border border-white/5 bg-white/5 py-2 pl-10 pr-10 text-sm text-white placeholder-zinc-500 focus:border-primary/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-medium text-zinc-500">
                            <Command className="h-3 w-3" />K
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(250,213,30,0.1)] transition-all disabled:opacity-50 border border-primary/20"
                >
                    <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
                </button>

                <div className="h-6 w-px bg-white/10 mx-2"></div>

                <button className="relative p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_#fad51e]"></span>
                </button>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-white">Admin User</div>
                        <div className="text-xs text-zinc-500">Administrador</div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center border border-white/10 shadow-lg">
                        <User className="h-4 w-4 text-zinc-400" />
                    </div>
                </div>
            </div>
        </header>
    );
}
