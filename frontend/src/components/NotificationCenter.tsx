import { useState, useMemo } from 'react';
import { Bell, X, Check, ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../types/notifications';
import { LogEvent } from '../types/robot';
import { getPriorityColor, getPriorityLabel, getSensorUnit } from '../utils/alertRules';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (ids: string[]) => void;
  onMarkAsAcknowledged: (id: string) => void;
  onMarkAllAsRead: () => void;
  eventLog?: LogEvent[];
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onMarkAsAcknowledged,
  onMarkAllAsRead,
  eventLog = [],
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'notifications' | 'events'>('notifications');

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const unreadCount = unreadNotifications.length;

  // Group notifications
  const groupedNotifications = useMemo(() => {
    const filtered = selectedPriority === 'all' 
      ? unreadNotifications 
      : unreadNotifications.filter(n => n.priority === selectedPriority);

    const groups = new Map<string, Notification[]>();
    filtered.forEach(notification => {
      const key = notification.group_key;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(notification);
    });

    return Array.from(groups.entries())
      .map(([key, alerts]) => ({
        group_key: key,
        priority: alerts[0].priority,
        title: alerts[0].title.split(' ').slice(0, -2).join(' '), // Remove robot name
        alert_count: alerts.length,
        alerts: alerts.sort((a, b) => b.sensor_value - a.sensor_value), // Sort by severity
        latest_timestamp: alerts[0].created_at,
      }))
      .sort((a, b) => {
        // Sort by priority first, then by timestamp
        const priorityOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
        const priorityDiff = (priorityOrder[a.priority as keyof typeof priorityOrder] || 99) - 
                            (priorityOrder[b.priority as keyof typeof priorityOrder] || 99);
        if (priorityDiff !== 0) return priorityDiff;
        return new Date(b.latest_timestamp).getTime() - new Date(a.latest_timestamp).getTime();
      });
  }, [unreadNotifications, selectedPriority]);

  const priorityCounts = useMemo(() => ({
    P1: unreadNotifications.filter(n => n.priority === 'P1').length,
    P2: unreadNotifications.filter(n => n.priority === 'P2').length,
    P3: unreadNotifications.filter(n => n.priority === 'P3').length,
    P4: unreadNotifications.filter(n => n.priority === 'P4').length,
  }), [unreadNotifications]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const handleAcknowledge = (notificationId: string) => {
    onMarkAsAcknowledged(notificationId);
    onMarkAsRead([notificationId]);
  };

  const handleViewRobot = (robotId: string, notificationIds: string[]) => {
    onMarkAsRead(notificationIds);
    navigate(`/robot/${robotId}`);
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${Math.floor(diffHours / 24)}일 전`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Tab Headers */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'notifications'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Bell className="h-4 w-4" />
              <span>알림 ({unreadCount})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'events'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4" />
              <span>이벤트 로그</span>
            </div>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">알림 센터</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
                  모두 읽음 표시
                </Button>
              )}
            </div>

            <div className="flex gap-2 p-3 border-b bg-slate-50">
              <Button
                variant={selectedPriority === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPriority('all')}
              >
                전체
              </Button>
              {(['P1', 'P2', 'P3'] as const).map(priority => (
                priorityCounts[priority] > 0 && (
                  <Button
                    key={priority}
                    variant={selectedPriority === priority ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedPriority(priority)}
                    className={selectedPriority === priority ? getPriorityColor(priority) : ''}
                  >
                    {getPriorityLabel(priority)} ({priorityCounts[priority]})
                  </Button>
                )
              ))}
            </div>

            <ScrollArea className="h-96">
              {groupedNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>새로운 알림이 없습니다</p>
                </div>
              ) : (
                <div className="p-2">
                  {groupedNotifications.map(group => {
                    const isExpanded = expandedGroups.has(group.group_key);
                    const isSingleAlert = group.alert_count === 1;
                    const firstAlert = group.alerts[0];

                    return (
                      <div key={group.group_key} className="mb-2">
                        <div
                          className={`border rounded-lg p-3 hover:bg-slate-50 transition-colors ${getPriorityColor(group.priority)}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={getPriorityColor(group.priority)}>
                                  {getPriorityLabel(group.priority)}
                                </Badge>
                                <span className="text-xs text-slate-500">
                                  {formatTimestamp(group.latest_timestamp)}
                                </span>
                              </div>
                              
                              {isSingleAlert ? (
                                <>
                                  <h4 className="font-medium text-sm">{firstAlert.title}</h4>
                                  <p className="text-xs text-slate-600 mt-1">{firstAlert.message}</p>
                                </>
                              ) : (
                                <>
                                  <h4 className="font-medium text-sm">
                                    {group.title} ({group.alert_count}대)
                                  </h4>
                                  <p className="text-xs text-slate-600 mt-1">
                                    여러 로봇에서 동일한 문제가 발생했습니다
                                  </p>
                                </>
                              )}
                            </div>
                            
                            {!isSingleAlert && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleGroup(group.group_key)}
                              >
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              </Button>
                            )}
                          </div>

                          {(isSingleAlert || isExpanded) && (
                            <div className="mt-3 space-y-2">
                              {group.alerts.map(alert => (
                                <div key={alert.id} className="pl-3 border-l-2 border-slate-300">
                                  {!isSingleAlert && (
                                    <div className="text-xs font-medium mb-1">
                                      {alert.robot_name}: {alert.sensor_value}{getSensorUnit(alert.sensor_name)}
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleAcknowledge(alert.id)}
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      확인
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewRobot(alert.robot_id, [alert.id])}
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      자세히
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">이벤트 로그</span>
              <Badge variant="secondary">{eventLog.length}</Badge>
            </div>

            <ScrollArea className="h-96">
              {eventLog.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>이벤트 로그가 없습니다</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {eventLog.map((event) => (
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
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">
                            {event.timestamp.toLocaleString('ko-KR')}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              event.type === 'error'
                                ? 'border-red-500 text-red-700'
                                : event.type === 'warning'
                                ? 'border-yellow-500 text-yellow-700'
                                : 'border-blue-500 text-blue-700'
                            }`}
                          >
                            {event.type === 'error' ? '오류' : event.type === 'warning' ? '경고' : '정상'}
                          </Badge>
                        </div>
                        <p className="text-sm">{event.message}</p>
                        {event.robotName && (
                          <p className="text-xs text-slate-500">{event.robotName}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </>
        )}
      </div>
    </div>
  );
}