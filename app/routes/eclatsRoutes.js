import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware to ensure user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/login');
};

/**
 * @route GET /eclats
 * @description Main Eclats ecosystem page (Pantheon, Pact, Favors)
 */
router.get('/', isAuthenticated, async (req, res) => {
    const id_User = req.session.userId;
    try {
        // Fetch custom gods and official ones
        const gods = await prisma.god.findMany({
            where: {
                OR: [
                    { userId: id_User },
                    { userId: null }
                ]
            }
        });

        // Fetch user's characters to bind
        const characters = await prisma.character.findMany({
            where: { userId: id_User },
            include: { God: true }
        });

        res.render('../views/eclats.html.twig', { gods, characters });
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur lors du chargement des éclats.");
    }
});

/**
 * @route POST /eclats/gods/create
 * @description Create a custom deity for the user
 */
router.post('/gods/create', isAuthenticated, async (req, res) => {
    const id_User = req.session.userId;
    const { nom, description, domaines, interditsMajeurs, interditsMineurs } = req.body;

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
        });
        res.json({ success: true, god: newGod });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du Dieu.' });
    }
});

/**
 * @route POST /eclats/pacte/bind
 * @description Bind a character to a God (Stage: Rencontre)
 */
router.post('/pacte/bind', isAuthenticated, async (req, res) => {
    const { characterId, godId, stat, skill1 } = req.body;
    if (!characterId || !godId) return res.status(400).json({ success: false, message: 'Personnage et Dieu requis.' });
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false, message: 'Personnage introuvable.' });

        const validStats = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
        const validSkills = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];

        let updateData = { godId: parseInt(godId), stadeEclat: 'Rencontre', faveurs: '[]' };
        
        if (stat && validStats.includes(stat)) updateData[stat] = { increment: 1 };
        if (skill1 && validSkills.includes(skill1)) updateData[skill1] = { increment: 1 };

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: updateData
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur Serveur.' });
    }
});

/**
 * @route POST /eclats/pacte/upgrade
 * @description Evolve the character's Eclat stage
 */
router.post('/pacte/upgrade', isAuthenticated, async (req, res) => {
    const { characterId, statToUpgrade, skillToUpgrade1, skillToUpgrade2 } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character || !character.godId) return res.status(403).json({ success: false, message: 'Personnage introuvable ou non lié.' });

        let newStade = 'Rencontre';
        if (character.stadeEclat === 'Rencontre') newStade = 'Entente';
        else if (character.stadeEclat === 'Entente') newStade = 'Accord';
        else return res.status(400).json({ success: false, message: 'Niveau maximum atteint.' });

        const validStats = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
        const validSkills = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];
        
        let updateData = { stadeEclat: newStade };
        
        if (statToUpgrade && validStats.includes(statToUpgrade)) updateData[statToUpgrade] = { increment: 1 };
        if (skillToUpgrade1 && validSkills.includes(skillToUpgrade1)) updateData[skillToUpgrade1] = { increment: 1 };
        if (skillToUpgrade2 && validSkills.includes(skillToUpgrade2) && newStade === 'Accord') updateData[skillToUpgrade2] = { increment: 1 };

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: updateData
        });
        
        res.json({ success: true, newStade });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur Serveur.' });
    }
});

/**
 * @route POST /eclats/pacte/break
 * @description Remove a character's link to their God
 */
router.post('/pacte/break', isAuthenticated, async (req, res) => {
    const { characterId } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false });

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: { godId: null, stadeEclat: '', faveurs: '[]' }
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur Serveur.' });
    }
});

/**
 * @route POST /eclats/faveurs/add
 * @description Add a generic Favor to the character
 */
router.post('/faveurs/add', isAuthenticated, async (req, res) => {
    const { characterId, faveurName } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false });

        let faveurs = [];
        try { faveurs = JSON.parse(character.faveurs || '[]'); } catch(e) {}
        if(!faveurs.includes(faveurName)) faveurs.push(faveurName);

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: { faveurs: JSON.stringify(faveurs) }
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/**
 * @route POST /eclats/faveurs/remove
 * @description Remove a Favor from the character
 */
router.post('/faveurs/remove', isAuthenticated, async (req, res) => {
    const { characterId, faveurName } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false });

        let faveurs = [];
        try { faveurs = JSON.parse(character.faveurs || '[]'); } catch(e) {}
        faveurs = faveurs.filter(f => f !== faveurName);

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: { faveurs: JSON.stringify(faveurs) }
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/**
 * @route POST /eclats/equilibre/update
 * @description Update Humanité and Divinité for a character
 */
router.post('/equilibre/update', isAuthenticated, async (req, res) => {
    const { characterId, humanite, divinite } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false });

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: { 
                humanite: parseInt(humanite) || 0,
                divinite: parseInt(divinite) || 0
            }
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/**
 * @route POST /eclats/artifact/update
 * @description Configurer la forme, l'apparence, l'embrasement et les capacités de l'Éclat
 */
router.post('/artifact/update', isAuthenticated, async (req, res) => {
    const { characterId, formeEclat, apparenceEclat, sphereEclat, embrasementEclat, capacitesEclat } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false });

        let currentCapacites = [];
        try { currentCapacites = JSON.parse(character.capacitesEclat || '[]'); } catch(e) {}
        
        let newCapacites = currentCapacites;
        if (capacitesEclat !== undefined) {
            newCapacites = JSON.parse(capacitesEclat);
        }

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: { 
                formeEclat: formeEclat !== undefined ? formeEclat : character.formeEclat,
                apparenceEclat: apparenceEclat !== undefined ? apparenceEclat : character.apparenceEclat,
                sphereEclat: sphereEclat !== undefined ? sphereEclat : character.sphereEclat,
                embrasementEclat: embrasementEclat !== undefined ? embrasementEclat : character.embrasementEclat,
                capacitesEclat: JSON.stringify(newCapacites)
            }
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

export default router;
