import { format, parseISO } from 'date-fns';
import { Clock } from 'lucide-react';
import type { TrelloCard as TrelloCardType } from '../../types/trello';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface TrelloCardProps {
    card: TrelloCardType;
}

export function TrelloCard({ card }: TrelloCardProps) {
    const dueDate = card.deadline ? parseISO(card.deadline) : null;
    const isLate = card.is_late;

    return (
        <a href={card.url} target="_blank" rel="noopener noreferrer" className="block">
            <Card className={cn(
                "hover:border-primary/50 transition-colors cursor-pointer group",
                isLate ? "border-red-500/50 hover:border-red-500" : ""
            )}>
                <CardContent className="p-4 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">
                                {card.client}
                            </Badge>
                            {isLate && (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                    Atrasado
                                </Badge>
                            )}
                        </div>

                        <h4 className={cn(
                            "font-semibold text-sm text-white group-hover:text-primary transition-colors line-clamp-2",
                            isLate ? "text-red-400" : ""
                        )}>
                            {card.task}
                        </h4>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50 mt-4">
                        <div className="flex items-center gap-2">
                            {dueDate && (
                                <div className={cn("flex items-center gap-1", isLate ? "text-red-400 font-medium" : "")}>
                                    <Clock className="h-3 w-3" />
                                    <span>{format(dueDate, 'dd/MM')}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-1" title={card.members}>
                            <div className="h-5 w-5 rounded-full bg-surfaceHighlight border border-surface flex items-center justify-center text-[10px] text-white font-medium uppercase">
                                {card.members.substring(0, 2)}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}
