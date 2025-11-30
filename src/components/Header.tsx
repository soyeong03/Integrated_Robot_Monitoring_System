import { Menu, Search, Bell, HelpCircle, RefreshCw } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { NotificationCenter } from './NotificationCenter';
import { Notification } from '../types/notifications';
import { LogEvent } from '../types/robot';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  notifications: Notification[];
  onMarkAsRead: (ids: string[]) => void;
  onMarkAsAcknowledged: (id: string) => void;
  onMarkAllAsRead: () => void;
  eventLog?: LogEvent[];
  pollingInterval: number;
  onPollingIntervalChange: (interval: number) => void;
}

export function Header({ 
  searchQuery, 
  onSearchChange,
  notifications,
  onMarkAsRead,
  onMarkAsAcknowledged,
  onMarkAllAsRead,
  eventLog = [],
  pollingInterval,
  onPollingIntervalChange
}: HeaderProps) {
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // 메인 화면(/)에서는 Search Bar 숨김
  const showSearchBar = location.pathname !== '/';

  return (
    <>
      <header className="bg-slate-800 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-slate-700"
              onClick={() => alert('메뉴 기능 준비중입니다')}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-white">Robot Monitoring System</h1>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-md">
            {showSearchBar && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Polling Rate Selector */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700 rounded">
              <RefreshCw className="w-4 h-4 text-slate-300" />
              <select
                value={pollingInterval}
                onChange={(e) => onPollingIntervalChange(Number(e.target.value))}
                className="bg-transparent text-white text-sm border-none outline-none cursor-pointer [&>option]:bg-slate-800 [&>option]:text-white"
              >
                <option value={1000}>1초</option>
                <option value={2000}>2초</option>
                <option value={3000}>3초</option>
                <option value={5000}>5초</option>
                <option value={10000}>10초</option>
                <option value={30000}>30초</option>
              </select>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-white hover:bg-slate-700"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-slate-700"
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Notification Modal */}
      <NotificationCenter
        notifications={notifications}
        onMarkAsRead={onMarkAsRead}
        onMarkAsAcknowledged={onMarkAsAcknowledged}
        onMarkAllAsRead={onMarkAllAsRead}
        eventLog={eventLog}
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2>도움말</h2>
              <button 
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-2">🤖 로봇 모니터링 시스템</h3>
                <p className="text-gray-600">9개의 이기종 로봇(Robot-arm 3개, UGV 3개, Drone 3개)을 실시간으로 모니터링합니다.</p>
              </div>

              <div>
                <h4 className="mb-2">주요 기능</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>실시간 모니터링</strong>: 3초마다 InfluxDB에서 데이터를 가져와 업데이트</li>
                  <li>• <strong>Grid View</strong>: 모든 로봇을 한눈에 확인</li>
                  <li>• <strong>상세 페이지</strong>: 로봇 카드 클릭 시 센서별 시계열 차트 확인</li>
                  <li>• <strong>알림 시스템</strong>: 배터리 부족, 온도 이상 등 자동 알림</li>
                  <li>• <strong>검색 & 필터</strong>: 제조사, 그룹, 상태별 필터링</li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2">상태 표시</h4>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span><strong>정상연결</strong>: 모든 센서 정상 작동</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span><strong>경고</strong>: 일부 센서가 임계값 근접</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-600"></span>
                    <span><strong>오류발생</strong>: 센서 이상 또는 통신 오류</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-2">단축키</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + K</kbd>: 검색 포커스</li>
                  <li>• <kbd className="px-2 py-1 bg-gray-100 rounded">ESC</kbd>: 모달 닫기</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowHelp(false)}
                className="w-full px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}