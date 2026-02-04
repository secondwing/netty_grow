# Netty 프로젝트 AWS EC2 배포 가이드

## 1. 사전 준비 사항 (Prerequisites)
- **AWS 계정**: EC2 인스턴스를 생성할 수 있어야 합니다.
- **GitHub 저장소**: 모든 코드가 GitHub에 푸시되어 있어야 합니다.
- **터미널**: 서버에 SSH 접속을 할 수 있는 터미널 (Git Bash, PowerShell, Mac Terminal 등).

## 2. EC2 인스턴스 생성
1.  **OS**: Ubuntu Server 24.04 LTS (또는 22.04 LTS).
2.  **인스턴스 유형**: `t3.small` 또는 `t3.medium` 권장 (`t2.micro`는 빌드 시 멈출 수 있으나, 스왑 메모리 설정 시 사용 가능).
3.  **키 페어 (Key Pair)**: `.pem` 키 파일을 생성하고 다운로드하여 안전한 곳에 보관하세요.
4.  **보안 그룹 (Security Group)**: 인바운드 규칙 설정:
    -   **SSH (포트 22)**: 내 IP에서만 허용 (권장) 또는 위치 무관.
    -   **HTTP (포트 80)**: 위치 무관 `0.0.0.0/0`.
    -   **HTTPS (포트 443)**: 위치 무관 `0.0.0.0/0`.

## 3. 서버 초기 설정 (Ubuntu)
터미널을 열고 키 페어가 있는 폴더로 이동 후 SSH 접속:
```bash
ssh -i "path/to/key.pem" ubuntu@<your-ec2-ip>
```

시스템 업데이트 및 필수 프로그램 설치:
```bash
# 패키지 목록 업데이트 및 업그레이드
sudo apt update && sudo apt upgrade -y

# Node.js (v20) 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Nginx, Git 설치
sudo apt install -y nginx git

# PM2 (프로세스 관리 도구) 설치
sudo npm install -g pm2
```

### 옵션 A: MongoDB Atlas (권장)
클라우드 호스팅 MongoDB (MongoDB Atlas)를 사용하는 경우:
1.  이전과 동일하게 Connection String (e.g., `mongodb+srv://...`)을 준비합니다.
2.  Atlas Network Access 설정에서 EC2의 IP 주소를 허용 리스트에 추가해야 합니다.

### 옵션 B: 로컬 MongoDB 설치 (EC2 내부)
서버 내부에 DB를 직접 설치해야 하는 경우 (프로덕션 확장성 측면에서 비권장이지만 소규모 프로젝트엔 무방):
```bash
sudo apt install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 4. 프로젝트 클론 및 설정
웹 서버 표준 디렉토리인 `/var/www`로 이동하여 클론합니다:
```bash
sudo mkdir -p /var/www
sudo chown -R ubuntu:ubuntu /var/www
cd /var/www
git clone https://github.com/<사용자명>/<레포지토리명>.git netty
cd netty
```

### 4.1 백엔드 설정 (netty_server)
```bash
cd netty_server
npm install

# .env 파일 생성
nano .env
```
프로덕션 환경 변수를 입력합니다:
```env
PORT=5000
MONGODB_URI=당신의_몽고DB_주소
JWT_SECRET=보안_시크릿_키
NODE_ENV=production
```
PM2로 서버 실행:
```bash
pm2 start index.js --name "netty-server"
pm2 save
pm2 startup
```

### 4.2 프론트엔드 설정 (netty_client)
**중요**: 로컬에서 `src/config.js`가 프로덕션 설정을 지원하도록 수정되었는지 확인 후 진행하세요 (6번 항목 참조).

```bash
cd ../netty_client
npm install
npm run build
```
빌드가 완료되면 `dist` 폴더가 생성됩니다. Nginx가 이 폴더를 서빙하게 됩니다.

## 5. Nginx 설정 (리버스 프록시)
Nginx가 프론트엔드(정적 파일)와 백엔드(API) 앞단에서 요청을 처리하도록 설정합니다.

설정 파일 생성:
```bash
sudo nano /etc/nginx/sites-available/netty
```

아래 내용을 붙여넣으세요 (`your_domain_or_ip` 부분을 EC2 퍼블릭 IP나 도메인으로 변경):
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    # 프론트엔드 (정적 파일 서빙)
    location / {
        root /var/www/netty/netty_client/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 (API 요청 프록시)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

설정 활성화 및 Nginx 재시작:
```bash
sudo ln -s /etc/nginx/sites-available/netty /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 6. 필수 코드 변경 사항 (로컬 확인)
빌드 전, `netty_client/src/config.js`가 아래와 같이 되어 있어야 합니다:
```javascript
// 프로덕션(빌드) 환경에서는 빈 문자열을 반환하여
// API 요청이 Nginx의 프록시(/api)를 타도록 설정
export const API_BASE_URL = import.meta.env.PROD 
  ? '' 
  : `http://${window.location.hostname}:5000`;
```

## 7. 업데이트 워크플로우
추후 코드 수정 시 배포 방법:

1.  **로컬**: 코드 수정 후 `git push`.
2.  **서버**:
    ```bash
    cd /var/www/netty
    git pull origin main
    
    # 백엔드 변경 시:
    cd netty_server
    npm install # 패키지 변경 시만
    pm2 restart netty-server
    
    # 프론트엔드 변경 시:
    cd ../netty_client
    npm install # 패키지 변경 시만
    npm run build
    # Nginx는 정적 파일을 참조하므로 재시작 불필요
    ```
