const fs = require('fs');
const lines = fs.readFileSync('app/views/index.html.twig', 'utf8').split('\n');

function runTrace(startLine, endLine) {
    let d = 0;
    for(let i=startLine-1; i<=endLine-1; i++) {
        let opens = (lines[i].match(/<div/g) || []).length;
        let closes = (lines[i].match(/<\/div/g) || []).length;
        d += opens;
        d -= closes;
    }
    console.log(`Trace ${startLine}-${endLine} final depth: ${d}`);
}

runTrace(26, 59); // P block
runTrace(60, 92); // L block
runTrace(94, 156); // T block (Wait, is 156 closing T?)
