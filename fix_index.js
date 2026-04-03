const fs = require('fs');

const content = fs.readFileSync('app/views/index.html.twig', 'utf8');
const lines = content.split('\n');

const pBlock = lines.slice(25, 59); // 26-59
const lBlock = lines.slice(59, 92); // 60-92
const tBlock = lines.slice(93, 156); // 94-156 Wait, 155 is index 154? 

// index 25 is line 26
// index 58 is line 59
// pBlock = lines.slice(25, 59) -> extracts indices 25 to 58 (length 34).

// index 59 is line 60
// index 91 is line 92
// lBlock = lines.slice(59, 92) -> extracts indices 59 to 91 (length 33).

// index 93 is line 94. 
// index 154 is line 155.
// tBlock = lines.slice(93, 155) -> extracts indices 93 to 154.

// Wait, let's just make it precise!
