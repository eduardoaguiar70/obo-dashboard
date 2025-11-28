import { useTrelloData } from '../hooks/useTrelloData';
import { Loader2, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export function TeamProductivity() {
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

    // Process data by member
    const memberStats: Record<string, {
        name: string;
        total: number;
        completed: number;
        delayed: number;
        inProgress: number;
        clients: Record<string, number>; // Changed from labels to clients
    }> = {};

    cards.forEach(card => {
        // Split members string into individual names
        const membersList = card.members ? card.members.split(',').map(m => m.trim()).filter(m => m !== '') : ['Unassigned'];

        membersList.forEach(memberName => {
            if (!memberStats[memberName]) {
                memberStats[memberName] = {
                    name: memberName,
                    total: 0,
                    completed: 0,
                    delayed: 0,
                    inProgress: 0,
                    clients: {}
                };
            }

            const stats = memberStats[memberName];
            stats.total++;

            if (['FINALIZADOS', 'APROVADO'].includes(card.status)) {
                stats.completed++;
            } else if (card.is_late) { // Use is_late flag for accuracy
                stats.delayed++;
            } else {
                stats.inProgress++;
            }

            // Track client distribution for this member
            const clientName = card.client || 'Sem Cliente';
            stats.clients[clientName] = (stats.clients[clientName] || 0) + 1;
        });
    });

    const data = Object.values(memberStats).map(stat => ({
        ...stat,
        completionRate: stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0
    })).sort((a, b) => b.completed - a.completed);

    // Radar Chart Data (Client Focus for Top Performer)
    const topPerformer = data[0];
    const radarData = topPerformer ? Object.entries(topPerformer.clients).map(([subject, A]) => ({
        subject,
        A,
        fullMark: Math.max(...Object.values(topPerformer.clients))
    })) : [];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Produtividade da Equipe</h2>
                <p className="text-muted-foreground">Análise detalhada de performance por colaborador.</p>
            </div>

            {/* Top Performers Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {data.slice(0, 3).map((member, index) => (
                    <Card key={member.name} className={`bg-surface/50 border-border ${index === 0 ? 'border-primary/50' : ''}`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {index === 0 ? '🏆 Top Performer' : `#${index + 1} Colaborador`}
                            </CardTitle>
                            {index === 0 && <Trophy className="h-4 w-4 text-primary" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{member.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {member.completed} entregas ({member.completionRate}% de taxa)
                            </div>
                            <div className="mt-4 h-2 w-full bg-surfaceHighlight rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-500"
                                    style={{ width: `${member.completionRate}%` }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Comparison Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Task Status Comparison */}
                <Card className="bg-surface/50 border-border">
                    <CardHeader>
                        <CardTitle>Comparativo de Entregas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                    <XAxis type="number" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="name" type="category" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                    <Tooltip
                                        cursor={{ fill: '#27272a' }}
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="completed" name="Finalizados" stackId="a" fill="#22c55e" radius={[0, 4, 4, 0]} />
                                    <Bar dataKey="inProgress" name="Em Andamento" stackId="a" fill="#fad51e" />
                                    <Bar dataKey="delayed" name="Em Atraso" stackId="a" fill="#ef4444" radius={[4, 0, 0, 4]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Efficiency Radar (Top Performer Focus) */}
                <Card className="bg-surface/50 border-border">
                    <CardHeader>
                        <CardTitle>Foco do Top Performer ({topPerformer?.name})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="#333" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                    <Radar
                                        name={topPerformer?.name}
                                        dataKey="A"
                                        stroke="#fad51e"
                                        fill="#fad51e"
                                        fillOpacity={0.3}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Metrics Table */}
            <Card className="bg-surface/50 border-border">
                <CardHeader>
                    <CardTitle>Métricas Detalhadas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-surfaceHighlight">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Colaborador</th>
                                    <th className="px-4 py-3">Total Tarefas</th>
                                    <th className="px-4 py-3">Finalizados</th>
                                    <th className="px-4 py-3">Em Andamento</th>
                                    <th className="px-4 py-3">Atrasados</th>
                                    <th className="px-4 py-3 rounded-tr-lg">Taxa de Conclusão</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((member) => (
                                    <tr key={member.name} className="border-b border-border hover:bg-surfaceHighlight/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                            </div>
                                            {member.name}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{member.total}</td>
                                        <td className="px-4 py-3 text-green-500 font-bold">{member.completed}</td>
                                        <td className="px-4 py-3 text-yellow-500">{member.inProgress}</td>
                                        <td className="px-4 py-3 text-red-500">{member.delayed}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-bold">{member.completionRate}%</span>
                                                <div className="w-16 h-1.5 bg-surfaceHighlight rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${member.completionRate >= 80 ? 'bg-green-500' :
                                                            member.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${member.completionRate}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
