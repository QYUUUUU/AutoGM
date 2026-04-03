const fs = require('fs');
const content = fs.readFileSync('app/views/index.html.twig', 'utf8');
const lines = content.split('\n');

function getBlock(startKeyword, endKeyword, startSearchLine) {
    let start = -1;
    for(let i = startSearchLine; i < lines.length; i++) {
        if(lines[i].includes(startKeyword)) {
            start = i;
            // backtrack to the container div
            while(start >= 0 && !lines[start].trim().startsWith('<div')) {
                start--;
            }
            break;
        }
    }
    
    if (start === -1) return null;
    
    let depth = 0;
    let end = -1;
    for(let i = start; i < lines.length; i++) {
        let l = lines[i];
        
        let opens = (l.match(/<div/g) || []).length;
        let closes = (l.match(/<\/div/g) || []).length;
        
        depth += (opens - closes);
        
        if(depth === 0 && i >= start && opens > 0 || depth === 0 && closes > 0) {
            end = i;
            break;
        }
    }
    
    return {start, end, depth};
}

const p = getBlock('Personnage & Équipement', '', 0);
console.log('P:', p);

const l = getBlock('Lancer Libre', '', p ? p.end : 0);
console.log('L:', l);

const t = getBlock('Test de Compétence', '', l ? l.end : 0);
console.log('T:', t);

