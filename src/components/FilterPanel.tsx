import { Robot } from '../App';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X } from 'lucide-react';

export interface FilterState {
  type: string;  // 'all' | 로봇 타입 (동적)
  status: 'all' | 'normal' | 'warning' | 'error';
  manufacturer: string;
  department: string;
  floor: string;
  currentTask: string;  // 현재 작업 필터 추가
}

interface FilterPanelProps {
  robots: Robot[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterPanel({ robots, filters, onFilterChange }: FilterPanelProps) {
  // 동적으로 데이터에서 추출
  const types = ['all', ...Array.from(new Set(robots.map(r => r.type)))];
  const manufacturers = ['all', ...Array.from(new Set(robots.map(r => r.manufacturer)))];
  const departments = ['all', ...Array.from(new Set(robots.map(r => r.department)))];
  const floors = ['all', ...Array.from(new Set(robots.map(r => r.floor)))];
  const currentTasks = ['all', ...Array.from(new Set(robots.map(r => r.currentTask)))];

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      type: 'all',
      status: 'all',
      manufacturer: 'all',
      department: 'all',
      floor: 'all',
      currentTask: 'all',
    });
  };

  const activeFilterCount = Object.entries(filters).filter(([_, value]) => value !== 'all').length;

  // Quick filter presets
  const applyPreset = (preset: 'urgent' | 'warning' | 'low-battery' | 'weak-signal') => {
    switch (preset) {
      case 'urgent':
        onFilterChange({ ...filters, status: 'error' });
        break;
      case 'warning':
        onFilterChange({ ...filters, status: 'warning' });
        break;
      case 'low-battery':
        // This would need additional logic to filter by battery < 30%
        // For now, just show warning/error status
        onFilterChange({ ...filters, status: 'warning', type: 'all' });
        break;
      case 'weak-signal':
        onFilterChange({ ...filters, status: 'warning', type: 'all' });
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          필터
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            <X className="h-4 w-4 mr-1" />
            초기화
          </Button>
        )}
      </div>

      {/* Quick Presets - 아이콘 제거 */}
      <div>
        <Label className="text-xs text-slate-600 mb-2 block">빠른 필터</Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('urgent')}
          >
            긴급 대응 필요
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyPreset('warning')}
          >
            주의 필요
          </Button>
        </div>
      </div>

      {/* Type Filter - 아이콘 제거 */}
      <div>
        <Label className="text-sm mb-2 block">로봇 타입</Label>
        <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {types.filter(t => t !== 'all').map(type => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter - 아이콘 제거 */}
      <div>
        <Label className="text-sm mb-2 block">상태</Label>
        <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="normal">정상</SelectItem>
            <SelectItem value="warning">경고</SelectItem>
            <SelectItem value="error">오류</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Manufacturer Filter */}
      <div>
        <Label className="text-sm mb-2 block">제조사</Label>
        <Select value={filters.manufacturer} onValueChange={(value) => updateFilter('manufacturer', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {manufacturers.filter(m => m !== 'all').map(manufacturer => (
              <SelectItem key={manufacturer} value={manufacturer}>
                {manufacturer}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Department Filter */}
      <div>
        <Label className="text-sm mb-2 block">부서</Label>
        <Select value={filters.department} onValueChange={(value) => updateFilter('department', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {departments.filter(d => d !== 'all').map(department => (
              <SelectItem key={department} value={department}>
                {department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Floor Filter */}
      <div>
        <Label className="text-sm mb-2 block">층</Label>
        <Select value={filters.floor} onValueChange={(value) => updateFilter('floor', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {floors.filter(f => f !== 'all').map(floor => (
              <SelectItem key={floor} value={floor}>
                {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current Task Filter */}
      <div>
        <Label className="text-sm mb-2 block">현재 작업</Label>
        <Select value={filters.currentTask} onValueChange={(value) => updateFilter('currentTask', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {currentTasks.filter(t => t !== 'all').map(task => (
              <SelectItem key={task} value={task}>
                {task}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}