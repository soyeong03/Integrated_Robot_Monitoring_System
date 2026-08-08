import { useNavigate } from 'react-router-dom';
import { Battery, Signal, Clock, Thermometer, TrendingUp, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { Robot, SensorType, UGVSensors, DroneSensors, RobotArmSensors } from '../App';

interface RobotCardUpgradedProps {
  robot: Robot;
  selectedSensor: SensorType;
}

export function RobotCardUpgraded({ robot, selectedSensor }: RobotCardUpgradedProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: Robot['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: Robot['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadgeClass = (status: Robot['status']) => {
    switch (status) {
      case 'normal':
        return 'bg-green-600 text-white border-green-600';
      case 'warning':
        return 'bg-yellow-500 text-black border-yellow-500';
      case 'error':
        return 'bg-red-600 text-white border-red-600';
      default:
        return 'bg-gray-500 text-white border-gray-500';
    }
  };

  const getProgressColor = (status: Robot['status']) => {
    switch (status) {
      case 'normal':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'error':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSensorValue = (sensor: SensorType): number => {
    // Check if robot has this sensor
    if (robot.type === 'robot-arm') {
      // Robot-arm doesn't have battery or signal
      if (sensor === 'battery' || sensor === 'signal') {
        return 0;
      }
      const sensors = robot.sensors as RobotArmSensors;
      switch (sensor) {
        case 'temperature':
          return Math.min(100, Math.max(0, ((sensors.temperature - 30) / 30) * 100));
        case 'efficiency':
          return sensors.efficiency;
        default:
          return 0;
      }
    } else {
      // UGV and Drone have all sensors
      const sensors = robot.sensors as UGVSensors | DroneSensors;
      switch (sensor) {
        case 'battery':
          return sensors.battery;
        case 'temperature':
          return Math.min(100, Math.max(0, ((sensors.temperature - 30) / 30) * 100));
        case 'efficiency':
          return sensors.efficiency;
        case 'signal':
          return sensors.signal;
        default:
          return 0;
      }
    }
  };

  const getSensorDisplay = (sensor: SensorType): string => {
    // Check if robot has this sensor
    if (robot.type === 'robot-arm') {
      if (sensor === 'battery' || sensor === 'signal') {
        return 'N/A';
      }
      const sensors = robot.sensors as RobotArmSensors;
      switch (sensor) {
        case 'temperature':
          return `${Math.round(sensors.temperature)}°C`;
        case 'efficiency':
          return `${Math.round(sensors.efficiency)}%`;
        default:
          return 'N/A';
      }
    } else {
      const sensors = robot.sensors as UGVSensors | DroneSensors;
      switch (sensor) {
        case 'battery':
          return `${Math.round(sensors.battery)}%`;
        case 'temperature':
          return `${Math.round(sensors.temperature)}°C`;
        case 'efficiency':
          return `${Math.round(sensors.efficiency)}%`;
        case 'signal':
          return `${Math.round(sensors.signal)}%`;
        default:
          return 'N/A';
      }
    }
  };

  const getSensorLabel = (sensor: SensorType): string => {
    switch (sensor) {
      case 'battery':
        return '배터리';
      case 'temperature':
        return '온도';
      case 'efficiency':
        return '효율성';
      case 'signal':
        return '신호';
      default:
        return '';
    }
  };

  const sensorValue = getSensorValue(selectedSensor);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (sensorValue / 100) * circumference;

  // 주요 센서 Top 3 추출
  const getTopSensors = () => {
    const sensors = robot.sensors;
    const sensorList: { icon: any; label: string; value: string; color: string }[] = [];

    if (robot.type === 'robot-arm') {
      const s = sensors as RobotArmSensors;
      sensorList.push(
        { icon: Thermometer, label: '온도', value: `${s.temperature.toFixed(1)}°C`, color: s.temperature > 50 ? 'text-red-600' : 'text-slate-900' },
        { icon: TrendingUp, label: '효율', value: `${s.efficiency.toFixed(1)}%`, color: s.efficiency > 80 ? 'text-green-600' : 'text-slate-900' },
        { icon: Zap, label: '토크', value: `${s.torque.toFixed(1)}Nm`, color: 'text-slate-900' }
      );
    } else if (robot.type === 'ugv') {
      const s = sensors as UGVSensors;
      sensorList.push(
        { icon: Battery, label: '배터리', value: `${s.battery.toFixed(1)}%`, color: s.battery < 20 ? 'text-red-600' : 'text-slate-900' },
        { icon: Signal, label: '신호', value: `${s.signal.toFixed(0)}%`, color: s.signal < 50 ? 'text-red-600' : 'text-slate-900' },
        { icon: Thermometer, label: '온도', value: `${s.temperature.toFixed(1)}°C`, color: 'text-slate-900' }
      );
    } else {
      const s = sensors as DroneSensors;
      sensorList.push(
        { icon: Battery, label: '배터리', value: `${s.battery.toFixed(1)}%`, color: s.battery < 20 ? 'text-red-600' : 'text-slate-900' },
        { icon: Signal, label: '신호', value: `${s.signal.toFixed(0)}%`, color: s.signal < 50 ? 'text-red-600' : 'text-slate-900' },
        { icon: TrendingUp, label: '고도', value: `${s.altitude.toFixed(0)}m`, color: 'text-slate-900' }
      );
    }

    return sensorList.slice(0, 3);
  };

  const topSensors = getTopSensors();

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => navigate(`/robot/${robot.id}`)}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-slate-900 font-bold">{robot.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Circular Progress */}
        <div className="flex flex-col items-center">
          <div className="text-slate-500 mb-2">{getSensorLabel(selectedSensor)}</div>
          <div className="relative w-32 h-32">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={getProgressColor(robot.status)}
                strokeWidth="8"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`${getStatusColor(robot.status)}`}>
                {getSensorDisplay(selectedSensor)}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusBgColor(robot.status)} animate-pulse`} />
            <Badge 
              className={`uppercase text-xs ${getStatusBadgeClass(robot.status)}`}
            >
              {robot.status}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{robot.lastUpdate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Top 3 주요 센서 */}
        <div className="bg-slate-50 rounded-lg p-3 space-y-2">
          <div className="text-xs text-slate-500 mb-2">주요 센서</div>
          {topSensors.map((sensor, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <sensor.icon className="w-4 h-4" />
                {sensor.label}
              </span>
              <span className={`font-medium ${sensor.color}`}>{sensor.value}</span>
            </div>
          ))}
        </div>

        {/* Task & Group - 태그 스타일 */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
            <span className="font-medium">Task:</span>
            <span>{robot.taskId}</span>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs text-purple-700">
            <span className="font-medium">Group:</span>
            <span>{robot.group}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}