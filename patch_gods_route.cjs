const fs = require('fs');

const routeFile = 'app/routes/eclatsRoutes.js';
let routes = fs.readFileSync(routeFile, 'utf8');

const oldCreateLogic = `    const { nom, description, domaines, interditsMajeurs, interditsMineurs } = req.body;
    if (!nom) return res.status(400).json({ success: false, message: 'Le nom est obligatoire.' });
    try {
        const newGod = await prisma.god.create({
            data: {
                nom,
                description: description || '',
                domaines: (domaines) ? JSON.stringify(domaines.split(',').map(s => s.trim())) : '[]',
                interditsMajeurs: (interditsMajeurs) ? JSON.stringify(interditsMajeurs.split(',').map(s => s.trim())) : '[]',
                interditsMineurs: (interditsMineurs) ? JSON.stringify(interditsMineurs.split(',').map(s => s.trim())) : '[]',
                userId: id_User
            }
        });`;

const newCreateLogic = `    const { nom, description, domaines, essencesPrimaires, essencesSecondaires, desirs, interditsMineurs, interditsMajeurs, objectifsMineurs, objectifsMajeurs } = req.body;
    if (!nom) return res.status(400).json({ success: false, message: 'Le nom est obligatoire.' });
    try {
        const newGod = await prisma.god.create({
            data: {
                nom,
                description: description || '',
                domaines: (domaines) ? JSON.stringify(domaines.split(',').map(s => s.trim())) : '[]',
                essencesPrimaires: (essencesPrimaires) ? JSON.stringify(essencesPrimaires.split(',').map(s => s.trim())) : '[]',
                essencesSecondaires: (essencesSecondaires) ? JSON.stringify(essencesSecondaires.split(',').map(s => s.trim())) : '[]',
                desirs: (desirs) ? JSON.stringify(desirs.split(',').map(s => s.trim())) : '[]',
                interditsMineurs: (interditsMineurs) ? JSON.stringify(interditsMineurs.split(',').map(s => s.trim())) : '[]',
                interditsMajeurs: (interditsMajeurs) ? JSON.stringify(interditsMajeurs.split(',').map(s => s.trim())) : '[]',
                objectifsMineurs: (objectifsMineurs) ? JSON.stringify(objectifsMineurs.split(',').map(s => s.trim())) : '[]',
                objectifsMajeurs: (objectifsMajeurs) ? JSON.stringify(objectifsMajeurs.split(',').map(s => s.trim())) : '[]',
                userId: id_User
            }
        });`;

routes = routes.replace(oldCreateLogic, newCreateLogic);
fs.writeFileSync(routeFile, routes);
console.log('Backend God creation patched!');
