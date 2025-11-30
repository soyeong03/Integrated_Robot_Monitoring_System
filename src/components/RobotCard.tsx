import { Battery, Thermometer, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import type { Robot } from '../App';

interface RobotCardProps {
  robot: Robot;
}

export function RobotCard({ robot }: RobotCardProps) {
  const getStatusColor = (status: Robot['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'idle':
        return 'bg-blue-500';
      case 'maintenance':
        return 'bg-amber-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: Robot['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'idle':
        return 'secondary';
      case 'maintenance':
        return 'outline';
      case 'offline':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600';
    if (battery > 30) return 'text-amber-600';
    return 'text-red-600';
  };

  const getTemperatureColor = (temp: number) => {
    if (temp > 45) return 'text-red-600';
    if (temp > 40) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(robot.status)} animate-pulse`} />
            <CardTitle className="font-bold">{robot.name}</CardTitle>
            <span className="text-slate-500">{robot.id}</span>
          </div>
          <Badge variant={getStatusVariant(robot.status)}>
            {robot.status.charAt(0).toUpperCase() + robot.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location */}
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="w-4 h-4 text-slate-500" />
          <span>{robot.location}</span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-600">
              <Battery className={`w-4 h-4 ${getBatteryColor(robot.battery)}`} />
              <span>Battery</span>
            </div>
            <div className={getBatteryColor(robot.battery)}>{robot.battery.toFixed(0)}%</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-600">
              <Thermometer className={`w-4 h-4 ${getTemperatureColor(robot.temperature)}`} />
              <span>Temp</span>
            </div>
            <div className={getTemperatureColor(robot.temperature)}>{robot.temperature.toFixed(0)}°C</div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-slate-600">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Efficiency</span>
            </div>
            <div className="text-slate-900">{robot.efficiency}%</div>
          </div>
        </div>

        {/* Task Progress */}
        {robot.status === 'active' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Task Progress</span>
              <span>{robot.taskProgress.toFixed(0)}%</span>
            </div>
            <Progress value={robot.taskProgress} />
          </div>
        )}

        {/* Last Update */}
        <div className="text-slate-500 pt-2 border-t">
          Last update: {robot.lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}