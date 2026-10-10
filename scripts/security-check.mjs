import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/gh[pousr]_[A-Za-z0-9]{30,}/,/AKIA[A-Z0-9]{16}/,/sb_secret_[A-Za-z0-9_-]{20,}/,/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/];
const files=execFileSync('git',['ls-files','-z']).toString().split('\0').filter(Boolean);
let failures=0;
for (const file of files) {
 if (/\.(?:jpg|png|webp|woff2?|ttf|eot|ico|pdf)$/i.test(file)) continue;
 const body=await fs.readFile(file,'utf8');
 if(patterns.some(p=>p.test(body))){console.error(`Credential pattern requires review: ${file} (value redacted)`);failures++;}
}
const inventory=JSON.parse(await fs.readFile('production-assets.json','utf8'));
for(const file of inventory){
 if(/(?:^|\/)(?:\.git|\.env|src|api|originals|private|_external)(?:\/|$)|\.(?:map|zip|sql|pem|key|log|ts|tsx|json)$/i.test(file))throw new Error(`Unexpected public file: ${file}`);
 if(!path.resolve('dist',file).startsWith(path.resolve('dist')+path.sep))throw new Error('Invalid artifact path');
}
if(failures)process.exit(1);
console.log(`Credential-pattern check: ${files.length} tracked files; production allowlist: ${inventory.length} files. Passed.`);
