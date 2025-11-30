// Type-specific sensor data
export interface RobotArmSensors {
  temperature: number;
  efficiency: number;
  joint1Angle: number;
  joint2Angle: number;
  joint3Angle: number;
  gripperState: 'OPEN' | 'CLOSED';
  torque: number;
  workSpeed: number;
}

export interface UGVSensors {
  battery: number;
  temperature: number;
  signal: number;
  efficiency: number;
  frontDistance: number;
  leftDistance: number;
  rightDistance: number;
  speed: number;
  pathProgress: number;
}

export interface DroneSensors {
  battery: number;
  temperature: number;
  signal: number;
  altitude: number;
  windSpeed: number;
  flightTime: number;
  gpsLat: number;
  gpsLon: number;
  homeDistance: number;
}

export interface Robot {
  id: string;
  name: string;
  type: 'robot-arm' | 'ugv' | 'drone';
  status: 'normal' | 'warning' | 'error';
  taskId: string;
  group: string;
  lastUpdate: Date;
  manufacturer: string;
  
  // New location tags
  department: string;  // '생산부문', '물류부문', '외부작업'
  line: string;        // '1라인', '2라인', 'N/A'
  area: string;        // '창고A', '생산라인', '순찰구역'
  floor: string;       // '1층', '2층', '3층', '외부'
  
  // Type-specific sensors (no common sensors)
  sensors: RobotArmSensors | UGVSensors | DroneSensors;
}

export interface LogEvent {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
  robotName: string;
}

export type SensorType = 'battery' | 'temperature' | 'efficiency' | 'signal';