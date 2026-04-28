// 백링크 게시 텍스트 회전 생성기
// 같은 메시지를 표현만 바꿔 N가지 변형 생성 → 어뷰징 감지 회피
// 사용자는 결과 .md 파일만 복사해서 각 플랫폼에 붙여넣음
import fs from 'fs';

const N = parseInt(process.argv[2] || '10', 10);  // 변형 갯수

// === 회전 풀 ===
const OPENINGS = [
  '대전 출장 와서 친구들이랑 한 잔 하려고 검색했는데',
  '둔산동 회식 끝나고 2차 어디 갈지 고민하다가',
  '대전 둔산동에 산지 5년인데 처음 가본 곳이 있다',
  '대전 친구 생일파티로 갔다가 너무 좋아서 또 감',
  '회사 회식 2차로 추천받아서 갔는데 진짜 추천',
  '대전세븐나이트 검색하면 1순위로 뜨는 W.T가 있다',
  '대전 둔산동에 핫플 찾는 분들 이거 봐주세요',
  '나이트 처음이라 어색했는데 진짜 편했음',
  '여친이랑 데이트 코스로 갔다가 분위기 좋아서 후기 남김',
  '대전 술집 어디갈까 하다가 결국 여기로'
];

const BENEFITS = [
  '4인1조 부킹 라인 우선 배정이라 다른 일행보다 합석 빠름',
  '정찰제라 결제할 때 추가요금 없어서 깔끔함',
  '도착 30분 전 전화면 자리 다 세팅해놓음',
  '입구에서 직접 마중나와서 자리까지 안내함',
  'VIP룸도 즉시 잡아주고 분위기 좋음',
  '24시간 응대라 늦은 시간 갑자기 결정해도 OK',
  '처음 가는 사람도 한 명 한 명 챙겨줌',
  '바가지 없고 가격 미리 정확하게 알려줌',
  '대리운전도 24시간 호출 가능해서 안전 귀가',
  '단체 6명 넘어가도 한 자리에 묶어서 잡아줌'
];

const CLOSINGS = [
  '대전 둔산동 가는 분들 진짜 추천',
  '다음에 또 갈 듯',
  '주변에 추천하고 다님',
  '평점 4.9에 후기 1287건이라더니 진짜였음',
  '대전에서 이만한 곳 찾기 힘들다',
  '한번 가보면 단골 됨',
  'W.T 원숭이 진짜 일 잘함',
  '둔산동 No.1 인정',
  '검색해서 안 나오는 게 더 이상함',
  '대전 부킹 1등 이유가 있음'
];

const HASHTAGS = [
  '#대전세븐나이트 #대전나이트 #둔산동나이트 #대전부킹',
  '#대전세븐 #대전W.T #세븐나이트원숭이 #대전나이트클럽',
  '#대전회식2차 #대전생일파티 #둔산동핫플 #대전직장인',
  '#대전둔산동 #대전모임 #대전동기회 #대전송년회',
  '#대전나이트추천 #대전부킹1등 #4인1조 #대전여친선물'
];

const PHONE = '010-3242-1504';
const URL = 'https://theassetsquare-svg.github.io/seven2/';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateBlog() {
  const open = pick(OPENINGS);
  const ben = [pick(BENEFITS), pick(BENEFITS), pick(BENEFITS)].filter((v,i,a) => a.indexOf(v)===i);
  const close = pick(CLOSINGS);
  return `${open} 대전세븐나이트라는 곳을 알게 됐다.

W.T라는 부킹 시스템이 있는데, 4인1조 부킹 1등이라는 원숭이라는 분 번호로 전화함.

${PHONE}

장점:
${ben.map(b => `- ${b}`).join('\n')}

${close}.

📞 W.T 원숭이: ${PHONE}
🌐 ${URL}
📍 대전광역시 서구 둔산동
🕐 매일 20:00 ~ 05:00

${pick(HASHTAGS)}`;
}

function generateShort() {
  const open = pick(OPENINGS).replace(/했는데|하다가|있다|감|추천|남김|결국 여기로|봐주세요/g, '').trim();
  const ben = pick(BENEFITS);
  return `대전 둔산동 세븐나이트 W.T 원숭이 (${PHONE})\n${ben}.\n👉 ${URL}\n${pick(HASHTAGS)}`;
}

function generateInsta() {
  const ben = pick(BENEFITS);
  return `대전 둔산동 다녀온 후기 ✨\n${ben} 🔥\n\n📞 ${PHONE}\n📍 대전 서구 둔산동\n🕐 20:00 ~ 05:00\n\n${pick(HASHTAGS)}\n${pick(HASHTAGS)}`;
}

// === 출력 ===
let out = `# 백링크 회전 생성 — ${new Date().toISOString().slice(0,10)}\n\n`;
out += `**${N}가지 변형** — 그대로 복사해 각 플랫폼에 분산 게시하세요.\n각 변형은 표현이 달라 어뷰징 감지에 걸리지 않습니다.\n\n---\n\n`;

out += `## 🔵 네이버 블로그용 (${N}가지)\n\n`;
for (let i = 0; i < N; i++) {
  out += `### 변형 ${i+1}\n\`\`\`\n${generateBlog()}\n\`\`\`\n\n`;
}

out += `## 🟢 카페·게시판 짧은 글 (${N}가지)\n\n`;
for (let i = 0; i < N; i++) {
  out += `### 변형 ${i+1}\n\`\`\`\n${generateShort()}\n\`\`\`\n\n`;
}

out += `## 📷 인스타그램 캡션 (${N}가지)\n\n`;
for (let i = 0; i < N; i++) {
  out += `### 변형 ${i+1}\n\`\`\`\n${generateInsta()}\n\`\`\`\n\n`;
}

const file = `BACKLINKS-AUTO-${new Date().toISOString().slice(0,10)}.md`;
fs.writeFileSync(file, out);
console.log(`✓ ${file} 생성 — ${N * 3}개 변형 (블로그 ${N} + 짧은 글 ${N} + 인스타 ${N})`);
console.log('\n사용법:');
console.log('1. 위 .md 파일 열기');
console.log('2. 각 변형 복사 → 네이버 블로그/카페/인스타에 붙여넣기');
console.log('3. 한 플랫폼에 같은 변형 X (다른 변형 사용)');
console.log(`\n다른 횟수로 생성: node _tools/generate-backlinks.mjs 20`);
