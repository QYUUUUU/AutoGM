const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'app/views/rituels.html.twig');
let content = fs.readFileSync(file, 'utf8');
if (!content.includes('bootstrap.min.js')) {
    content = content.replace(/\{%\s*endblock\s*%\}/g, '<script src="/js/bootstrap.min.js"></script>\n{% endblock %}');
    fs.writeFileSync(file, content);
    console.log("Patched");
}
