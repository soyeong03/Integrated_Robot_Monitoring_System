"""
InfluxDB 더미 데이터 생성기
9대의 로봇(Robot-arm 3, UGV 3, Drone 3)에 대한 시계열 데이터 생성
"""
import os
from datetime import datetime, timedelta
import random
from typing import Dict, Any, List
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
from dotenv import load_dotenv
import time

# 환경 변수 로드
load_dotenv()

# InfluxDB 설정
INFLUXDB_URL = os.getenv("INFLUXDB_URL", "http://localhost:8086")
INFLUXDB_TOKEN = os.getenv("INFLUXDB_TOKEN")
INFLUXDB_ORG = os.getenv("INFLUXDB_ORG", "robot-fleet")
INFLUXDB_BUCKET = os.getenv("INFLUXDB_BUCKET", "robot-monitoring")

# 로봇 메타데이터
ROBOT_METADATA = {
    "robot-arm": [
        {
            "id": "RA001",
            "name": "Robot-arm 1",
            "group": "생산라인A",
            "manufacturer": "ABB",
            "department": "생산부문",
            "line": "1라인",
            "area": "생산라인",
            "floor": "1층"
        },
        {
            "id": "RA002",
            "name": "Robot-arm 2",
            "group": "생산라인B",
            "manufacturer": "KUKA",
            "department": "생산부문",
            "line": "2라인",
            "area": "생산라인",
            "floor": "2층"
        },
        {
            "id": "RA003",
            "name": "Robot-arm 3",
            "group": "조립라인",
            "manufacturer": "FANUC",
            "department": "생산부문",
            "line": "3라인",
            "area": "생산라인",
            "floor": "1층"
        }
    ],
    "ugv": [
        {
            "id": "UG001",
            "name": "UGV 1",
            "group": "물류A",
            "manufacturer": "Boston Dynamics",
            "department": "물류부문",
            "line": "N/A",
            "area": "창고A",
            "floor": "1층"
        },
        {
            "id": "UG002",
            "name": "UGV 2",
            "group": "물류B",
            "manufacturer": "Clearpath",
            "department": "물류부문",
            "line": "N/A",
            "area": "창고B",
            "floor": "2층"
        },
        {
            "id": "UG003",
            "name": "UGV 3",
            "group": "순찰",
            "manufacturer": "AgileX",
            "department": "물류부문",
            "line": "N/A",
            "area": "순찰구역",
            "floor": "1층"
        }
    ],
    "drone": [
        {
            "id": "DR001",
            "name": "Drone 1",
            "group": "외부작업A",
            "manufacturer": "DJI",
            "department": "외부작업",
            "line": "N/A",
            "area": "외부",
            "floor": "외부"
        },
        {
            "id": "DR002",
            "name": "Drone 2",
            "group": "외부작업B",
            "manufacturer": "Parrot",
            "department": "외부작업",
            "line": "N/A",
            "area": "외부",
            "floor": "외부"
        },
        {
            "id": "DR003",
            "name": "Drone 3",
            "group": "점검",
            "manufacturer": "Autel",
            "department": "외부작업",
            "line": "N/A",
            "area": "외부",
            "floor": "외부"
        }
    ]
}


class RobotDataGenerator:
    """로봇 데이터 생성기"""
    
    def __init__(self):
        self.client = None
        self.write_api = None
        
    def connect(self):
        """InfluxDB 연결"""
        try:
            self.client = InfluxDBClient(
                url=INFLUXDB_URL,
                token=INFLUXDB_TOKEN,
                org=INFLUXDB_ORG
            )
            self.write_api = self.client.write_api(write_options=SYNCHRONOUS)
            print(f"✅ InfluxDB 연결 완료: {INFLUXDB_URL}")
            return True
        except Exception as e:
            print(f"❌ InfluxDB 연결 실패: {e}")
            return False
    
    def disconnect(self):
        """InfluxDB 연결 해제"""
        if self.client:
            self.client.close()
            print("✅ InfluxDB 연결 해제")
    
    def generate_robot_arm_sensors(self, base_values: Dict = None) -> Dict[str, Any]:
        """Robot-arm 센서 데이터 생성 (자연스러운 변화)"""
        if base_values is None:
            base_values = {
                "temperature": 50.0,
                "efficiency": 85.0,
                "joint1Angle": 0.0,
                "joint2Angle": 0.0,
                "joint3Angle": 0.0,
                "torque": 50.0,
                "workSpeed": 60.0
            }
        
        return {
            "temperature": max(20, min(80, base_values["temperature"] + random.uniform(-0.5, 0.5))),
            "efficiency": max(70, min(100, base_values["efficiency"] + random.uniform(-1, 1))),
            "joint1Angle": max(-180, min(180, base_values["joint1Angle"] + random.uniform(-3, 3))),
            "joint2Angle": max(-180, min(180, base_values["joint2Angle"] + random.uniform(-3, 3))),
            "joint3Angle": max(-180, min(180, base_values["joint3Angle"] + random.uniform(-3, 3))),
            "gripperState": random.choice(["OPEN", "CLOSED"]),
            "torque": max(10, min(100, base_values["torque"] + random.uniform(-2, 2))),
            "workSpeed": max(0, min(100, base_values["workSpeed"] + random.uniform(-3, 3)))
        }
    
    def generate_ugv_sensors(self, base_values: Dict = None) -> Dict[str, Any]:
        """UGV 센서 데이터 생성 (자연스러운 변화)"""
        if base_values is None:
            base_values = {
                "battery": 80.0,
                "temperature": 40.0,
                "signal": 85.0,
                "efficiency": 85.0,
                "frontDistance": 200.0,
                "leftDistance": 150.0,
                "rightDistance": 150.0,
                "speed": 25.0,
                "pathProgress": 50.0
            }
        
        # 배터리는 시간에 따라 점진적으로 감소
        battery = max(10, base_values["battery"] - random.uniform(0, 0.1))
        
        return {
            "battery": battery,
            "temperature": max(20, min(60, base_values["temperature"] + random.uniform(-0.5, 0.5))),
            "signal": max(50, min(100, base_values["signal"] + random.uniform(-2, 2))),
            "efficiency": max(70, min(100, base_values["efficiency"] + random.uniform(-1, 1))),
            "frontDistance": max(0, min(500, base_values["frontDistance"] + random.uniform(-10, 10))),
            "leftDistance": max(0, min(500, base_values["leftDistance"] + random.uniform(-10, 10))),
            "rightDistance": max(0, min(500, base_values["rightDistance"] + random.uniform(-10, 10))),
            "speed": max(0, min(50, base_values["speed"] + random.uniform(-2, 2))),
            "pathProgress": min(100, base_values["pathProgress"] + random.uniform(0, 1))
        }
    
    def generate_drone_sensors(self, base_values: Dict = None) -> Dict[str, Any]:
        """Drone 센서 데이터 생성 (자연스러운 변화)"""
        if base_values is None:
            base_values = {
                "battery": 80.0,
                "temperature": 20.0,
                "signal": 85.0,
                "altitude": 100.0,
                "windSpeed": 5.0,
                "flightTime": 1800.0,
                "gpsLat": 37.5665,
                "gpsLon": 126.9780,
                "homeDistance": 500.0
            }
        
        # 배터리는 시간에 따라 점진적으로 감소
        battery = max(10, base_values["battery"] - random.uniform(0, 0.2))
        # 비행 시간은 증가
        flight_time = base_values["flightTime"] + random.uniform(0, 3)
        
        return {
            "battery": battery,
            "temperature": max(-10, min(50, base_values["temperature"] + random.uniform(-0.5, 0.5))),
            "signal": max(50, min(100, base_values["signal"] + random.uniform(-2, 2))),
            "altitude": max(0, min(500, base_values["altitude"] + random.uniform(-5, 5))),
            "windSpeed": max(0, min(30, base_values["windSpeed"] + random.uniform(-0.5, 0.5))),
            "flightTime": flight_time,
            "gpsLat": base_values["gpsLat"] + random.uniform(-0.0001, 0.0001),
            "gpsLon": base_values["gpsLon"] + random.uniform(-0.0001, 0.0001),
            "homeDistance": max(0, min(1000, base_values["homeDistance"] + random.uniform(-10, 10)))
        }
    
    def determine_status(self, robot_type: str, sensors: Dict[str, Any]) -> str:
        """센서 데이터를 기반으로 로봇 상태 결정"""
        if robot_type == "robot-arm":
            if sensors["temperature"] > 70 or sensors["efficiency"] < 75:
                return "warning"
            if sensors["temperature"] > 75 or sensors["efficiency"] < 70:
                return "error"
        elif robot_type == "ugv":
            if sensors["battery"] < 30 or sensors["temperature"] > 50:
                return "warning"
            if sensors["battery"] < 20 or sensors["temperature"] > 55:
                return "error"
        elif robot_type == "drone":
            if sensors["battery"] < 30 or sensors["signal"] < 60:
                return "warning"
            if sensors["battery"] < 20 or sensors["signal"] < 50:
                return "error"
        
        return "normal"
    
    def create_data_point(self, robot_type: str, robot_meta: Dict, sensors: Dict[str, Any], 
                         timestamp: datetime) -> Point:
        """InfluxDB 데이터 포인트 생성"""
        status = self.determine_status(robot_type, sensors)
        
        # 측정값 이름은 robot_type
        point = Point(robot_type) \
            .tag("robot_id", robot_meta["id"]) \
            .tag("robot_name", robot_meta["name"]) \
            .tag("group", robot_meta["group"]) \
            .tag("manufacturer", robot_meta["manufacturer"]) \
            .tag("department", robot_meta["department"]) \
            .tag("line", robot_meta["line"]) \
            .tag("area", robot_meta["area"]) \
            .tag("floor", robot_meta["floor"]) \
            .tag("status", status) \
            .time(timestamp)
        
        # 센서 데이터를 필드로 추가
        for key, value in sensors.items():
            if isinstance(value, (int, float)):
                point = point.field(key, float(value))
            else:
                point = point.field(key, str(value))
        
        return point
    
    def generate_historical_data(self, hours: int = 24, interval_seconds: int = 180):
        """과거 데이터 생성 (기본 24시간, 3분 간격)"""
        print(f"\n📊 과거 {hours}시간 데이터 생성 시작 (간격: {interval_seconds}초)")
        
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        # 각 로봇의 기준 센서 값 저장
        robot_base_values = {}
        
        current_time = start_time
        total_points = 0
        batch_size = 1000  # 배치 크기
        batch_points = []
        
        while current_time <= end_time:
            for robot_type, robots in ROBOT_METADATA.items():
                for robot_meta in robots:
                    robot_id = robot_meta["id"]
                    
                    # 로봇별 기준 값 초기화 또는 업데이트
                    if robot_id not in robot_base_values:
                        robot_base_values[robot_id] = None
                    
                    # 센서 데이터 생성
                    if robot_type == "robot-arm":
                        sensors = self.generate_robot_arm_sensors(robot_base_values[robot_id])
                    elif robot_type == "ugv":
                        sensors = self.generate_ugv_sensors(robot_base_values[robot_id])
                    else:  # drone
                        sensors = self.generate_drone_sensors(robot_base_values[robot_id])
                    
                    # 다음 생성을 위해 기준 값 저장
                    robot_base_values[robot_id] = sensors.copy()
                    
                    # 데이터 포인트 생성
                    point = self.create_data_point(robot_type, robot_meta, sensors, current_time)
                    batch_points.append(point)
                    total_points += 1
                    
                    # 배치 크기에 도달하면 쓰기
                    if len(batch_points) >= batch_size:
                        try:
                            self.write_api.write(bucket=INFLUXDB_BUCKET, record=batch_points)
                            print(f"  ✅ {total_points:,}개 포인트 작성 완료 ({current_time.strftime('%Y-%m-%d %H:%M:%S')})")
                            batch_points = []
                        except Exception as e:
                            print(f"  ❌ 쓰기 실패: {e}")
                            batch_points = []
            
            current_time += timedelta(seconds=interval_seconds)
        
        # 남은 데이터 쓰기
        if batch_points:
            try:
                self.write_api.write(bucket=INFLUXDB_BUCKET, record=batch_points)
                print(f"  ✅ 마지막 {len(batch_points)}개 포인트 작성 완료")
            except Exception as e:
                print(f"  ❌ 마지막 배치 쓰기 실패: {e}")
        
        print(f"✅ 과거 데이터 생성 완료: 총 {total_points:,}개 포인트")
        return total_points
    
    def generate_realtime_data(self, duration_minutes: int = 60, interval_seconds: int = 3):
        """실시간 데이터 생성 (기본 60분, 3초 간격)"""
        print(f"\n🔄 실시간 데이터 생성 시작 ({duration_minutes}분, 간격: {interval_seconds}초)")
        print("  Ctrl+C로 중단...")
        
        # 각 로봇의 기준 센서 값 저장
        robot_base_values = {}
        
        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=duration_minutes)
        total_points = 0
        
        try:
            while datetime.now() < end_time:
                current_time = datetime.now()
                points = []
                
                for robot_type, robots in ROBOT_METADATA.items():
                    for robot_meta in robots:
                        robot_id = robot_meta["id"]
                        
                        # 로봇별 기준 값 초기화 또는 업데이트
                        if robot_id not in robot_base_values:
                            robot_base_values[robot_id] = None
                        
                        # 센서 데이터 생성
                        if robot_type == "robot-arm":
                            sensors = self.generate_robot_arm_sensors(robot_base_values[robot_id])
                        elif robot_type == "ugv":
                            sensors = self.generate_ugv_sensors(robot_base_values[robot_id])
                        else:  # drone
                            sensors = self.generate_drone_sensors(robot_base_values[robot_id])
                        
                        # 다음 생성을 위해 기준 값 저장
                        robot_base_values[robot_id] = sensors.copy()
                        
                        # 데이터 포인트 생성
                        point = self.create_data_point(robot_type, robot_meta, sensors, current_time)
                        points.append(point)
                
                # InfluxDB에 쓰기
                try:
                    self.write_api.write(bucket=INFLUXDB_BUCKET, record=points)
                    total_points += len(points)
                    elapsed = (datetime.now() - start_time).total_seconds()
                    print(f"  ✅ [{int(elapsed)}s] {len(points)}개 포인트 작성 (총: {total_points:,})")
                except Exception as e:
                    print(f"  ❌ 쓰기 실패: {e}")
                
                # 다음 주기까지 대기
                time.sleep(interval_seconds)
                
        except KeyboardInterrupt:
            print("\n\n⏹️  중단됨")
        
        print(f"✅ 실시간 데이터 생성 완료: 총 {total_points:,}개 포인트")
        return total_points


def main():
    """메인 함수"""
    print("=" * 80)
    print("🤖 로봇 플릿 모니터링 - InfluxDB 더미 데이터 생성기")
    print("=" * 80)
    print(f"InfluxDB URL: {INFLUXDB_URL}")
    print(f"Organization: {INFLUXDB_ORG}")
    print(f"Bucket: {INFLUXDB_BUCKET}")
    print(f"로봇 수: 9대 (Robot-arm: 3, UGV: 3, Drone: 3)")
    print("=" * 80)
    
    # 환경 변수 체크
    if not INFLUXDB_TOKEN:
        print("❌ INFLUXDB_TOKEN 환경 변수가 설정되지 않았습니다.")
        print("   .env 파일에 INFLUXDB_TOKEN을 설정하세요.")
        return
    
    generator = RobotDataGenerator()
    
    # InfluxDB 연결
    if not generator.connect():
        return
    
    try:
        print("\n📋 메뉴:")
        print("  1. 과거 데이터 생성 (24시간, 3분 간격)")
        print("  2. 실시간 데이터 생성 (60분, 3초 간격)")
        print("  3. 과거 + 실시간 데이터 생성")
        print("  4. 커스텀 설정")
        
        choice = input("\n선택 (1-4): ").strip()
        
        if choice == "1":
            generator.generate_historical_data(hours=24, interval_seconds=180)
            
        elif choice == "2":
            generator.generate_realtime_data(duration_minutes=60, interval_seconds=3)
            
        elif choice == "3":
            print("\n🔄 과거 + 실시간 데이터 생성")
            generator.generate_historical_data(hours=24, interval_seconds=180)
            generator.generate_realtime_data(duration_minutes=60, interval_seconds=3)
            
        elif choice == "4":
            print("\n⚙️  커스텀 설정")
            mode = input("모드 (1: 과거, 2: 실시간, 3: 둘 다): ").strip()
            
            if mode in ["1", "3"]:
                hours = int(input("과거 데이터 시간 (시간): ") or "24")
                interval = int(input("과거 데이터 간격 (초): ") or "180")
                generator.generate_historical_data(hours=hours, interval_seconds=interval)
            
            if mode in ["2", "3"]:
                duration = int(input("실시간 데이터 지속 시간 (분): ") or "60")
                interval = int(input("실시간 데이터 간격 (초): ") or "3")
                generator.generate_realtime_data(duration_minutes=duration, interval_seconds=interval)
        
        else:
            print("❌ 잘못된 선택입니다.")
            
    except Exception as e:
        print(f"\n❌ 에러 발생: {e}")
        import traceback
        traceback.print_exc()
        
    finally:
        generator.disconnect()
        print("\n" + "=" * 80)
        print("✅ 프로그램 종료")
        print("=" * 80)


if __name__ == "__main__":
    main()