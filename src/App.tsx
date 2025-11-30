import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { MainDashboard } from './components/MainDashboard';
import { GridViewPage } from './components/GridViewPage';
import { RobotDetailPage } from './components/RobotDetailPage';
import { Notification } from './types/notifications';
import { 
  loadNotifications, 
  saveNotifications, 
  checkAlerts,
  markAsRead,
  markAsAcknowledged,
  markAllAsRead
} from './utils/notificationManager';
import { fetchLatestRobotData } from './services/influxService';
import type { 
  Robot, 
  RobotArmSensors, 
  UGVSensors, 
  DroneSensors, 
  LogEvent, 
  SensorType 
} from './types/robot';

// Re-export types for backward compatibility
export type { 
  Robot, 
  RobotArmSensors, 
  UGVSensors, 
  DroneSensors, 
  LogEvent, 
  SensorType 
};

export default function App() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [pollingInterval, setPollingInterval] = useState<number>(3000); // 기본 3초

  const [eventLog, setEventLog] = useState<LogEvent[]>([
    {
      id: 'E001',
      type: 'info',
      message: '정상: 로봇 A 작업 완료',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      robotName: 'Robot-arm 1',
    },
    {
      id: 'E002',
      type: 'warning',
      message: '경고: 로봇 B 배터리 부족',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      robotName: 'Robot-arm 2',
    },
    {
      id: 'E003',
      type: 'error',
      message: '오류: 로봇 C 통신 이상',
      timestamp: new Date(Date.now() - 1000 * 60 * 8),
      robotName: 'Robot',
    },
  ]);

  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSensor, setSelectedSensor] = useState<SensorType>('battery');
  
  // New: Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loaded = loadNotifications();
    setNotifications(loaded);
  }, []);

  // 🔥 NEW: Load data from InfluxDB and update every 3 seconds
  useEffect(() => {
    // Initial load
    const loadData = async () => {
      const data = await fetchLatestRobotData();
      if (data.length > 0) {
        setRobots(data);
      }
    };
    
    loadData();

    // Poll InfluxDB every 3 seconds
    const interval = setInterval(async () => {
      const data = await fetchLatestRobotData();
      if (data.length > 0) {
        setRobots(prevRobots => {
          // Check for alerts after updating robots
          const newAlerts = checkAlerts(data, notifications);
          if (newAlerts.length > 0) {
            setNotifications(prev => {
              const updated = [...newAlerts, ...prev];
              saveNotifications(updated);
              return updated;
            });
          }
          
          return data;
        });
      }
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [notifications, pollingInterval]);

  // Notification handlers
  const handleMarkAsRead = (ids: string[]) => {
    setNotifications(prev => {
      const updated = markAsRead(ids, prev);
      saveNotifications(updated);
      return updated;
    });
  };

  const handleMarkAsAcknowledged = (id: string) => {
    setNotifications(prev => {
      const updated = markAsAcknowledged(id, prev);
      saveNotifications(updated);
      return updated;
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => {
      const updated = markAllAsRead(prev);
      saveNotifications(updated);
      return updated;
    });
  };

  const manufacturers = ['all', ...Array.from(new Set(robots.map(r => r.manufacturer)))];
  
  const filteredRobots = robots.filter(robot => {
    const matchesManufacturer = selectedManufacturer === 'all' || robot.manufacturer === selectedManufacturer;
    const matchesSearch = robot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          robot.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesManufacturer && matchesSearch;
  });

  const totalRobots = filteredRobots.length;
  const normalRobots = filteredRobots.filter(r => r.status === 'normal').length;
  const warningRobots = filteredRobots.filter(r => r.status === 'warning').length;
  const errorRobots = filteredRobots.filter(r => r.status === 'error').length;

  return (
    <Router>
      <div className="min-h-screen bg-slate-100">
        <Header 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onMarkAsAcknowledged={handleMarkAsAcknowledged}
          onMarkAllAsRead={handleMarkAllAsRead}
          eventLog={eventLog}
          pollingInterval={pollingInterval}
          onPollingIntervalChange={setPollingInterval}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              <MainDashboard
                totalRobots={totalRobots}
                normalRobots={normalRobots}
                warningRobots={warningRobots}
                errorRobots={errorRobots}
                robots={robots}
                eventLog={eventLog}
              />
            } 
          />
          <Route 
            path="/grid-view" 
            element={
              <GridViewPage
                totalRobots={totalRobots}
                normalRobots={normalRobots}
                warningRobots={warningRobots}
                errorRobots={errorRobots}
                selectedManufacturer={selectedManufacturer}
                manufacturers={manufacturers}
                onManufacturerChange={setSelectedManufacturer}
                selectedSensor={selectedSensor}
                onSensorChange={setSelectedSensor}
                filteredRobots={filteredRobots}
                allRobots={robots}
              />
            } 
          />
          <Route 
            path="/robot/:id" 
            element={
              <RobotDetailPage robots={robots} />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}