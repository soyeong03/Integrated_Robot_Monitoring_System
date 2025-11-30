"""
FastAPI 백엔드 - InfluxDB 실제 연동
시뮬레이션 모드와 InfluxDB 모드 둘 다 지원
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import random
import os
from typing import List, Dict, Any, Optional
import uvicorn
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

# InfluxDB 연결 시도
INFLUX_ENABLED = False
try:
    from influxdb_client import InfluxDBClient
    
    INFLUXDB_URL = os.getenv("INFLUXDB_URL", "http://localhost:8086")
    INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN")
    INFLUXDB_ORG = os.getenv("INFLUXDB_ORG", "robot-fleet")
    INFLUXDB_BUCKET = os.getenv("INFLUXDB_BUCKET", "robot-monitoring")
    
    if INFLUXDB_TOKEN:
        influx_client = InfluxDBClient(
            url=INFLUXDB_URL,
            token=INFLUXDB_TOKEN,
            org=INFLUXDB_ORG
        )
        query_api = influx_client.query_api()
        INFLUX_ENABLED = True
        print("✅ InfluxDB 연결 성공")
    else:
        print("⚠️  INFLUXDB_TOKEN이 없어 시뮬레이션 모드로 실행됩니다.")
except Exception as e:
    print(f"⚠️  InfluxDB 연결 실패, 시뮬레이션 모드로 실행됩니다: {e}")

app = FastAPI(title="Robot Fleet Monitoring API")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== 시뮬레이션 데이터 생성 함수 ====================

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

def generate_simulated_robot_data() -> List[Dict[str, Any]]:
    """시뮬레이션: 9대의 로봇 데이터 생성"""
    robots = []
    
    # Robot-arm 3대
    for i in range(1, 4):
        status_choice = random.choices(['normal', 'warning', 'error'], weights=[0.7, 0.2, 0.1])[0]
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
        status_choice = random.choices(['normal', 'warning', 'error'], weights=[0.7, 0.2, 0.1])[0]
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
        status_choice = random.choices(['normal', 'warning', 'error'], weights=[0.7, 0.2, 0.1])[0]
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

# ==================== InfluxDB 데이터 읽기 함수 ====================

def query_influx_latest_data() -> List[Dict[str, Any]]:
    """InfluxDB에서 최신 데이터 조회"""
    if not INFLUX_ENABLED:
        return generate_simulated_robot_data()
    
    try:
        # 최근 10초 이내의 데이터 조회
        query = f'''
        from(bucket: "{INFLUXDB_BUCKET}")
          |> range(start: -10s)
          |> filter(fn: (r) => r["_measurement"] == "robot-arm" or r["_measurement"] == "ugv" or r["_measurement"] == "drone")
          |> last()
        '''
        
        tables = query_api.query(query, org=INFLUXDB_ORG)
        
        # 로봇별로 데이터 그룹화
        robots_data = {}
        
        for table in tables:
            for record in table.records:
                robot_id = record.values.get("robot_id")
                
                if robot_id not in robots_data:
                    robots_data[robot_id] = {
                        "id": robot_id,
                        "name": record.values.get("robot_name"),
                        "type": record.values.get("_measurement"),
                        "status": record.values.get("status"),
                        "taskId": f"TASK-{random.randint(1000, 9999)}",  # 임시
                        "group": record.values.get("group"),
                        "lastUpdate": record.get_time().isoformat(),
                        "manufacturer": record.values.get("manufacturer"),
                        "department": record.values.get("department"),
                        "line": record.values.get("line"),
                        "area": record.values.get("area"),
                        "floor": record.values.get("floor"),
                        "sensors": {}
                    }
                
                # 센서 데이터 추가
                field_name = record.get_field()
                field_value = record.get_value()
                robots_data[robot_id]["sensors"][field_name] = field_value
        
        result = list(robots_data.values())
        
        # 데이터가 없으면 시뮬레이션 데이터 반환
        if not result:
            print("⚠️  InfluxDB에 데이터가 없습니다. 시뮬레이션 데이터를 반환합니다.")
            return generate_simulated_robot_data()
        
        return result
        
    except Exception as e:
        print(f"❌ InfluxDB 쿼리 실패: {e}")
        return generate_simulated_robot_data()

def query_influx_timeseries(robot_id: str, hours: int = 1) -> Dict[str, List[Dict[str, Any]]]:
    """특정 로봇의 시계열 데이터 조회"""
    if not INFLUX_ENABLED:
        # 시뮬레이션: 간단한 시계열 데이터 생성
        return generate_simulated_timeseries(robot_id, hours)
    
    try:
        # 로봇 타입 결정
        robot_type_map = {"RA": "robot-arm", "UG": "ugv", "DR": "drone"}
        robot_type = robot_type_map.get(robot_id[:2], "robot-arm")
        
        query = f'''
        from(bucket: "{INFLUXDB_BUCKET}")
          |> range(start: -{hours}h)
          |> filter(fn: (r) => r["_measurement"] == "{robot_type}")
          |> filter(fn: (r) => r["robot_id"] == "{robot_id}")
        '''
        
        tables = query_api.query(query, org=INFLUXDB_ORG)
        
        # 센서별로 데이터 그룹화
        timeseries = {}
        
        for table in tables:
            for record in table.records:
                field_name = record.get_field()
                
                if field_name not in timeseries:
                    timeseries[field_name] = []
                
                timeseries[field_name].append({
                    "time": record.get_time().isoformat(),
                    "value": record.get_value()
                })
        
        # 데이터가 없으면 시뮬레이션 데이터 반환
        if not timeseries:
            return generate_simulated_timeseries(robot_id, hours)
        
        return timeseries
        
    except Exception as e:
        print(f"❌ InfluxDB 시계열 쿼리 실패: {e}")
        return generate_simulated_timeseries(robot_id, hours)

def generate_simulated_timeseries(robot_id: str, hours: int = 1) -> Dict[str, List[Dict[str, Any]]]:
    """시뮬레이션: 시계열 데이터 생성"""
    robot_type_map = {"RA": "robot-arm", "UG": "ugv", "DR": "drone"}
    robot_type = robot_type_map.get(robot_id[:2], "robot-arm")
    
    # 10분 간격으로 데이터 생성
    points = hours * 6
    timeseries = {}
    
    for i in range(points):
        timestamp = (datetime.now() - timedelta(minutes=10 * (points - i))).isoformat()
        
        if robot_type == "robot-arm":
            sensors = generate_robot_arm_sensors()
        elif robot_type == "ugv":
            sensors = generate_ugv_sensors()
        else:
            sensors = generate_drone_sensors()
        
        for key, value in sensors.items():
            if isinstance(value, (int, float)):
                if key not in timeseries:
                    timeseries[key] = []
                timeseries[key].append({"time": timestamp, "value": value})
    
    return timeseries

# ==================== API 엔드포인트 ====================

@app.get("/")
async def root():
    """API 루트 엔드포인트"""
    return {
        "message": "Robot Fleet Monitoring API",
        "version": "2.0.0",
        "status": "running",
        "influxdb_enabled": INFLUX_ENABLED,
        "mode": "InfluxDB" if INFLUX_ENABLED else "Simulation"
    }

@app.get("/api/robots")
async def get_robots() -> List[Dict[str, Any]]:
    """
    모든 로봇의 최신 데이터 조회
    
    Returns:
        List[Dict]: 9대 로봇의 최신 상태 데이터
    """
    try:
        robots = query_influx_latest_data()
        print(f"✅ {len(robots)}대 로봇 데이터 조회 완료 (모드: {'InfluxDB' if INFLUX_ENABLED else 'Simulation'})")
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
    robots = query_influx_latest_data()
    robot = next((r for r in robots if r["id"] == robot_id), None)
    
    if not robot:
        raise HTTPException(status_code=404, detail=f"Robot {robot_id} not found")
    
    return robot

@app.get("/api/robots/{robot_id}/timeseries")
async def get_robot_timeseries(
    robot_id: str,
    hours: Optional[int] = Query(default=1, ge=1, le=168)
) -> Dict[str, List[Dict[str, Any]]]:
    """
    특정 로봇의 시계열 데이터 조회
    
    Args:
        robot_id: 로봇 ID (예: RA001, UG001, DR001)
        hours: 조회할 시간 범위 (시간 단위, 기본 1시간, 최대 168시간=7일)
    
    Returns:
        Dict: 센서별 시계열 데이터
    """
    try:
        timeseries = query_influx_timeseries(robot_id, hours)
        return timeseries
    except Exception as e:
        print(f"❌ 시계열 데이터 조회 실패: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "influxdb_enabled": INFLUX_ENABLED
    }

@app.get("/api/mode")
async def get_mode():
    """현재 동작 모드 확인"""
    return {
        "mode": "InfluxDB" if INFLUX_ENABLED else "Simulation",
        "influxdb_enabled": INFLUX_ENABLED,
        "influxdb_url": INFLUXDB_URL if INFLUX_ENABLED else None
    }

if __name__ == "__main__":
    print("=" * 80)
    print("🚀 Robot Fleet Monitoring API 시작")
    print("=" * 80)
    print(f"모드: {'✅ InfluxDB 연동' if INFLUX_ENABLED else '⚠️  시뮬레이션'}")
    print(f"📡 http://localhost:8000")
    print(f"📚 API 문서: http://localhost:8000/docs")
    print("=" * 80)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
