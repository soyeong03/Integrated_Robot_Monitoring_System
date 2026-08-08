import { Card } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { SensorType } from '../App';

interface RobotOverviewProps {
  totalRobots: number;
  normalRobots: number;
  warningRobots: number;
  errorRobots: number;
  selectedManufacturer: string;
  manufacturers: string[];
  onManufacturerChange: (value: string) => void;
  selectedSensor: SensorType;
  onSensorChange: (value: SensorType) => void;
}

export function RobotOverview({
  totalRobots,
  normalRobots,
  warningRobots,
  errorRobots,
  selectedManufacturer,
  manufacturers,
  onManufacturerChange,
  selectedSensor,
  onSensorChange,
}: RobotOverviewProps) {
  const sensorLabels: Record<SensorType, string> = {
    battery: '배터리',
    temperature: '온도',
    efficiency: '효율성',
    signal: '신호 강도',
  };

  return (
    <div className="flex items-center gap-4">
      <Card className="flex-1 px-6 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Total Robots:</span>
            <span className="text-slate-900">{totalRobots}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-slate-600">Normal:</span>
            <span className="text-slate-900">{normalRobots}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-slate-600">Warning:</span>
            <span className="text-slate-900">{warningRobots}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-slate-600">Error:</span>
            <span className="text-slate-900">{errorRobots}</span>
          </div>
        </div>
      </Card>

      <Card className="px-6 py-4">
        <Select value={selectedManufacturer} onValueChange={onManufacturerChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="제조사 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Manufacturers</SelectItem>
            {manufacturers.filter(m => m !== 'all').map(manufacturer => (
              <SelectItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="px-6 py-4">
        <Select value={selectedSensor} onValueChange={onSensorChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="센서 선택" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(sensorLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>
    </div>
  );
}
