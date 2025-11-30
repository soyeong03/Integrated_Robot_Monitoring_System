import { RobotCard } from './RobotCard';
import type { Robot } from '../App';

interface RobotListProps {
  robots: Robot[];
}

export function RobotList({ robots }: RobotListProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {robots.map(robot => (
        <RobotCard key={robot.id} robot={robot} />
      ))}
    </div>
  );
}
