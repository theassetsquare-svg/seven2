const fs=require('fs'),path=require('path');
const KW=process.argv[2];
function walk(d,a=[]){fs.readdirSync(d).forEach(f=>{const p=path.join(d,f);if(fs.statSync(p).isDirectory()&&!p.includes('node_modules')&&!p.includes('.git'))walk(p,a);else if(f.endsWith('.html'))a.push(p);});return a;}
walk('.').forEach(file=>{
  const html=fs.readFileSync(file,'utf8');
  const text=html.replace(/<nav[\s\S]*?<\/nav>/gi,'').replace(/<footer[\s\S]*?<\/footer>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  const wc=text.split(' ').filter(w=>w.length>1).length;
  const c=(text.match(new RegExp(KW,'g'))||[]).length;
  const d=text.length?(c*KW.length/text.length*100).toFixed(2):0;
  let s='OK';if(d<1.5)s='LOW';if(d>2.5)s='STUFF';
  console.log(`[${s}] ${file}: ${c}회 / ${d}% / 본문 ${wc}자`);
});
