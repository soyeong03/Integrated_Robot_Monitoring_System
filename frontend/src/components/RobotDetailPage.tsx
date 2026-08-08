import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Battery, Thermometer, Signal, TrendingUp, Activity } from 'lucide-react';
import { Robot, RobotArmSensors, UGVSensors, DroneSensors } from '../App';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RobotDetailPageProps {
  robots: Robot[];
}

interface SensorData {
  time: string;
  value: number;
}

export function RobotDetailPage({ robots }: RobotDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const robot = robots.find(r => r.id === id);

  const [selectedSensor, setSelectedSensor] = useState<string>('temperature');
  const [chartData, setChartData] = useState<SensorData[]>([]);

  // Initialize sensor based on robot type
  useEffect(() => {
    if (!robot) return;
    
    if (robot.type === 'robot-arm') {
      setSelectedSensor('temperature');
    } else if (robot.type === 'ugv') {
      setSelectedSensor('battery');
    } else if (robot.type === 'drone') {
      setSelectedSensor('battery');
    }
  }, [robot?.type]); // 수정 : 화면 업데이트마다 센서 트렌드 초기화 문제

  // Generate mock time-series data
  useEffect(() => {
    if (!robot) return;
    
    const data: SensorData[] = [];
    const now = new Date();
    
    for (let i = 60; i >= 0; i -= 5) {
      const time = new Date(now.getTime() - i * 60 * 1000);
      let value = 0;
      
      if (robot.type === 'robot-arm') {
        const sensors = robot.sensors as RobotArmSensors;
        switch (selectedSensor) {
          case 'temperature':
            value = sensors.temperature + Math.random() * 3;
            break;
          case 'efficiency':
            value = sensors.efficiency + Math.random() * 3;
            break;
          case 'joint1Angle':
            value = sensors.joint1Angle + (Math.random() - 0.5) * 5;
            break;
          case 'joint2Angle':
            value = sensors.joint2Angle + (Math.random() - 0.5) * 5;
            break;
          case 'joint3Angle':
            value = sensors.joint3Angle + (Math.random() - 0.5) * 5;
            break;
          case 'torque':
            value = sensors.torque + (Math.random() - 0.5) * 0.3;
            break;
          case 'workSpeed':
            value = sensors.workSpeed + (Math.random() - 0.5) * 0.5;
            break;
        }
      } else if (robot.type === 'ugv') {
        const sensors = robot.sensors as UGVSensors;
        switch (selectedSensor) {
          case 'battery':
            value = sensors.battery + Math.random() * 5;
            break;
          case 'temperature':
            value = sensors.temperature + Math.random() * 3;
            break;
          case 'signal':
            value = sensors.signal + Math.random() * 5;
            break;
          case 'efficiency':
            value = sensors.efficiency + Math.random() * 3;
            break;
          case 'frontDistance':
            value = sensors.frontDistance + (Math.random() - 0.5) * 20;
            break;
          case 'leftDistance':
            value = sensors.leftDistance + (Math.random() - 0.5) * 20;
            break;
          case 'rightDistance':
            value = sensors.rightDistance + (Math.random() - 0.5) * 20;
            break;
          case 'speed':
            value = sensors.speed + (Math.random() - 0.5) * 2;
            break;
          case 'pathProgress':
            value = sensors.pathProgress + (Math.random() - 0.5) * 5;
            break;
        }
      } else if (robot.type === 'drone') {
        const sensors = robot.sensors as DroneSensors;
        switch (selectedSensor) {
          case 'battery':
            value = sensors.battery + Math.random() * 5;
            break;
          case 'temperature':
            value = sensors.temperature + Math.random() * 3;
            break;
          case 'signal':
            value = sensors.signal + Math.random() * 5;
            break;
          case 'efficiency':
            value = sensors.efficiency + Math.random() * 3;
            break;
          case 'altitude':
            value = sensors.altitude + (Math.random() - 0.5) * 5;
            break;
          case 'windSpeed':
            value = sensors.windSpeed + (Math.random() - 0.5) * 0.5;
            break;
          case 'flightTime':
            value = sensors.flightTime + (Math.random() - 0.5) * 2;
            break;
          case 'homeDistance':
            value = sensors.homeDistance + (Math.random() - 0.5) * 50;
            break;
        }
      }
      
      data.push({
        time: time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        value: Math.round(value * 10) / 10,
      });
    }
    
    setChartData(data);
  }, [robot, selectedSensor]);

  if (!robot) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl mb-4">로봇을 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/grid-view')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return '정상';
      case 'warning':
        return '경고';
      case 'error':
        return '오류';
      default:
        return '알 수 없음';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'robot-arm':
        return '로봇팔';
      case 'ugv':
        return 'UGV';
      case 'drone':
        return '드론';
      default:
        return type;
    }
  };

  // Render sensor grid based on robot type
  const renderSensorGrid = () => {
    if (robot.type === 'robot-arm') {
      const sensors = robot.sensors as RobotArmSensors;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">온도</span>
              <Thermometer className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl">{sensors.temperature.toFixed(1)}°C</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">효율성</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl">{sensors.efficiency}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Joint 1 각도</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.joint1Angle}°</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Joint 2 각도</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.joint2Angle}°</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Joint 3 각도</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.joint3Angle}°</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">그리퍼 상태</span>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl">{sensors.gripperState}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">토크</span>
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl">{sensors.torque.toFixed(1)} Nm</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">작업 속도</span>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl">{sensors.workSpeed.toFixed(1)} m/s</div>
          </div>
        </div>
      );
    } else if (robot.type === 'ugv') {
      const sensors = robot.sensors as UGVSensors;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">배터리</span>
              <Battery className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.battery.toFixed(1)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">온도</span>
              <Thermometer className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl">{sensors.temperature.toFixed(1)}°C</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">신호강도</span>
              <Signal className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl">{sensors.signal}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">효율성</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl">{sensors.efficiency}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">전방 장애물</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.frontDistance} cm</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">좌측 장애물</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.leftDistance} cm</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">우측 장애물</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.rightDistance} cm</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">현재 속도</span>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl">{sensors.speed.toFixed(1)} m/s</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">경로 진행</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl">{sensors.pathProgress}%</div>
          </div>
        </div>
      );
    } else if (robot.type === 'drone') {
      const sensors = robot.sensors as DroneSensors;
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">배터리</span>
              <Battery className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.battery.toFixed(1)}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">온도</span>
              <Thermometer className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl">{sensors.temperature.toFixed(1)}°C</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">신호강도</span>
              <Signal className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl">{sensors.signal}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">효율성</span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl">{sensors.efficiency}%</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">고도</span>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl">{sensors.altitude} m</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">풍속</span>
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-2xl">{sensors.windSpeed.toFixed(1)} m/s</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">비행 시간</span>
              <Activity className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl">{sensors.flightTime} min</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">귀환 거리</span>
              <Activity className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl">{sensors.homeDistance} m</div>
          </div>
        </div>
      );
    }
  };

  // Render sensor selection buttons based on robot type
  const renderSensorButtons = () => {
    if (robot.type === 'robot-arm') {
      return (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedSensor('temperature')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'temperature' ? 'bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            온도
          </button>
          <button
            onClick={() => setSelectedSensor('efficiency')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'efficiency' ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            효율성
          </button>
          <button
            onClick={() => setSelectedSensor('joint1Angle')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'joint1Angle' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Joint 1 각도
          </button>
          <button
            onClick={() => setSelectedSensor('joint2Angle')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'joint2Angle' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Joint 2 각도
          </button>
          <button
            onClick={() => setSelectedSensor('joint3Angle')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'joint3Angle' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            Joint 3 각도
          </button>
          <button
            onClick={() => setSelectedSensor('torque')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'torque' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            토크
          </button>
          <button
            onClick={() => setSelectedSensor('workSpeed')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'workSpeed' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            작업 속도
          </button>
        </div>
      );
    } else if (robot.type === 'ugv') {
      return (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedSensor('battery')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'battery' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            배터리
          </button>
          <button
            onClick={() => setSelectedSensor('temperature')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'temperature' ? 'bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            온도
          </button>
          <button
            onClick={() => setSelectedSensor('signal')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'signal' ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            신호강도
          </button>
          <button
            onClick={() => setSelectedSensor('efficiency')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'efficiency' ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            효율성
          </button>
          <button
            onClick={() => setSelectedSensor('frontDistance')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'frontDistance' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            전방 장애물
          </button>
          <button
            onClick={() => setSelectedSensor('leftDistance')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'leftDistance' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            좌측 장애물
          </button>
          <button
            onClick={() => setSelectedSensor('rightDistance')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'rightDistance' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            우측 장애물
          </button>
          <button
            onClick={() => setSelectedSensor('speed')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'speed' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            현재 속도
          </button>
          <button
            onClick={() => setSelectedSensor('pathProgress')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'pathProgress' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            경로 진행
          </button>
        </div>
      );
    } else if (robot.type === 'drone') {
      return (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setSelectedSensor('battery')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'battery' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            배터리
          </button>
          <button
            onClick={() => setSelectedSensor('temperature')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'temperature' ? 'bg-orange-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            온도
          </button>
          <button
            onClick={() => setSelectedSensor('signal')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'signal' ? 'bg-green-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            신호강도
          </button>
          <button
            onClick={() => setSelectedSensor('efficiency')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'efficiency' ? 'bg-purple-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            효율성
          </button>
          <button
            onClick={() => setSelectedSensor('altitude')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'altitude' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            고도
          </button>
          <button
            onClick={() => setSelectedSensor('windSpeed')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'windSpeed' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            풍속
          </button>
          <button
            onClick={() => setSelectedSensor('flightTime')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'flightTime' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            비행 시간
          </button>
          <button
            onClick={() => setSelectedSensor('homeDistance')}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              selectedSensor === 'homeDistance' ? 'bg-blue-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
            }`}
          >
            귀환 거리
          </button>
        </div>
      );
    }
  };

  // Mock event log
  const eventLog = [
    { id: 1, time: '10:23', type: 'info', message: '작업 시작' },
    { id: 2, time: '10:45', type: 'warning', message: '온도 상승 감지' },
    { id: 3, time: '11:12', type: 'info', message: '정상 작동 중' },
    { id: 4, time: '11:34', type: 'error', message: '연결 끊김' },
    { id: 5, time: '11:35', type: 'info', message: '연결 재개' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/grid-view')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>돌아가기</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl mb-2">{robot.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-slate-600">ID: {robot.id}</span>
                <span className="text-slate-600">타입: {getTypeText(robot.type)}</span>
                <span className="text-slate-600">제조사: {robot.manufacturer}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">상태:</span>
                  <span className={`px-2 py-1 rounded text-white text-sm ${getStatusColor(robot.status)}`}>
                    {getStatusText(robot.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Sensor Grid */}
        {renderSensorGrid()}

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl mb-4">센서 트렌드</h2>
          
          {/* Sensor Selection */}
          {renderSensorButtons()}

          {/* Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Event Log */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-xl mb-4">이벤트 로그</h2>
          <div className="space-y-2">
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
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{event.time}</span>
                  <span className="text-sm">{event.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
