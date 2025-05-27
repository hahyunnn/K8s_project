const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 정적 파일 제공
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));

// BMI 입력 페이지
app.get('/bmiPage', (req, res) => {
  res.sendFile(path.join(__dirname, 'bmiPage.html'));
});

// BMI 계산 요청 처리
app.get('/bmi', (req, res) => {
  const heightCm = parseFloat(req.query.height);
  const weight = parseFloat(req.query.weight);

  if (isNaN(heightCm) || isNaN(weight) || heightCm <= 0 || weight <= 0) {
    return res.status(400).send({ error: '잘못된 입력입니다.' });
  }

  const heightM = heightCm / 100;
  const bmiRaw = weight / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  let category = '';
  if (bmi < 20) category = '저체중';
  else if (bmi < 25) category = '정상';
  else if (bmi < 30) category = '과체중';
  else category = '비만';

  // ✅ PVC 마운트 디렉토리에 로그 저장
  const logPath = '/logs/bmi-log.txt';
  const logText = `BMI: ${bmi} (${category})\n`;

  fs.appendFile(logPath, logText, (err) => {
    if (err) {
      console.error('❌ 로그 저장 실패:', err);
    } else {
      console.log('✅ 로그 저장 완료:', logText.trim());
    }
  });

  res.send({ bmi, category });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

