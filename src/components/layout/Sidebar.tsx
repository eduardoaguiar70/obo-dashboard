import { Trello, Settings, LogOut, Users, Target, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

import { useAuth } from '../../context/AuthContext';

const navigation = [
    { name: 'Trello Updates', href: '/', icon: Trello },
    { name: 'Produtividade', href: '/productivity', icon: Users },
    { name: 'Metas Clientes', href: '/goals', icon: Target },
    { name: 'Calendário', href: '/calendar', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="flex h-screen w-72 flex-col bg-black/20 backdrop-blur-xl border-r border-white/5 relative z-20">
            {/* Logo Section */}
            <div className="flex h-20 items-center px-6 border-b border-white/5">
                <img
                    src="/obo-logo.jpg"
                    alt="OBO Studio"
                    className="h-10 w-10 rounded-full object-cover shadow-lg shadow-primary/20 mr-3 border-2 border-primary/20"
                />
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white tracking-tight">OBO Studio</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">Dashboard v2.0</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
                <nav className="space-y-1.5">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden",
                                    isActive
                                        ? "text-primary bg-primary/10 shadow-[0_0_20px_rgba(250,213,30,0.1)]"
                                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_#fad51e]"></div>
                                )}
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-300",
                                        isActive ? "text-primary" : "text-zinc-500 group-hover:text-white"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Actions */}
            <div className="p-4 space-y-2 border-t border-white/5 bg-black/20">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                            OS
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium text-white truncate">OBO Admin</span>
                            <span className="text-xs text-zinc-500 truncate">admin@obostudio.com</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 hover:text-red-300 transition-all"
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
