# Infrastructure

로컬 FastAPI 및 InfluxDB 실행 설정을 보관합니다.

```bash
cp .env.example .env
docker compose --env-file .env -f infra/docker-compose.yml config
docker compose --env-file .env -f infra/docker-compose.yml up -d
docker compose --env-file .env -f infra/docker-compose.yml down
```

`docker/legacy/`에는 기존에 `Dockerfile`이라는 디렉터리에 중복 저장되어 있던 Dockerfile 후보를 삭제하지 않고 보관했습니다. 실제 FastAPI 빌드는 `backend/fastapi/Dockerfile`을 사용합니다.

Grafana 설정은 아직 없으며 향후 `infra/grafana/`에 provisioning과 dashboard를 추가할 수 있습니다.
