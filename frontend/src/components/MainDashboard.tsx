import { useNavigate } from 'react-router-dom';
import { Grid3x3, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Robot, LogEvent } from '../App';
import { FleetOverview } from './FleetOverview';
import { useState } from 'react';

interface MainDashboardProps {
  totalRobots: number;
  normalRobots: number;
  warningRobots: number;
  errorRobots: number;
  robots: Robot[];
  eventLog: LogEvent[];
}

export function MainDashboard({ totalRobots, normalRobots, warningRobots, errorRobots, robots, eventLog }: MainDashboardProps) {
  const navigate = useNavigate();
  const [selectedSensorType, setSelectedSensorType] = useState<string>('all');
  const [currentRobotIndex, setCurrentRobotIndex] = useState(0);
  const [timeRange, setTimeRange] = useState<'1h' | '12h' | '24h' | '7d'>('24h');

  // Calculate percentage for the circular chart
  const percentage = totalRobots > 0 ? (normalRobots / totalRobots) * 100 : 0;
  
  // SVG circle parameters
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // 타입별로 로봇 분류
  const robotsByType = robots.reduce((acc, robot) => {
    if (!acc[robot.type]) {
      acc[robot.type] = { total: 0, normal: 0, warning: 0, error: 0 };
    }
    acc[robot.type].total++;
    if (robot.status === 'normal') acc[robot.type].normal++;
    if (robot.status === 'warning') acc[robot.type].warning++;
    if (robot.status === 'error') acc[robot.type].error++;
    return acc;
  }, {} as Record<string, { total: number; normal: number; warning: number; error: number; }>);

  // 센서 정보 정리
  const getSensorsByType = () => {
    const filteredRobots = selectedSensorType === 'all' 
      ? robots 
      : robots.filter(r => r.type === selectedSensorType);

    if (filteredRobots.length === 0) return [];

    const sensorData: { name: string; value: string; unit: string }[] = [];
    
    filteredRobots.forEach(robot => {
      const sensors = robot.sensors;
      Object.entries(sensors).forEach(([key, value]) => {
        if (key === 'battery') {
          sensorData.push({ name: `${robot.name} - 배터리`, value: value.toFixed(1), unit: '%' });
        } else if (key === 'temperature') {
          sensorData.push({ name: `${robot.name} - 온도`, value: value.toFixed(1), unit: '°C' });
        } else if (key === 'signal') {
          sensorData.push({ name: `${robot.name} - 신호`, value: value.toFixed(0), unit: '%' });
        } else if (key === 'efficiency') {
          sensorData.push({ name: `${robot.name} - 효율`, value: value.toFixed(1), unit: '%' });
        }
      });
    });

    return sensorData.slice(0, 10); // 최대 10개까지만 표시
  };

  // 최신 10개의 이벤트만 표시
  const recentEvents = eventLog.slice(0, 10);

  // 로봇 슬라이더 함수
  const handlePrevRobot = () => {
    setCurrentRobotIndex((prev) => (prev === 0 ? robots.length - 1 : prev - 1));
  };

  const handleNextRobot = () => {
    setCurrentRobotIndex((prev) => (prev === robots.length - 1 ? 0 : prev + 1));
  };

  // 현재 로봇의 주요 센서 가져오기
  const getCurrentRobotSensor = () => {
    if (robots.length === 0) return null;
    const robot = robots[currentRobotIndex];
    const sensors = robot.sensors;

    // 센서 우선순위: battery > temperature > efficiency > signal > altitude
    if ('battery' in sensors) {
      return { name: '배터리', value: sensors.battery, unit: '%' };
    } else if ('temperature' in sensors) {
      return { name: '온도', value: sensors.temperature, unit: '°C' };
    } else if ('efficiency' in sensors) {
      return { name: '효율', value: sensors.efficiency, unit: '%' };
    } else if ('signal' in sensors) {
      return { name: '신호', value: sensors.signal, unit: '%' };
    } else if ('altitude' in sensors) {
      return { name: '고도', value: sensors.altitude, unit: 'm' };
    }
    return null;
  };

  const currentRobot = robots.length > 0 ? robots[currentRobotIndex] : null;
  const currentSensor = getCurrentRobotSensor();

  // 센서 값을 0-100 범위로 정규화 (원형 진행 표시기용)
  const getSensorPercentage = () => {
    if (!currentSensor) return 0;
    if (currentSensor.unit === '%') return currentSensor.value;
    if (currentSensor.name === '온도') return Math.min((currentSensor.value / 100) * 100, 100);
    if (currentSensor.name === '고도') return Math.min((currentSensor.value / 200) * 100, 100);
    return 0;
  };

  const sensorPercentage = getSensorPercentage();
  const sensorCircumference = 2 * Math.PI * 70;
  const sensorStrokeDashoffset = sensorCircumference - (sensorPercentage / 100) * sensorCircumference;

  // 시간 범위별 통계 (시뮬레이션)
  const getTimeRangeStats = () => {
    const multiplier = timeRange === '1h' ? 1 : timeRange === '12h' ? 12 : timeRange === '24h' ? 24 : 168;
    return {
      normal: Math.floor(normalRobots * multiplier * 0.8),
      warning: Math.floor(warningRobots * multiplier * 1.2),
      error: Math.floor(errorRobots * multiplier * 0.5),
    };
  };

  const timeStats = getTimeRangeStats();

  return (
    <div className="p-6 bg-slate-100 min-h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Robot Status Section - 타입별 카테고리 */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="mb-6 font-bold">ROBOT STATUS</h2>
          <div className="flex items-center gap-12">
            {/* Circular Progress Chart */}
            <div className="relative w-52 h-52">
              <svg className="w-full h-full -rotate-90">
                {/* Background circle */}
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="28"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="#3b82f6"
                  strokeWidth="28"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div>연결</div>
                  <div>상태</div>
                </div>
              </div>
            </div>

            {/* Status by Category */}
            <div className="space-y-4 flex-1">
              <div className="pb-2">
                <h4 className="text-sm text-slate-500 mb-2">전체 상태</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 text-sm">정상연결</span>
                    <span className="font-semibold">{normalRobots}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-600 text-sm">경고</span>
                    <span className="font-semibold">{warningRobots}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 text-sm">오류발생</span>
                    <span className="font-semibold">{errorRobots}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 시간별 이벤트 통계 요약 */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm text-slate-600">이벤트 통계</h4>
              <div className="flex gap-1">
                {(['1h', '12h', '24h', '7d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-xs text-blue-600 mb-1">정상</div>
                <div className="text-lg font-semibold text-blue-700">{timeStats.normal}</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-3">
                <div className="text-xs text-yellow-600 mb-1">경고</div>
                <div className="text-lg font-semibold text-yellow-700">{timeStats.warning}</div>
              </div>
              <div className="bg-red-50 rounded-lg p-3">
                <div className="text-xs text-red-600 mb-1">오류</div>
                <div className="text-lg font-semibold text-red-700">{timeStats.error}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Overview */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <FleetOverview robots={robots} />
        </div>

        {/* Robot Info Section with Grid View Button */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">로봇 정보</h3>
            <button
              onClick={() => navigate('/grid-view')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded transition-colors"
            >
              <Grid3x3 className="w-4 h-4" />
              Grid View
            </button>
          </div>

          {currentRobot ? (
            <div className="space-y-4">
              {/* 로봇 이름 및 내비게이션 화살표 */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevRobot}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  disabled={robots.length <= 1}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h4 className="font-bold">{currentRobot.name}</h4>
                <button
                  onClick={handleNextRobot}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  disabled={robots.length <= 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* 센서명 */}
              {currentSensor && (
                <div className="text-center text-slate-600 mb-2">
                  {currentSensor.name}
                </div>
              )}

              {/* 원형 진행 표시기 */}
              <div className="flex justify-center">
                <div className="relative w-40 h-40">
                  <svg className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      stroke={
                        currentRobot.status === 'error'
                          ? '#ef4444'
                          : currentRobot.status === 'warning'
                          ? '#f59e0b'
                          : '#22c55e'
                      }
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={sensorCircumference}
                      strokeDashoffset={sensorStrokeDashoffset}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {currentSensor ? (
                        <span className="text-green-600">
                          {currentSensor.value.toFixed(1)}{currentSensor.unit}
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 상태 배지 */}
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    currentRobot.status === 'normal'
                      ? 'bg-green-500 text-white'
                      : currentRobot.status === 'warning'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {currentRobot.status.toUpperCase()}
                </span>
              </div>

              {/* 로봇 정보 */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Task:</span>
                  <span className="font-medium">{currentRobot.task}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Group:</span>
                  <span className="font-medium">{currentRobot.group}</span>
                </div>
              </div>

              {/* 시간 정보 */}
              <div className="text-center text-sm text-slate-500 pt-2">
                Time: {new Date().toLocaleTimeString('ko-KR')}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">
              로봇 정보가 없습니다
            </div>
          )}
        </div>

        {/* Sensor Info Section - 타입별 정리 */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">센서 정보</h3>
            <select
              value={selectedSensorType}
              onChange={(e) => setSelectedSensorType(e.target.value)}
              className="px-3 py-1 border border-slate-300 rounded text-sm"
            >
              <option value="all">전체</option>
              {Object.keys(robotsByType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {getSensorsByType().map((sensor, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <span className="text-sm text-slate-600">{sensor.name}</span>
                <span className="font-semibold">{sensor.value}{sensor.unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Event Log Section - RobotDetailPage 스타일 */}
        <div className="bg-white rounded-lg p-8 shadow-sm lg:col-span-2">
          <h3 className="mb-4 font-bold">이벤트 로그</h3>
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded border-l-4 ${
                  event.type === 'error'
                    ? 'bg-red-50 border-red-500'
                    : event.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">
                    {event.timestamp.toLocaleTimeString('ko-KR')}
                  </span>
                  <div className="flex-1 ml-4">
                    <span className="text-sm">{event.message}</span>
                    {event.robotName && (
                      <span className="text-xs text-slate-500 ml-2">({event.robotName})</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}