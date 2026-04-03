const fs = require('fs');
const path = 'app/controllers/adminController.js';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('import fs from')) {
    code = `import fs from 'fs';\nimport path from 'path';\n` + code;
}

const replacement = `      let characters = [];
      let equipment = [];
      try {
          if (activeGroupeId) {
             characters = await prisma.character.findMany({ where: { groupeId: activeGroupeId } });
          }
          const eqPath = path.join(process.cwd(), "data", "equipment.json");
          if (fs.existsSync(eqPath)) {
             equipment = JSON.parse(fs.readFileSync(eqPath, "utf8"));
          }
      } catch(e) { console.error("Error loading extra data", e); }
      
      res.render('../views/admin.html.twig', { worldState, groupes, activeGroupeId, characters, equipment });
    } catch (error) {`;

code = code.replace(/      res\.render\('\.\.\/views\/admin\.html\.twig', \{ worldState, groupes, activeGroupeId \}\);\n    \} catch \(error\) \{/, replacement);

fs.writeFileSync(path, code);
