const fs = require('fs');

const uiFile = 'app/views/eclats.html.twig';
let ui = fs.readFileSync(uiFile, 'utf8');

const vanillaModalFunctions = `
    // Vanilla JS Modal Management
    function showModal(id) {
        const modal = document.getElementById(id);
        if(!modal) return;
        modal.style.display = 'block';
        // Force reflow
        void modal.offsetWidth;
        modal.classList.add('show');
        
        // Add backdrop if it doesn't exist
        if(!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
        document.body.classList.add('modal-open');
    }

    function hideModal(id) {
        const modal = document.getElementById(id);
        if(!modal) return;
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 150); // match bootstrap fade out
        
        const backdrop = document.querySelector('.modal-backdrop');
        if(backdrop) {
            backdrop.classList.remove('show');
            setTimeout(() => backdrop.remove(), 150);
        }
        document.body.classList.remove('modal-open');
    }
`;

// Insert the vanilla functions right after opening <script> tag
ui = ui.replace(/<script>\s*document\.addEventListener/, '<script>\\n' + vanillaModalFunctions + '\\n    document.addEventListener');

// Replace jQuery method calls with Vanilla JS
ui = ui.replace(/\$\('#pactModal'\)\.modal\('show'\);/g, "showModal('pactModal');");
ui = ui.replace(/\$\('#pactModal'\)\.modal\('hide'\);/g, "hideModal('pactModal');");
ui = ui.replace(/\$\('#upgradePactModal'\)\.modal\('hide'\);/g, "hideModal('upgradePactModal');"); // Just in case it's still somewhere

// Also hook up the data-dismiss="modal" buttons
const hideModalListener = `
        // Vanilla JS for data-dismiss
        document.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if(modal) hideModal(modal.id);
            });
        });
`;
// Insert right after the accordion logic in DOMContentLoaded
ui = ui.replace(/\/\/ Toggle logic[\s\S]*?            \}\);\n        \}\);\n/, match => match + hideModalListener);

fs.writeFileSync(uiFile, ui);
console.log('Vanilla Modals Patched!');
