const fs=require('fs'),path=require('path');
const KW=process.argv[2];
function walk(d,a=[]){fs.readdirSync(d).forEach(f=>{const p=path.join(d,f);if(fs.statSync(p).isDirectory()&&!p.includes('node_modules')&&!p.includes('.git'))walk(p,a);else if(f.endsWith('.html'))a.push(p);});return a;}
const m={};
walk('.').forEach(file=>{
  const html=fs.readFileSync(file,'utf8');
  const t=(html.match(/<title>([^<]+)<\/title>/)||[])[1]||'';
  if(t.includes(KW)){const sub=t.replace(KW,'').trim();m[sub]=m[sub]||[];m[sub].push(file);}
});
let c=0;
Object.entries(m).forEach(([sub,files])=>{if(files.length>1){console.log(`CANNIBAL "${KW} ${sub}": ${files.length}개`);files.forEach(f=>console.log('  '+f));c++;}});
console.log(c===0?'카니발 0건':`총 ${c}건 차별화 필요`);
