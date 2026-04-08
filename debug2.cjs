const fs = require('fs');
const content = fs.readFileSync('app/views/index.html.twig', 'utf-8');
const links = [...content.matchAll(/id="(.*?)[-]?tab"\s+data-bs-toggle="tab"/g)].map(m=>m[1]);
console.log("Tab links:", links);
const panes = [...content.matchAll(/id="(.*?)[-]?tab-pane"/g)].map(m=>m[1]);
console.log("Tab panes:", panes);
