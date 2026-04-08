const fs = require('fs');
const content = fs.readFileSync('app/views/index.html.twig', 'utf-8');
console.log("rituels-tab link present:", content.includes('id="rituels-tab"'));
console.log("rituels-tab-pane present:", content.includes('id="rituels-tab-pane"'));
console.log("Number of tab-pane div:", (content.match(/class="tab-pane /g) || []).length);
console.log("Number of nav-link a tags:", (content.match(/class="nav-link"/g) || []).length);
