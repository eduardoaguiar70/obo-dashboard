import { Calendar } from 'lucide-react';

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

            <div className="flex-1 bg-surface border border-border rounded-lg overflow-hidden h-[600px] shadow-sm">
                <iframe
                    src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FBelem&showPrint=0&src=ZWR1YXJkby5hZ3VpYXI3MEBnbWFpbC5jb20&color=%232952a3"
                    style={{ borderWidth: 0 }}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    title="Google Calendar"
                ></iframe>
            </div>
        </div>
    );
}
