import { Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

export function CalendarEvents() {
    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Calendário e Eventos</h2>
                </div>
                <p className="text-muted-foreground">Acesse sua agenda do Google Calendar</p>
            </div>

            <div className="flex justify-center pt-10">
                <Card className="w-full max-w-md bg-surface border-border">
                    <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
                        <div className="p-4 bg-surfaceHighlight rounded-full">
                            <Calendar className="h-12 w-12 text-primary" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">Google Calendar</h3>
                            <p className="text-muted-foreground">
                                Clique no botão abaixo para acessar sua agenda no Google Calendar
                            </p>
                        </div>

                        <a
                            href="https://calendar.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
                                <ExternalLink className="h-5 w-5" />
                                Abrir Google Calendar
                            </button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
