const fs = require('fs');
let code = fs.readFileSync('app/routes/userRoutes.js', 'utf8');

code = code.replace(
    'const { result, relances, caracteristic, competence, thrownByAI, color } = req.body;',
    'const { result, relances, caracteristic, competence, thrownByAI, color, localThrowId } = req.body;'
);

code = code.replace(
    'const metadata = `<!--meta:${JSON.stringify({color: metaColor, results: result})}-->`;',
    'const metadata = `<!--meta:${JSON.stringify({color: metaColor, results: result, localThrowId: localThrowId})}-->`;'
);

fs.writeFileSync('app/routes/userRoutes.js', code);
