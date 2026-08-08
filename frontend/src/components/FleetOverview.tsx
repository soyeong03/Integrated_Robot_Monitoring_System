import { useMemo, useState } from 'react';
import { Robot, RobotArmSensors, UGVSensors, DroneSensors } from '../App';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FleetOverviewProps {
  robots: Robot[];
}

export function FleetOverview({ robots }: FleetOverviewProps) {
  const [showTypeStats, setShowTypeStats] = useState(false);
  const [showLocationStats, setShowLocationStats] = useState(false);

  const fleetStats = useMemo(() => {
    const total = robots.length;
    const normalCount = robots.filter(r => r.status === 'normal').length;
    const warningCount = robots.filter(r => r.status === 'warning').length;
    const errorCount = robots.filter(r => r.status === 'error').length;

    return {
      total,
      normal: { count: normalCount, percentage: (normalCount / total) * 100 },
      warning: { count: warningCount, percentage: (warningCount / total) * 100 },
      error: { count: errorCount, percentage: (errorCount / total) * 100 },
    };
  }, [robots]);

  // 동적으로 타입별 통계 계산
  const typeStats = useMemo(() => {
    const stats: Record<string, {
      count: number;
      normalCount: number;
      warningCount: number;
      errorCount: number;
    }> = {};

    robots.forEach(robot => {
      if (!stats[robot.type]) {
        stats[robot.type] = {
          count: 0,
          normalCount: 0,
          warningCount: 0,
          errorCount: 0,
        };
      }

      stats[robot.type].count++;
      if (robot.status === 'normal') stats[robot.type].normalCount++;
      if (robot.status === 'warning') stats[robot.type].warningCount++;
      if (robot.status === 'error') stats[robot.type].errorCount++;
    });

    return stats;
  }, [robots]);

  // 타입별 색상 (순환)
  const typeColors = ['blue', 'green', 'purple', 'orange', 'pink', 'cyan'];
  const getTypeColor = (index: number) => typeColors[index % typeColors.length];

  const locationStats = useMemo(() => {
    const locations = new Map<string, { robots: Robot[], floor: string, area: string }>();

    robots.forEach(robot => {
      const key = `${robot.floor}_${robot.area}`;
      if (!locations.has(key)) {
        locations.set(key, { robots: [], floor: robot.floor, area: robot.area });
      }
      locations.get(key)!.robots.push(robot);
    });

    return Array.from(locations.entries()).map(([key, data]) => {
      const total = data.robots.length;
      const normal = data.robots.filter(r => r.status === 'normal').length;
      const warning = data.robots.filter(r => r.status === 'warning').length;
      const error = data.robots.filter(r => r.status === 'error').length;

      let status: 'normal' | 'warning' | 'error' = 'normal';
      if (error > 0) status = 'error';
      else if (warning > 0) status = 'warning';

      return {
        key,
        floor: data.floor,
        area: data.area,
        total,
        normal,
        warning,
        error,
        status,
        robotIds: data.robots.map(r => r.id),
      };
    });
  }, [robots]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return '🟢';
      case 'warning': return '🟡';
      case 'error': return '🔴';
      default: return '⚫';
    }
  };

  return (
    <div className="space-y-4">
      {/* Fleet Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>전체 로봇 현황</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">전체 {fleetStats.total}대</span>
          </div>

          <div className="space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-2">
                  ✅ 정상
                </span>
                <span className="text-sm">
                  {fleetStats.normal.count}/{fleetStats.total} ({fleetStats.normal.percentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={fleetStats.normal.percentage} className="h-2 bg-slate-200" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-2">
                  ⚠️ 경고
                </span>
                <span className="text-sm">
                  {fleetStats.warning.count}/{fleetStats.total} ({fleetStats.warning.percentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={fleetStats.warning.percentage} className="h-2 bg-slate-200" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-2">
                  ❌ 오류
                </span>
                <span className="text-sm">
                  {fleetStats.error.count}/{fleetStats.total} ({fleetStats.error.percentage.toFixed(0)}%)
                </span>
              </div>
              <Progress value={fleetStats.error.percentage} className="h-2 bg-slate-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>타입별 상세 통계</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTypeStats(!showTypeStats)}
            >
              {showTypeStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showTypeStats && (
          <CardContent className="space-y-4">
            {Object.entries(typeStats).map(([type, stats], index) => (
              <div key={type} className={`border-l-4 border-${getTypeColor(index)}-500 pl-3`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{type} ({stats.count}대)</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <div className="col-span-2">
                    정상: {stats.normalCount}대 | 
                    경고: {stats.warningCount}대 | 
                    오류: {stats.errorCount}대
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Location Statistics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>위치별 현황</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLocationStats(!showLocationStats)}
            >
              {showLocationStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showLocationStats && (
          <CardContent className="space-y-3">
            {locationStats.map(loc => (
              <div key={loc.key} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{getStatusIcon(loc.status)}</span>
                    <span className="font-medium">{loc.floor} {loc.area}</span>
                  </div>
                  <Badge variant="outline">
                    {loc.total}대
                  </Badge>
                </div>
                <div className="text-sm text-slate-600">
                  {loc.status === 'normal' && (
                    <span className="text-green-600">정상 ({loc.normal}/{loc.total})</span>
                  )}
                  {loc.status === 'warning' && (
                    <span className="text-orange-600">
                      정상 {loc.normal}대, 경고 {loc.warning}대
                    </span>
                  )}
                  {loc.status === 'error' && (
                    <span className="text-red-600">
                      정상 {loc.normal}대, 경고 {loc.warning}대, 오류 {loc.error}대
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  로봇: {loc.robotIds.join(', ')}
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}