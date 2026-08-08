import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { RobotOverview } from './RobotOverview';
import { RobotGrid } from './RobotGrid';
import { FilterPanel, FilterState } from './FilterPanel';
import { Robot, SensorType } from '../App';

interface GridViewPageProps {
  totalRobots: number;
  normalRobots: number;
  warningRobots: number;
  errorRobots: number;
  selectedManufacturer: string;
  manufacturers: string[];
  onManufacturerChange: (manufacturer: string) => void;
  selectedSensor: SensorType;
  onSensorChange: (sensor: SensorType) => void;
  filteredRobots: Robot[];
  allRobots: Robot[];
}

export function GridViewPage({
  totalRobots,
  normalRobots,
  warningRobots,
  errorRobots,
  selectedManufacturer,
  manufacturers,
  onManufacturerChange,
  selectedSensor,
  onSensorChange,
  filteredRobots,
  allRobots,
}: GridViewPageProps) {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    status: 'all',
    manufacturer: 'all',
    department: 'all',
    floor: 'all',
    currentTask: 'all',
  });

  // Apply filters to robots
  const displayedRobots = useMemo(() => {
    return filteredRobots.filter(robot => {
      if (filters.type !== 'all' && robot.type !== filters.type) return false;
      if (filters.status !== 'all' && robot.status !== filters.status) return false;
      if (filters.manufacturer !== 'all' && robot.manufacturer !== filters.manufacturer) return false;
      if (filters.department !== 'all' && robot.department !== filters.department) return false;
      if (filters.floor !== 'all' && robot.floor !== filters.floor) return false;
      if (filters.currentTask !== 'all' && robot.currentTask !== filters.currentTask) return false;
      return true;
    });
  }, [filteredRobots, filters]);

  // Update stats based on displayed robots
  const displayedStats = useMemo(() => ({
    total: displayedRobots.length,
    normal: displayedRobots.filter(r => r.status === 'normal').length,
    warning: displayedRobots.filter(r => r.status === 'warning').length,
    error: displayedRobots.filter(r => r.status === 'error').length,
  }), [displayedRobots]);

  return (
    <div className="p-6 bg-slate-100 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Main Button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors"
            >
              <Home className="w-4 h-4" />
              Main
            </button>
          </div>

          <RobotOverview
            totalRobots={displayedStats.total}
            normalRobots={displayedStats.normal}
            warningRobots={displayedStats.warning}
            errorRobots={displayedStats.error}
            selectedManufacturer={selectedManufacturer}
            manufacturers={manufacturers}
            onManufacturerChange={onManufacturerChange}
            selectedSensor={selectedSensor}
            onSensorChange={onSensorChange}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Panel */}
            <div className="lg:col-span-1">
              <FilterPanel
                robots={allRobots}
                filters={filters}
                onFilterChange={setFilters}
              />
            </div>
            
            {/* Robot Grid */}
            <div className="lg:col-span-3">
              <RobotGrid robots={displayedRobots} selectedSensor={selectedSensor} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}