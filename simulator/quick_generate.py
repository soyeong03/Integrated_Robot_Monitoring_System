"""
빠른 더미 데이터 생성 스크립트
기본 설정으로 바로 실행 (24시간 과거 + 10분 실시간)
"""
import sys
from generate_dummy_data import RobotDataGenerator

def main():
    print("=" * 80)
    print("🚀 빠른 더미 데이터 생성 (24시간 과거 + 10분 실시간)")
    print("=" * 80)
    
    generator = RobotDataGenerator()
    
    # InfluxDB 연결
    if not generator.connect():
        print("\n❌ InfluxDB 연결 실패. .env 파일을 확인하세요.")
        return
    
    try:
        # 1. 과거 데이터 생성 (24시간, 3분 간격)
        print("\n📊 1단계: 과거 24시간 데이터 생성 중...")
        generator.generate_historical_data(hours=24, interval_seconds=180)
        
        # 2. 실시간 데이터 생성 (10분, 3초 간격)
        print("\n🔄 2단계: 실시간 10분 데이터 생성 중...")
        generator.generate_realtime_data(duration_minutes=10, interval_seconds=3)
        
        print("\n" + "=" * 80)
        print("✅ 모든 데이터 생성 완료!")
        print("=" * 80)
        
    except KeyboardInterrupt:
        print("\n\n⏹️  사용자가 중단했습니다.")
    except Exception as e:
        print(f"\n❌ 에러 발생: {e}")
        import traceback
        traceback.print_exc()
    finally:
        generator.disconnect()

if __name__ == "__main__":
    main()
