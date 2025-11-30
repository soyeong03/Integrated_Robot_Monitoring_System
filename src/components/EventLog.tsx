import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { LogEvent } from '../App';

interface EventLogProps {
  events: LogEvent[];
}

export function EventLog({ events }: EventLogProps) {
  const getEventColor = (type: LogEvent['type']) => {
    switch (type) {
      case 'info':
        return 'bg-blue-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card className="w-80 h-fit sticky top-6">
      <CardHeader>
        <CardTitle>Event Log</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedEvents.map(event => (
          <div key={event.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className={`w-2 h-2 rounded-full ${getEventColor(event.type)} mt-1.5 flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-900">{event.message}</p>
              <p className="text-slate-500 mt-1">
                {event.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
