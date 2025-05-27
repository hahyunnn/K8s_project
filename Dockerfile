# 베이스 이미지
FROM node:18

# 작업 디렉토리 생성
WORKDIR /usr/src/app

# app.js, bmiPage.html 복사
COPY app.js .
COPY bmiPage.html .

# 필요한 모듈 설치
RUN npm init -y && npm install express body-parser

# 포트 노출
EXPOSE 3000

# 앱 실행
CMD ["node", "app.js"]

