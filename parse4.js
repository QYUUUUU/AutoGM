const fs = require('fs');
const content = fs.readFileSync('app/views/index.html.twig', 'utf8');
const lines = content.split('\n');
let depth = 0;
for(let i = 0; i < lines.length; i++) {
        let l = lines[i];
        
        let opens = (l.match(/<div/g) || []).length;
        let closes = (l.match(/<\/div/g) || []).length;
        
        depth += (opens - closes);
}
console.log('Final depth:', depth);
