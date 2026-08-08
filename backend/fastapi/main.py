"""
FastAPI 백엔드 - InfluxDB 연동 및 로봇 데이터 제공
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import random
from typing import List, Dict, Any, Union
import uvicorn

app = FastAPI(title="Robot Fleet Monitoring API")

# CORS 설정 - 프론트엔드에서 접근 가능하도록
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 환경이므로 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 시뮬레이션 데이터 생성 함수
def generate_robot_arm_sensors() -> Dict[str, Any]:
    """Robot-arm 센서 데이터 생성"""
    return {
        "temperature": round(random.uniform(20, 80), 1),
        "efficiency": round(random.uniform(70, 100), 1),
        "joint1Angle": round(random.uniform(-180, 180), 1),
        "joint2Angle": round(random.uniform(-180, 180), 1),
        "joint3Angle": round(random.uniform(-180, 180), 1),
        "gripperState": random.choice(["OPEN", "CLOSED"]),
        "torque": round(random.uniform(10, 100), 1),
        "workSpeed": round(random.uniform(0, 100), 1),
    }

def generate_ugv_sensors() -> Dict[str, Any]:
    """UGV 센서 데이터 생성"""
    return {
        "battery": round(random.uniform(10, 100), 1),
        "temperature": round(random.uniform(20, 60), 1),
        "signal": round(random.uniform(50, 100), 1),
        "efficiency": round(random.uniform(70, 100), 1),
        "frontDistance": round(random.uniform(0, 500), 1),
        "leftDistance": round(random.uniform(0, 500), 1),
        "rightDistance": round(random.uniform(0, 500), 1),
        "speed": round(random.uniform(0, 50), 1),
        "pathProgress": round(random.uniform(0, 100), 1),
    }

def generate_drone_sensors() -> Dict[str, Any]:
    """Drone 센서 데이터 생성"""
    return {
        "battery": round(random.uniform(10, 100), 1),
        "temperature": round(random.uniform(-10, 50), 1),
        "signal": round(random.uniform(50, 100), 1),
        "altitude": round(random.uniform(0, 500), 1),
        "windSpeed": round(random.uniform(0, 30), 1),
        "flightTime": round(random.uniform(0, 3600), 1),
        "gpsLat": round(random.uniform(37.0, 38.0), 6),
        "gpsLon": round(random.uniform(126.0, 127.0), 6),
        "homeDistance": round(random.uniform(0, 1000), 1),
    }

def generate_robot_data() -> List[Dict[str, Any]]:
    """9대의 로봇 데이터 생성 (Robot-arm 3, UGV 3, Drone 3)"""
    robots = []
    
    # Robot-arm 3대
    for i in range(1, 4):
        status_choice = random.choices(
            ['normal', 'warning', 'error'],
            weights=[0.7, 0.2, 0.1]
        )[0]
        
        robots.append({
            "id": f"RA{i:03d}",
            "name": f"Robot-arm {i}",
            "type": "robot-arm",
            "status": status_choice,
            "taskId": f"TASK-{random.randint(1000, 9999)}",
            "group": random.choice(["생산라인A", "생산라인B", "조립라인"]),
            "lastUpdate": datetime.now().isoformat(),
            "manufacturer": random.choice(["ABB", "KUKA", "FANUC"]),
            "department": "생산부문",
            "line": f"{i}라인",
            "area": "생산라인",
            "floor": f"{random.randint(1, 3)}층",
            "sensors": generate_robot_arm_sensors()
        })
    
    # UGV 3대
    for i in range(1, 4):
        status_choice = random.choices(
            ['normal', 'warning', 'error'],
            weights=[0.7, 0.2, 0.1]
        )[0]
        
        robots.append({
            "id": f"UG{i:03d}",
            "name": f"UGV {i}",
            "type": "ugv",
            "status": status_choice,
            "taskId": f"TASK-{random.randint(1000, 9999)}",
            "group": random.choice(["물류A", "물류B", "순찰"]),
            "lastUpdate": datetime.now().isoformat(),
            "manufacturer": random.choice(["Boston Dynamics", "Clearpath", "AgileX"]),
            "department": "물류부문",
            "line": "N/A",
            "area": random.choice(["창고A", "창고B", "순찰구역"]),
            "floor": f"{random.randint(1, 2)}층",
            "sensors": generate_ugv_sensors()
        })
    
    # Drone 3대
    for i in range(1, 4):
        status_choice = random.choices(
            ['normal', 'warning', 'error'],
            weights=[0.7, 0.2, 0.1]
        )[0]
        
        robots.append({
            "id": f"DR{i:03d}",
            "name": f"Drone {i}",
            "type": "drone",
            "status": status_choice,
            "taskId": f"TASK-{random.randint(1000, 9999)}",
            "group": random.choice(["외부작업A", "외부작업B", "점검"]),
            "lastUpdate": datetime.now().isoformat(),
            "manufacturer": random.choice(["DJI", "Parrot", "Autel"]),
            "department": "외부작업",
            "line": "N/A",
            "area": "외부",
            "floor": "외부",
            "sensors": generate_drone_sensors()
        })
    
    return robots

@app.get("/")
async def root():
    """API 루트 엔드포인트"""
    return {
        "message": "Robot Fleet Monitoring API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/robots")
async def get_robots() -> List[Dict[str, Any]]:
    """
    모든 로봇의 최신 데이터 조회
    
    Returns:
        List[Dict]: 9대 로봇의 최신 상태 데이터
    """
    try:
        robots = generate_robot_data()
        print(f"✅ {len(robots)}대 로봇 데이터 생성 완료")
        return robots
    except Exception as e:
        print(f"❌ 에러 발생: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/robots/{robot_id}")
async def get_robot(robot_id: str) -> Dict[str, Any]:
    """
    특정 로봇의 데이터 조회
    
    Args:
        robot_id: 로봇 ID (예: RA001, UG001, DR001)
    
    Returns:
        Dict: 로봇 데이터
    """
    robots = generate_robot_data()
    robot = next((r for r in robots if r["id"] == robot_id), None)
    
    if not robot:
        raise HTTPException(status_code=404, detail=f"Robot {robot_id} not found")
    
    return robot

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    print("🚀 FastAPI 서버 시작 중...")
    print("📡 http://localhost:8000")
    print("📚 API 문서: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
