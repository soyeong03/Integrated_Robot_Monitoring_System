import type { Robot } from '../types/robot';

// API 설정 - 직접 URL 지정 (환경 변수 문제 회피)
const API_BASE_URL = 'http://localhost:8000';

// 시뮬레이션 데이터 생성 함수
function generateSimulatedRobotData(): Robot[] {
  const robots: Robot[] = [];
  
  // Robot-arm 3대
  for (let i = 1; i <= 3; i++) {
    const status = Math.random() < 0.7 ? 'normal' : Math.random() < 0.85 ? 'warning' : 'error';
    robots.push({
      id: `RA${String(i).padStart(3, '0')}`,
      name: `Robot-arm ${i}`,
      type: 'robot-arm',
      status: status as 'normal' | 'warning' | 'error',
      taskId: `TASK-${Math.floor(Math.random() * 9000) + 1000}`,
      group: ['생산라인A', '생산라인B', '조립라인'][Math.floor(Math.random() * 3)],
      lastUpdate: new Date(),
      manufacturer: ['ABB', 'KUKA', 'FANUC'][Math.floor(Math.random() * 3)],
      department: '생산부문',
      line: `${i}라인`,
      area: '생산라인',
      floor: `${Math.floor(Math.random() * 3) + 1}층`,
      sensors: {
        temperature: Math.random() * 60 + 20,
        efficiency: Math.random() * 30 + 70,
        joint1Angle: Math.random() * 360 - 180,
        joint2Angle: Math.random() * 360 - 180,
        joint3Angle: Math.random() * 360 - 180,
        gripperState: Math.random() > 0.5 ? 'OPEN' : 'CLOSED',
        torque: Math.random() * 90 + 10,
        workSpeed: Math.random() * 100,
      },
    });
  }
  
  // UGV 3대
  for (let i = 1; i <= 3; i++) {
    const status = Math.random() < 0.7 ? 'normal' : Math.random() < 0.85 ? 'warning' : 'error';
    robots.push({
      id: `UG${String(i).padStart(3, '0')}`,
      name: `UGV ${i}`,
      type: 'ugv',
      status: status as 'normal' | 'warning' | 'error',
      taskId: `TASK-${Math.floor(Math.random() * 9000) + 1000}`,
      group: ['물류A', '물류B', '순찰'][Math.floor(Math.random() * 3)],
      lastUpdate: new Date(),
      manufacturer: ['Boston Dynamics', 'Clearpath', 'AgileX'][Math.floor(Math.random() * 3)],
      department: '물류부문',
      line: 'N/A',
      area: ['창고A', '창고B', '순찰구역'][Math.floor(Math.random() * 3)],
      floor: `${Math.floor(Math.random() * 2) + 1}층`,
      sensors: {
        battery: Math.random() * 90 + 10,
        temperature: Math.random() * 40 + 20,
        signal: Math.random() * 50 + 50,
        efficiency: Math.random() * 30 + 70,
        frontDistance: Math.random() * 500,
        leftDistance: Math.random() * 500,
        rightDistance: Math.random() * 500,
        speed: Math.random() * 50,
        pathProgress: Math.random() * 100,
      },
    });
  }
  
  // Drone 3대
  for (let i = 1; i <= 3; i++) {
    const status = Math.random() < 0.7 ? 'normal' : Math.random() < 0.85 ? 'warning' : 'error';
    robots.push({
      id: `DR${String(i).padStart(3, '0')}`,
      name: `Drone ${i}`,
      type: 'drone',
      status: status as 'normal' | 'warning' | 'error',
      taskId: `TASK-${Math.floor(Math.random() * 9000) + 1000}`,
      group: ['외부작업A', '외부작업B', '점검'][Math.floor(Math.random() * 3)],
      lastUpdate: new Date(),
      manufacturer: ['DJI', 'Parrot', 'Autel'][Math.floor(Math.random() * 3)],
      department: '외부작업',
      line: 'N/A',
      area: '외부',
      floor: '외부',
      sensors: {
        battery: Math.random() * 90 + 10,
        temperature: Math.random() * 60 - 10,
        signal: Math.random() * 50 + 50,
        altitude: Math.random() * 500,
        windSpeed: Math.random() * 30,
        flightTime: Math.random() * 3600,
        gpsLat: 37 + Math.random(),
        gpsLon: 126 + Math.random(),
        homeDistance: Math.random() * 1000,
      },
    });
  }
  
  return robots;
}

// 시뮬레이션 모드 플래그
let isSimulationMode = false;
let hasShownSimulationWarning = false;

// FastAPI 백엔드에서 최신 로봇 데이터 조회
export async function fetchLatestRobotData(): Promise<Robot[]> {
  try {
    // 이미 시뮬레이션 모드면 바로 시뮬레이션 데이터 반환
    if (isSimulationMode) {
      return generateSimulatedRobotData();
    }
    
    const response = await fetch(`${API_BASE_URL}/api/robots`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      // 타임아웃 설정 (1초)
      signal: AbortSignal.timeout(1000),
    });
    
    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
    }
    
    const robots: Robot[] = await response.json();
    
    // lastUpdate를 Date 객체로 변환
    robots.forEach(robot => {
      robot.lastUpdate = new Date(robot.lastUpdate);
    });
    
    if (!hasShownSimulationWarning) {
      console.log(`✅ FastAPI 서버 연결 성공 (${robots.length}대 로봇)`);
    }
    return robots;
    
  } catch (error) {
    // 시뮬레이션 모드로 전환
    isSimulationMode = true;
    
    // 최초 한 번만 경고 메시지 표시
    if (!hasShownSimulationWarning) {
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6');
      console.log('%c📡 시뮬레이션 모드로 실행 중', 'color: #3b82f6; font-size: 14px; font-weight: bold');
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6');
      console.log('ℹ️  FastAPI 서버를 시작하려면:');
      console.log('   → python backend/fastapi/main.py');
      console.log('');
      console.log('💡 현재는 프론트엔드 시뮬레이션 데이터로 작동합니다.');
      console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3b82f6');
      hasShownSimulationWarning = true;
    }
    
    // 시뮬레이션 데이터 반환
    return generateSimulatedRobotData();
  }
}
