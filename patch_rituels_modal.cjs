const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/views/rituels.html.twig');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/\$\('#ritualModal'\)\.modal\('show'\);/g, 'var modal = new bootstrap.Modal(document.getElementById("ritualModal"));\n        modal.show();');
content = content.replace(/\$\('#ritualModal'\)\.modal\('hide'\);/g, 'var modalEl = document.getElementById("ritualModal");\n                var modal = bootstrap.Modal.getInstance(modalEl);\n                if (modal) modal.hide();');
content = content.replace(/data-dismiss="modal"/g, 'data-bs-dismiss="modal"');

if (!content.includes('bootstrap.min.js')) {
    content = content.replace('{% endblock %}', '<script src="/js/bootstrap.min.js"></script>\n{% endblock %}');
}

fs.writeFileSync(filePath, content);
console.log("Patched!!");
