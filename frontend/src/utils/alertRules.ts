import { AlertRule } from '../types/notifications';

export const ALERT_RULES: AlertRule[] = [
  // P1 - 긴급 (즉시 대응)
  {
    sensor: 'battery',
    operator: '<',
    threshold: 15,
    priority: 'P1',
    title: '배터리 위험',
    message: '배터리 수준이 매우 낮습니다. 즉시 충전 필요',
    icon: '🔴',
    cooldown_minutes: 10,
    applies_to: ['ugv', 'drone'],
  },
  {
    sensor: 'temperature',
    operator: '>=',
    threshold: 50,
    priority: 'P1',
    title: '과열 위험',
    message: '온도가 위험 수준입니다. 즉시 작업 중단 필요',
    icon: '🔴',
    cooldown_minutes: 5,
  },
  
  // P2 - 중요 (30분 내)
  {
    sensor: 'battery',
    operator: '<',
    threshold: 30,
    priority: 'P2',
    title: '배터리 부족',
    message: '배터리 수준이 낮습니다. 충전 권장',
    icon: '🟠',
    cooldown_minutes: 15,
    applies_to: ['ugv', 'drone'],
  },
  {
    sensor: 'temperature',
    operator: '>=',
    threshold: 45,
    priority: 'P2',
    title: '고온 경고',
    message: '온도가 높습니다. 모니터링 필요',
    icon: '🟠',
    cooldown_minutes: 10,
  },
  {
    sensor: 'frontDistance',
    operator: '<',
    threshold: 20,
    priority: 'P2',
    title: '장애물 근접',
    message: '전방 장애물이 매우 가깝습니다',
    icon: '🟠',
    cooldown_minutes: 5,
    applies_to: ['ugv'],
  },
  
  // P3 - 주의 (1시간 내)
  {
    sensor: 'signal',
    operator: '<',
    threshold: 40,
    priority: 'P3',
    title: '신호 약함',
    message: '통신 신호가 약합니다',
    icon: '🟡',
    cooldown_minutes: 30,
    applies_to: ['ugv', 'drone'],
  },
  {
    sensor: 'efficiency',
    operator: '<',
    threshold: 70,
    priority: 'P3',
    title: '효율성 저하',
    message: '작업 효율성이 저하되었습니다',
    icon: '🟡',
    cooldown_minutes: 60,
  },
];

export const getSensorUnit = (sensor: string): string => {
  const units: Record<string, string> = {
    battery: '%',
    temperature: '°C',
    signal: '%',
    efficiency: '%',
    altitude: 'm',
    windSpeed: 'm/s',
    frontDistance: 'cm',
    leftDistance: 'cm',
    rightDistance: 'cm',
    torque: 'Nm',
    vibration: 'mm/s',
    speed: 'km/h',
    joint1Angle: '°',
    joint2Angle: '°',
    joint3Angle: '°',
    workSpeed: 'm/s',
    pathProgress: '%',
    flightTime: 'min',
    homeDistance: 'km',
  };
  
  return units[sensor] || '';
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'P1': return 'text-red-600 bg-red-50 border-red-200';
    case 'P2': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'P3': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'P4': return 'text-blue-600 bg-blue-50 border-blue-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case 'P1': return '긴급';
    case 'P2': return '중요';
    case 'P3': return '주의';
    case 'P4': return '정보';
    default: return '';
  }
};
