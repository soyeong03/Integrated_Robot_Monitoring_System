import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import type { Alert as AlertType } from '../App';

interface AlertPanelProps {
  alerts: AlertType[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const getAlertIcon = (type: AlertType['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertClass = (type: AlertType['type']) => {
    switch (type) {
      case 'error':
        return 'border-red-500 bg-red-50 text-red-800';
      case 'warning':
        return 'border-amber-500 bg-amber-50 text-amber-800';
      case 'info':
        return 'border-blue-500 bg-blue-50 text-blue-800';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleString();
  };

  const sortedAlerts = [...alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No alerts at this time</p>
          </div>
        ) : (
          sortedAlerts.map(alert => (
            <Alert key={alert.id} className={getAlertClass(alert.type)}>
              {getAlertIcon(alert.type)}
              <AlertDescription>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div>{alert.robotName} ({alert.robotId})</div>
                    <div>{alert.message}</div>
                  </div>
                  <div className="text-nowrap opacity-75">{formatTimestamp(alert.timestamp)}</div>
                </div>
              </AlertDescription>
            </Alert>
          ))
        )}
      </CardContent>
    </Card>
  );
}
