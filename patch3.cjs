const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app/views/rituels.html.twig');
let content = fs.readFileSync(file, 'utf8');
content = content.replace('var modal = new bootstrap.Modal(document.getElementById("ritualModal"));', 'var modalEl = document.getElementById("ritualModal");\n        var modal = bootstrap.Modal.getOrCreateInstance(modalEl);');
fs.writeFileSync(file, content);
console.log("Patched");
