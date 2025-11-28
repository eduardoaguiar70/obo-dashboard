import { Trello, Settings, LogOut, Users, Target, Sun, Moon, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useTheme } from '../theme-provider';

const navigation = [
    { name: 'Trello Updates', href: '/', icon: Trello },
    { name: 'Produtividade', href: '/productivity', icon: Users },
    { name: 'Metas Clientes', href: '/goals', icon: Target },
    { name: 'Calendário', href: '/calendar', icon: Calendar },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const location = useLocation();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-screen w-64 flex-col bg-surface border-r border-border">
            <div className="flex h-16 items-center px-6 border-b border-border">
                <img src="/obo-logo.jpg" alt="OBO Studio" className="h-12 w-12 rounded-full object-cover" />
                <span className="ml-3 text-xl font-bold text-primary tracking-tight">OBO Studio</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-surfaceHighlight hover:text-white"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="border-t border-border p-4 space-y-2">
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex w-full items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-surfaceHighlight hover:text-white transition-all"
                >
                    {theme === "dark" ? <Sun className="mr-3 h-5 w-5" /> : <Moon className="mr-3 h-5 w-5" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
                <button className="flex w-full items-center px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg hover:bg-surfaceHighlight hover:text-white transition-all">
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
