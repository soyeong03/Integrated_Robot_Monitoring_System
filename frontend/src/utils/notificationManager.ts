import { Notification } from '../types/notifications';
import { Robot } from '../App';
import { ALERT_RULES, getSensorUnit } from './alertRules';
import { v4 as uuidv4 } from './uuid';

const STORAGE_KEY = 'robot_notifications';
const MAX_NOTIFICATIONS = 100;

export const loadNotifications = (): Notification[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const notifications = JSON.parse(stored);
    // Clean old notifications (older than 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return notifications.filter((n: Notification) => 
      new Date(n.created_at).getTime() > oneDayAgo
    );
  } catch (error) {
    console.error('Failed to load notifications:', error);
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  try {
    // Keep only the latest MAX_NOTIFICATIONS
    const toSave = notifications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, MAX_NOTIFICATIONS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Failed to save notifications:', error);
  }
};

export const evaluateCondition = (value: number, operator: string, threshold: number): boolean => {
  switch (operator) {
    case '>': return value > threshold;
    case '>=': return value >= threshold;
    case '<': return value < threshold;
    case '<=': return value <= threshold;
    case '==': return value === threshold;
    case '!=': return value !== threshold;
    default: return false;
  }
};

export const checkAlerts = (robots: Robot[], existingNotifications: Notification[]): Notification[] => {
  const newAlerts: Notification[] = [];
  const now = new Date();
  
  robots.forEach(robot => {
    ALERT_RULES.forEach(rule => {
      // Check if rule applies to this robot type
      if (rule.applies_to && !rule.applies_to.includes(robot.type)) {
        return;
      }
      
      // Get sensor value
      const sensorValue = (robot.sensors as any)[rule.sensor];
      
      // Skip if sensor doesn't exist for this robot type
      if (sensorValue === undefined || sensorValue === null) {
        return;
      }
      
      // Check if condition is met
      const triggered = evaluateCondition(sensorValue, rule.operator, rule.threshold);
      
      if (triggered) {
        // Check for duplicate (cooldown period)
        const cooldownMs = rule.cooldown_minutes * 60 * 1000;
        const recentAlert = existingNotifications.find(
          n => n.robot_id === robot.id &&
               n.sensor_name === rule.sensor &&
               n.priority === rule.priority &&
               now.getTime() - new Date(n.created_at).getTime() < cooldownMs
        );
        
        if (!recentAlert) {
          const groupKey = `${rule.sensor}_${rule.priority}_${robot.type}`;
          
          newAlerts.push({
            id: uuidv4(),
            priority: rule.priority,
            title: `${robot.name} ${rule.title}`,
            message: `${rule.message} (${sensorValue}${getSensorUnit(rule.sensor)})`,
            robot_id: robot.id,
            robot_name: robot.name,
            robot_type: robot.type,
            sensor_name: rule.sensor,
            sensor_value: sensorValue,
            threshold: rule.threshold,
            is_read: false,
            is_acknowledged: false,
            group_key: groupKey,
            created_at: now.toISOString(),
          });
        }
      }
    });
  });
  
  return newAlerts;
};

export const markAsRead = (notificationIds: string[], notifications: Notification[]): Notification[] => {
  return notifications.map(n => 
    notificationIds.includes(n.id) ? { ...n, is_read: true } : n
  );
};

export const markAsAcknowledged = (notificationId: string, notifications: Notification[]): Notification[] => {
  return notifications.map(n => 
    n.id === notificationId 
      ? { ...n, is_acknowledged: true, acknowledged_at: new Date().toISOString() } 
      : n
  );
};

export const markAllAsRead = (notifications: Notification[]): Notification[] => {
  return notifications.map(n => ({ ...n, is_read: true }));
};

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.is_read).length;
};

export const getCountByPriority = (notifications: Notification[], priority: string): number => {
  return notifications.filter(n => !n.is_read && n.priority === priority).length;
};

export const groupNotifications = (notifications: Notification[]): Map<string, Notification[]> => {
  const grouped = new Map<string, Notification[]>();
  
  notifications.forEach(notification => {
    const key = notification.group_key;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(notification);
  });
  
  return grouped;
};