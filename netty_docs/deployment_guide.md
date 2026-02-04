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
        root /home/ubuntu/netty_grow/netty_client/dist;
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

**주의**: 위 설정에서 `root` 경로는 실제 `dist` 폴더가 있는 위치여야 합니다. 
(예: `/home/ubuntu/netty_grow/netty_client/dist`)

설정 활성화 및 Nginx 재시작:
```bash
sudo ln -s /etc/nginx/sites-available/netty /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

## 6. HTTPS 설정 (Certbot)
무료 SSL 인증서(Let's Encrypt)를 적용하여 HTTPS를 활성화합니다. **도메인이 연결되어 있어야 가능합니다.**

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx

# 인증서 발급 및 Nginx 설정 자동 업데이트
sudo certbot --nginx -d yourdomain.com
```
- 이메일 입력 및 약관 동의를 진행하면 자동으로 HTTPS 설정이 완료됩니다.

## 7. 필수 코드 변경 사항 (로컬 확인)

빌드 전, `netty_client/src/config.js`가 아래와 같이 되어 있어야 합니다:
```javascript
// 프로덕션(빌드) 환경에서는 빈 문자열을 반환하여
// API 요청이 Nginx의 프록시(/api)를 타도록 설정
export const API_BASE_URL = import.meta.env.PROD 
  ? '' 
  : `http://${window.location.hostname}:5000`;
```

## 8. 업데이트 워크플로우

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

## 9. 트러블슈팅 (Troubleshooting)

### Q: 빌드 중 "JavaScript heap out of memory" 오류 발생
EC2 프리 티어(t2.micro, t3.micro)나 t3.small 등 메모리가 적은 인스턴스에서 자주 발생합니다. **스왑 메모리(Swap Configuration)**를 설정하여 해결할 수 있습니다.

**해결 방법 (Swap 2GB 추가):**
```bash
# 1. 2GB 스왑 파일 생성
sudo fallocate -l 2G /swapfile

# 2. 권한 설정 (루트만 접근 가능)
sudo chmod 600 /swapfile

# 3. 스왑 영역 설정
sudo mkswap /swapfile

# 4. 스왑 활성화
sudo swapon /swapfile

# 5. 재부팅 후에도 유지되도록 설정 (/etc/fstab 등록)
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 6. 메모리 확인 (Swap 영역이 생겼는지 확인)
free -h
```
이제 다시 `npm run build`를 실행하면 성공할 것입니다.

### Q: 스왑 설정 후에도 여전히 메모리 부족 오류 발생 시
Node.js가 사용할 수 있는 최대 메모리 힙 크기를 명시적으로 늘려주어야 합니다. 빌드 명령어 앞에 옵션을 추가하세요:

```bash
# 메모리 제한을 3GB(3072MB)로 늘려서 빌드 (스왑 메모리가 충분해야 함)
NODE_OPTIONS="--max-old-space-size=3072" npm run build
```

### Q: 그래도 해결되지 않을 경우 (최후의 수단: 로컬 빌드)
서버에서 빌드하지 않고, 내 컴퓨터(로컬)에서 빌드한 결과물(`dist` 폴더)만 서버로 전송하는 방법입니다. 가장 확실한 방법입니다.

1.  **로컬 컴퓨터**에서 빌드:
    ```bash
    npm run build
    ```
2.  **SCP 명령어로 전송** (로컬 터미널에서 실행):
    ```bash
    # 예시: key.pem 파일이 있는 경로에서 실행
    scp -i "path/to/key.pem" -r dist ubuntu@<EC2-IP>:/var/www/netty/netty_client/
    ```
3.  **서버**에서는 `npm run build` 생략 가능.

