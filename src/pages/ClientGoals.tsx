import { useState, useEffect } from 'react';
import { useTrelloData } from '../hooks/useTrelloData';
import { Loader2, CheckCircle, AlertCircle, Clock, PieChart as PieIcon, Layers, Settings, X, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { goalsService } from '../services/goalsService';

export function ClientGoals() {
    const { cards, loading: trelloLoading, error: trelloError } = useTrelloData();
    const [goals, setGoals] = useState<Record<string, number>>({});
    const [goalsLoading, setGoalsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoals, setEditingGoals] = useState<Record<string, number>>({});
    const [saving, setSaving] = useState(false);

    // Fetch Goals
    const fetchGoals = async () => {
        setGoalsLoading(true);
        const data = await goalsService.fetchGoals();
        const goalsMap: Record<string, number> = {};
        data.forEach(g => {
            goalsMap[g.client_name] = g.goal_value;
        });
        setGoals(goalsMap);
        setGoalsLoading(false);
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleOpenModal = () => {
        // Initialize editing state with current goals or default to 0
        const currentClients = data.map(d => d.name);
        // Merge known clients from cards with existing goals
        const allClients = Array.from(new Set([...currentClients, ...Object.keys(goals)]));

        const initialEditState: Record<string, number> = {};
        allClients.forEach(client => {
            initialEditState[client] = goals[client] || 0;
        });

        setEditingGoals(initialEditState);
        setIsModalOpen(true);
    };

    const handleSaveGoals = async () => {
        setSaving(true);
        // Save all changes
        const promises = Object.entries(editingGoals).map(([client, value]) =>
            goalsService.upsertGoal(client, Number(value))
        );

        await Promise.all(promises);
        await fetchGoals(); // Refresh data
        setSaving(false);
        setIsModalOpen(false);
    };

    const loading = trelloLoading || goalsLoading;
    const error = trelloError; // Main error from Trello is critical

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-red-400">
                {error}
            </div>
        );
    }

    // Process data by Client
    const clientStats: Record<string, {
        name: string;
        total: number;
        completed: number;
        inProgress: number;
        delayed: number;
    }> = {};

    const serviceStats: Record<string, Record<string, number>> = {};
    const allStatuses = new Set<string>();

    cards.forEach(card => {
        const clientName = card.client || 'Sem Cliente';

        // Basic Stats
        if (!clientStats[clientName]) {
            clientStats[clientName] = {
                name: clientName,
                total: 0,
                completed: 0,
                inProgress: 0,
                delayed: 0
            };
        }

        const stats = clientStats[clientName];
        stats.total++;

        if (['FINALIZADOS', 'APROVADO'].includes(card.status)) {
            stats.completed++;
        } else if (card.status === 'EM ATRASO' || card.is_late) {
            stats.delayed++;
        } else {
            stats.inProgress++;
        }

        // Service Stats
        if (!serviceStats[clientName]) serviceStats[clientName] = {};
        serviceStats[clientName][card.status] = (serviceStats[clientName][card.status] || 0) + 1;
        allStatuses.add(card.status);
    });

    const data = Object.values(clientStats).map(stat => {
        const goal = goals[stat.name] || 0;
        // Progress based on Goal if set, otherwise 0 or calculation based on total if desired.
        // Prompt implies showing 3/38 where 38 is goal.
        // If goal is 0, progress is 0.
        const progress = goal > 0 ? Math.round((stat.completed / goal) * 100) : 0;

        return {
            ...stat,
            goal,
            progress
        };
    }).sort((a, b) => b.total - a.total);

    const serviceData = Object.entries(serviceStats).map(([client, services]) => ({
        name: client,
        ...services
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a855f7', '#ec4899'];
    const serviceList = Array.from(allStatuses);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Metas dos Clientes</h2>
                    <p className="text-muted-foreground">Acompanhamento de entregas mensais por cliente.</p>
                </div>

                <button
                    onClick={handleOpenModal}
                    className="flex items-center gap-2 px-4 py-2 border border-primary/50 text-primary font-medium rounded-lg hover:bg-primary/10 transition-colors"
                >
                    <Settings className="h-4 w-4" />
                    Configurar Metas
                </button>
            </div>

            {/* Client Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {data.map((client) => (
                    <Card key={client.name} className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-white max-w-[70%] truncate" title={client.name}>{client.name}</CardTitle>
                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${client.progress >= 80 ? 'bg-green-500/10 text-green-500' :
                                    client.progress >= 50 ? 'bg-yellow-500/10 text-yellow-500' :
                                        'bg-red-500/10 text-red-500'
                                    }`}>
                                    {client.progress}% da Meta
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Progresso</span>
                                        <span className="text-white font-medium">{client.completed}/{client.goal || '-'} entregas</span>
                                    </div>
                                    <div className="h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${client.progress >= 80 ? 'bg-green-500' :
                                                client.progress >= 50 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}
                                            style={{ width: `${Math.min(client.progress, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Mini Stats */}
                                <div className="grid grid-cols-3 gap-2 pt-2">
                                    <div className="flex flex-col items-center p-2 bg-surfaceHighlight rounded-lg">
                                        <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
                                        <span className="text-xs text-muted-foreground">Feito</span>
                                        <span className="text-sm font-bold text-white">{client.completed}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-surfaceHighlight rounded-lg">
                                        <Clock className="h-4 w-4 text-yellow-500 mb-1" />
                                        <span className="text-xs text-muted-foreground">Andamento</span>
                                        <span className="text-sm font-bold text-white">{client.inProgress}</span>
                                    </div>
                                    <div className="flex flex-col items-center p-2 bg-surfaceHighlight rounded-lg">
                                        <AlertCircle className="h-4 w-4 text-red-500 mb-1" />
                                        <span className="text-xs text-muted-foreground">Atraso</span>
                                        <span className="text-sm font-bold text-white">{client.delayed}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Comparison Chart */}
                <Card className="bg-surface/50 border-border">
                    <CardHeader>
                        <CardTitle>Comparativo Geral de Entregas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#27272a' }}
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="completed" name="Finalizados" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="inProgress" name="Em Andamento" stackId="a" fill="#fad51e" />
                                    <Bar dataKey="delayed" name="Em Atraso" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Market Share Pie Chart */}
                <Card className="bg-surface/50 border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Share de Demandas</CardTitle>
                        <PieIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="total"
                                    >
                                        {data.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.5)" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Service Distribution Chart */}
            <Card className="bg-surface/50 border-border">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Distribuição de Status por Cliente</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={serviceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#27272a' }}
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                />
                                <Legend />
                                {serviceList.map((service, index) => (
                                    <Bar
                                        key={service}
                                        dataKey={service}
                                        stackId="a"
                                        fill={COLORS[index % COLORS.length]}
                                        radius={index === serviceList.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Config Goals Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-surface border-border shadow-2xl">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-surfaceHighlight/20">
                            <div className="flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary" />
                                <CardTitle>Configurar Metas por Cliente</CardTitle>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </CardHeader>

                        <div className="flex-1 overflow-y-auto p-6">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-surfaceHighlight/50 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-3 rounded-tl-lg">Cliente</th>
                                        <th className="px-6 py-3 rounded-tr-lg w-40 text-center">Meta Mensal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {Object.entries(editingGoals).sort((a, b) => a[0].localeCompare(b[0])).map(([client, val]) => (
                                        <tr key={client} className="hover:bg-surfaceHighlight/10 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{client}</td>
                                            <td className="px-6 py-4 text-center">
                                                <input
                                                    type="number"
                                                    value={val}
                                                    onChange={(e) => setEditingGoals(prev => ({ ...prev, [client]: Number(e.target.value) }))}
                                                    className="w-24 bg-background border border-border rounded px-2 py-1 text-center text-white focus:ring-1 focus:ring-primary outline-none"
                                                    min="0"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {Object.keys(editingGoals).length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-8 text-center text-muted-foreground">
                                                Nenhum cliente encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 border-t border-border bg-surfaceHighlight/20 flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveGoals}
                                disabled={saving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Salvar Alterações
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
