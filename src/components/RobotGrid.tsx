import { RobotCardUpgraded } from './RobotCardUpgraded';
import type { Robot, SensorType } from '../App';

interface RobotGridProps {
  robots: Robot[];
  selectedSensor: SensorType;
}

export function RobotGrid({ robots, selectedSensor }: RobotGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {robots.map(robot => (
        <RobotCardUpgraded key={robot.id} robot={robot} selectedSensor={selectedSensor} />
      ))}
    </div>
  );
}
