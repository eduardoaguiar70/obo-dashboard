import { useTrelloData } from '../hooks/useTrelloData';
import { TrelloCard } from '../components/trello/TrelloCard';
import { Loader2, CheckCircle2, AlertCircle, Clock, PlayCircle, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export function TrelloUpdates() {
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

    // Define the exact order of columns
    const lists = [
        'PROJETOS',
        'PAUTAS',
        'EM EXECUÇÃO',
        'EM APROVAÇÃO/REVISÃO',
        'ENVIADO AO CLIENTE',
        'STAND-BY',
        'EM AJUSTE',
        'EM ATRASO',
        'APROVADO',
        'FINALIZADOS'
    ];

    const groupedCards = lists.map(list => ({
        name: list,
        cards: cards.filter(c => c.status === list)
    }));

    // Analytics Calculations
    const stats = {
        total: cards.length,
        finalized: cards.filter(c => c.status === 'FINALIZADOS' || c.status === 'APROVADO').length,
        projects: cards.filter(c => c.status === 'PROJETOS').length,
        pautas: cards.filter(c => c.status === 'PAUTAS').length,
        delayed: cards.filter(c => c.is_late).length,
        inProgress: cards.filter(c => c.status === 'EM EXECUÇÃO' || c.status === 'EM APROVAÇÃO/REVISÃO').length
    };

    // Chart Data
    const statusData = [
        { name: 'Finalizados', value: stats.finalized, color: '#22c55e' }, // Green
        { name: 'Em Atraso', value: stats.delayed, color: '#ef4444' }, // Red
        { name: 'Em Andamento', value: stats.inProgress, color: '#fad51e' }, // Brand Yellow
        { name: 'Em Pauta', value: stats.pautas, color: '#3b82f6' }, // Blue
        { name: 'Projetos', value: stats.projects, color: '#a855f7' }, // Purple
    ].filter(d => d.value > 0);

    // Member Workload
    const memberStats = cards.reduce((acc, card) => {
        // card.members is a string now, e.g. "Dudu Oliveira, Gih"
        const membersList = card.members ? card.members.split(',').map(m => m.trim()).filter(m => m !== '') : ['Unassigned'];

        membersList.forEach(memberName => {
            acc[memberName] = (acc[memberName] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const memberData = Object.entries(memberStats).map(([name, count]) => ({ name, count }));

    // Label Stats (Client Stats now)
    const clientStats = cards.reduce((acc, card) => {
        const clientName = card.client || 'Sem Cliente';
        acc[clientName] = (acc[clientName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const clientData = Object.entries(clientStats).map(([name, count]) => ({ name, count }));

    // Upcoming Deadlines (Next 7 days)
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = cards
        .filter(c => c.deadline)
        .map(c => ({ ...c, dueDate: new Date(c.deadline!) }))
        .filter(c => c.dueDate >= today && c.dueDate <= nextWeek)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return (
        <div className="space-y-8 h-full flex flex-col">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Trello Updates</h2>
                <p className="text-muted-foreground">Acompanhe o progresso dos projetos em tempo real.</p>
            </div>

            {/* Horizontal Scroll Container */}
            <div className="flex-none overflow-x-auto pb-4 border-b border-border">
                <div className="flex gap-6 min-w-max pb-4">
                    {groupedCards.map((list) => (
                        <div key={list.name} className="w-80 flex-shrink-0 flex flex-col gap-4">
                            <div className="flex items-center justify-between bg-surfaceHighlight p-3 rounded-lg border border-border">
                                <h3 className="font-semibold text-sm text-white uppercase tracking-wider truncate" title={list.name}>
                                    {list.name}
                                </h3>
                                <span className="text-xs font-bold text-black bg-primary px-2 py-0.5 rounded-full">
                                    {list.cards.length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                                {list.cards.map(card => (
                                    <TrelloCard key={card.id} card={card} />
                                ))}
                                {list.cards.length === 0 && (
                                    <div className="h-24 rounded-lg border border-dashed border-border flex items-center justify-center text-sm text-muted-foreground bg-surface/30">
                                        Vazio
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Analytics Section */}
            <div className="space-y-6 pb-10">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Analytics & Performance</h3>
                    <p className="text-muted-foreground">Visão geral dos KPIs da equipe.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    <Card className="bg-surface/50 border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Finalizados</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.finalized}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface/50 border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Em Atraso</CardTitle>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.delayed}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface/50 border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Em Andamento</CardTitle>
                            <PlayCircle className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.inProgress}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface/50 border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Em Pauta</CardTitle>
                            <Layers className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.pautas}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-surface/50 border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Projetos (Início)</CardTitle>
                            <Clock className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.projects}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Status Distribution */}
                    <Card className="bg-surface/50 border-border">
                        <CardHeader>
                            <CardTitle>Distribuição de Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" />
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

                    {/* Member Workload */}
                    <Card className="bg-surface/50 border-border">
                        <CardHeader>
                            <CardTitle>Tarefas por Colaborador</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={memberData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                        <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <Tooltip
                                            cursor={{ fill: '#27272a' }}
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                        />
                                        <Bar dataKey="count" fill="#fad51e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row 2 */}
                {/* Charts Row 2 */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Tasks by Client (was Category) */}
                    <Card className="bg-surface/50 border-border">
                        <CardHeader>
                            <CardTitle>Tarefas por Cliente</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={clientData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                        <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                        <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} width={150} />
                                        <Tooltip
                                            cursor={{ fill: '#27272a' }}
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                        />
                                        <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Upcoming Deadlines */}
                    <Card className="bg-surface/50 border-border">
                        <CardHeader>
                            <CardTitle>Próximas Entregas (7 dias)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {upcomingDeadlines.length > 0 ? (
                                    upcomingDeadlines.map(card => (
                                        <a
                                            key={card.id}
                                            href={card.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3 rounded-lg bg-surfaceHighlight border border-border hover:border-primary/50 transition-colors cursor-pointer group"
                                        >
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-white truncate max-w-[250px] group-hover:text-primary transition-colors">{card.task}</p>
                                                <p className="text-xs text-muted-foreground">{card.status}</p>
                                            </div>
                                            <div className="text-xs font-bold text-primary">
                                                {card.dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="text-center text-muted-foreground py-8">
                                        Nenhuma entrega próxima.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
