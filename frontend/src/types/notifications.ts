export type NotificationPriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Notification {
  id: string;
  priority: NotificationPriority;
  title: string;
  message: string;
  robot_id: string;
  robot_name: string;
  robot_type: 'robot-arm' | 'ugv' | 'drone';
  sensor_name: string;
  sensor_value: number;
  threshold: number;
  
  is_read: boolean;
  is_acknowledged: boolean;
  
  group_key: string;  // For grouping similar alerts
  
  created_at: string;  // ISO timestamp
  acknowledged_at?: string;
}

export interface NotificationGroup {
  group_key: string;
  priority: NotificationPriority;
  title: string;
  alert_count: number;
  alerts: Notification[];
  latest_timestamp: string;
}

export interface AlertRule {
  sensor: string;
  operator: '>' | '>=' | '<' | '<=' | '==' | '!=';
  threshold: number;
  priority: NotificationPriority;
  title: string;
  message: string;
  icon: string;
  cooldown_minutes: number;
  applies_to?: ('robot-arm' | 'ugv' | 'drone')[];  // If undefined, applies to all
}
