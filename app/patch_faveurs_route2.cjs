const fs = require('fs');

let routesCode = fs.readFileSync('routes/userRoutes.js', 'utf8');

routesCode = routesCode.replace('faveurs = await prisma.faveur.findMany();', "faveurs = await prisma.faveur.findMany({ orderBy: [{ domaine: 'asc' }, { nom: 'asc' }] });");

fs.writeFileSync('routes/userRoutes.js', routesCode);
console.log("Updated route for sorting");
