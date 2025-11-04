import fs from 'fs';
import path from 'path';
const root = path.resolve(process.cwd(), 'data/levels');
const files = ['level1.json','level2.json','level3.json','level4.json','level5.json','level6.json'];
for(const f of files){
  const p = path.join(root, f);
  if(!fs.existsSync(p)) throw new Error(`Missing ${f}`);
}
console.log('All level files present. Populate scenarios next.');

