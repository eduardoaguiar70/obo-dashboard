import { useTrelloData } from '../hooks/useTrelloData';
import { Loader2, CheckCircle, AlertCircle, Clock, PieChart as PieIcon, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export function ClientGoals() {
    const { cards, loading, error } = useTrelloData();

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

    // Process Service Stats (Using 'status' as a proxy for service type if labels are gone, or just grouping by status per client)
    // The user prompt says: "C. Seção 'Metas Clientes' (Distribuição): Agrupe os dados pelo campo client (já limpo pela regra do passo 2). Mostre a quantidade de tarefas ativas por cliente nos cards ou gráficos desta seção."
    // The previous implementation used labels to distinguish services (e.g. "Dev", "Design").
    // The new interface doesn't have labels array, just 'client' string.
    // So we can't easily distinguish "Service Type" unless it's in the task name or description.
    // However, we can show distribution by Status per Client.

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

        // Service Stats (Using Status as breakdown for now, as we don't have service labels)
        if (!serviceStats[clientName]) serviceStats[clientName] = {};
        serviceStats[clientName][card.status] = (serviceStats[clientName][card.status] || 0) + 1;
        allStatuses.add(card.status);
    });

    const data = Object.values(clientStats).map(stat => ({
        ...stat,
        progress: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0
    })).sort((a, b) => b.total - a.total);

    const serviceData = Object.entries(serviceStats).map(([client, services]) => ({
        name: client,
        ...services
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a855f7', '#ec4899'];
    const serviceList = Array.from(allStatuses);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Metas dos Clientes</h2>
                <p className="text-muted-foreground">Acompanhamento de entregas mensais por cliente.</p>
            </div>

            {/* Client Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {data.map((client) => (
                    <Card key={client.name} className="bg-surface/50 border-border hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-white">{client.name}</CardTitle>
                                <div className={`px-2 py-1 rounded-full text-xs font-bold ${client.progress >= 80 ? 'bg-green-500/10 text-green-500' :
                                        client.progress >= 50 ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-red-500/10 text-red-500'
                                    }`}>
                                    {client.progress}% Concluído
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Progress Bar */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Progresso</span>
                                        <span className="text-white font-medium">{client.completed}/{client.total} entregas</span>
                                    </div>
                                    <div className="h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${client.progress >= 80 ? 'bg-green-500' :
                                                    client.progress >= 50 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${client.progress}%` }}
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

            {/* Service Distribution Chart (Now Status Distribution per Client) */}
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
        </div>
    );
}
