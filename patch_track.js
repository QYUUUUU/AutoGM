const fs = require('fs');
let code = fs.readFileSync('app/public/js/dashboardTrackRolls.js', 'utf8');

// Update showRollOnDashboard to extract metadata
code = code.replace(
    'let formattedContent = roll.content.replace(/\\b(\\d+)\\b/g, \'<strong c',
    `
            let meta = null;
            let rawContent = roll.content || "";
            const metaMatch = rawContent.match(/<!--meta:(.*?)-->/);
            if (metaMatch) {
                try {
                    meta = JSON.parse(metaMatch[1]);
                    rawContent = rawContent.replace(metaMatch[0], '');
                } catch(e) {}
            }

            if (meta && meta.color) {
                nameHeader.style.color = meta.color;
            }

            // Animate remote roll if applicable
            if (meta && meta.localThrowId && meta.results) {
                window.myRollIds = window.myRollIds || [];
                if (!window.myRollIds.includes(meta.localThrowId) && window.animateRemoteRoll) {
                    // It's a remote throw! We animate it!
                    window.animateRemoteRoll(meta.results, meta.color || "#2d2d2d");
                    // Important: Since we already saw it, we can push it to myRollIds just in case although showedRolls handles it
                    window.myRollIds.push(meta.localThrowId);
                }
            }

            let formattedContent = rawContent.replace(/\\b(\\d+)\\b/g, '<strong c`
);

fs.writeFileSync('app/public/js/dashboardTrackRolls.js', code);
