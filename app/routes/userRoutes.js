import fs from "fs";
import path from "path";
import { Router } from 'express';
import twig from 'twig';
import { prisma } from '../prisma/prismaClient.js';
import { getThrowsByStats } from "../services/calculateThrowsService.js"

const router = Router();
const rollClients = new Set();

router.get('/dashboard', async (req, res) => {
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId

  if (id_User) {
    try {


      const characters = await prisma.character.findMany({
        where: { userId: id_User },
      });

      const conversation = await prisma.conversation.findFirst({
        where: { userId: id_User, Name: null },
      });

      if (conversation == null) {
        return res.redirect('/Conversation/new/');
      }

      if (!characters || characters.length === 0) {
        return res.redirect('/Character/create/new/');
      } else if (id_User !== "undefined" && id_User !== "" && id_User !== null) {
        const favoriteCharacter = await prisma.favoriteCharacter.findFirst({
          where: { userId: id_User },
          include: { character: { include: { Groupe: true } } },
        });

        const favoriteCharacterId = favoriteCharacter?.characterId;

        const sortedCharacters = characters.sort((a, b) => {
          if (a.id_Character === favoriteCharacterId) {
            return -1; // Move the favorite character to the beginning of the list
          } else if (b.id_Character === favoriteCharacterId) {
            return 1; // Move the favorite character to the beginning of the list
          } else {
            return 0;
          }
        });

        const equipmentPath = path.join(process.cwd(), 'data', 'equipment.json');
        let equipmentList = [];
        try {
          equipmentList = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));
        } catch (err) {
          console.error('Error loading equipment.json', err);
        }

        const allGroupes = await prisma.groupe.findMany();

        return res.render('index.html.twig', { characters: sortedCharacters, conversation: conversation, equipmentList: equipmentList, favoriteCharacter: favoriteCharacter, allGroupes: allGroupes }); // Pass sortedCharacters as an object
      } else {
        return res.render('../views/login.html.twig');
      }
    } catch (error) {
      console.error(error);
      return res.render('../views/login.html.twig');
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});

// Render the login page
router.get('/login', (req, res) => {
  res.render('../views/login.html.twig');
});

// Render the register page
router.get('/register', (req, res) => {
  res.render('../views/register.html.twig');
});

// Render the login page
router.get('/', (req, res) => {
  res.render('../views/home.html.twig');
});

// Render the register page
router.get('/home', (req, res) => {
  res.render('../views/home.html.twig');
});

// Render the login page
router.get('/maps', (req, res) => {
  res.render('../views/maps.html.twig');
});


// Render the character form
// Render the character form
router.get('/newcharacter', (req, res) => {
  const equipmentPath = path.join(process.cwd(), 'data', 'equipment.json');
  let equipment = [];
  try {
    equipment = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));
  } catch (err) {
    console.error('Error loading equipment.json', err);
  }
  res.render('../views/newcharacter.html.twig', { equipment });
});


// Hydrate the character
router.post('/create-character', async (req, res) => {
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId

  if (id_User) {
    try {
      let {
        nom,
        age,
        genre,
        instinct,
        signeastro,
        origine,
        avantage,
        desavantage,
        capaciteInstinct1,
        capaciteInstinct2,
        puissance,
        resistance,
        precision,
        reflexes,
        connaissance,
        perception,
        volonte,
        empathie,
        arts,
        cite,
        civilisations,
        relationnel,
        soins,
        animalisme,
        faune,
        montures,
        pistage,
        territoire,
        adresse,
        armurerie,
        artisanat,
        mecanisme,
        runes,
        athletisme,
        discretion,
        flore,
        vigilance,
        voyage,
        bouclier,
        cac,
        lancer,
        melee,
        tir,
        eclats,
        lunes,
        mythes,
        pantheons,
        rituels,
        avatar,
        imageData
      } = req.body;

      // Handle custom image upload
      if (imageData && imageData.startsWith('data:image')) {
        const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const extension = matches[1].split('/')[1] || 'png';
          const buffer = Buffer.from(matches[2], 'base64');
          const fileName = `custom/avatar_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
          // Correct path knowing we run from app.js in /app
          const uploadPath = path.join(process.cwd(), 'app/public/images/characters', fileName);
          fs.writeFileSync(uploadPath, buffer);
          avatar = `/images/characters/${fileName}`;
        }
      }

      puissance = parseInt(puissance);
      resistance = parseInt(resistance);

        let defaultLegere = 4;
        let defaultGrave = 3;
        let defaultMortelle = 2;

        if (age) {
          const ageLower = age.toLowerCase();
          if (ageLower.includes('jeune')) {
            defaultLegere = 4;
            defaultGrave = 3;
            defaultMortelle = 1;
          } else if (ageLower.includes('ancien')) {
            defaultLegere = 3;
            defaultGrave = 2;
            defaultMortelle = 1;
          }
        }
      precision = parseInt(precision);
      reflexes = parseInt(reflexes);
      connaissance = parseInt(connaissance);
      perception = parseInt(perception);
      volonte = parseInt(volonte);
      empathie = parseInt(empathie);
      arts = parseInt(arts);
      cite = parseInt(cite);
      civilisations = parseInt(civilisations);
      relationnel = parseInt(relationnel);
      soins = parseInt(soins);
      animalisme = parseInt(animalisme);
      faune = parseInt(faune);
      montures = parseInt(montures);
      pistage = parseInt(pistage);
      territoire = parseInt(territoire);
      adresse = parseInt(adresse);
      armurerie = parseInt(armurerie);
      artisanat = parseInt(artisanat);
      mecanisme = parseInt(mecanisme);
      runes = parseInt(runes);
      athletisme = parseInt(athletisme);
      discretion = parseInt(discretion);
      flore = parseInt(flore);
      vigilance = parseInt(vigilance);
      voyage = parseInt(voyage);
      bouclier = parseInt(bouclier);
      cac = parseInt(cac);
      lancer = parseInt(lancer);
      melee = parseInt(melee);
      tir = parseInt(tir);
      eclats = parseInt(eclats);
      lunes = parseInt(lunes);
      mythes = parseInt(mythes);
      pantheons = parseInt(pantheons);
      rituels = parseInt(rituels);


      // Create the character in the database
      const newCharacter = await prisma.character.create({
        data: {
          nom,
          age,
          genre,
          avatar,
          instinct,
          signeastro,
          origine,
          avantage,
          desavantage,
          capaciteInstinct1,
          capaciteInstinct2,
          puissance,
          resistance,
          precision,
          reflexes,
          connaissance,
          perception,
          volonte,
          empathie,
          arts,
          cite,
          civilisations,
          relationnel,
          soins,
          animalisme,
          faune,
          montures,
          pistage,
          territoire,
          adresse,
          armurerie,
          artisanat,
          mecanisme,
          runes,
          athletisme,
          discretion,
          flore,
          vigilance,
          voyage,
          bouclier,
          cac,
          lancer,
          melee,
          tir,
          eclats,
          lunes,
          mythes,
          pantheons,
          rituels,
          maxblessurelegere: defaultLegere,
          maxblessuregrave: defaultGrave,
          maxblessuremortelle: defaultMortelle,
          userId: id_User,
          notes: JSON.stringify({
            ops: [
              {
                insert: "15 Sabiirihs d'Argent\n" + 
                        (req.body.equipments ? 
                          (Array.isArray(req.body.equipments) ? req.body.equipments.join('\n') + '\n' : req.body.equipments + '\n') 
                          : "")
              }
            ]
          }),
          inventory: JSON.stringify(
            (req.body.equipments ? 
              (Array.isArray(req.body.equipments) ? req.body.equipments : [req.body.equipments])
              .map(e => ({ name: e, quantity: 1, type: "Équipement de départ", desc: "", stats: "" }))
            : [])
          )
        },
      });

      // Respond with a success message or the created character object
      res.status(201).json(newCharacter);
    } catch (error) {
      console.error('Error creating character:', error);
      res.status(500).json({ error: 'Failed to create character' });
    }
  }
});

router.get('/Characters', async (req, res) => {
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId
  if (id_User) {
    try {

      const characters = await prisma.character.findMany({
        where: { userId: id_User },
      });

      return res.render('characterslist.html.twig', { characters: characters || [] }); // Pass characters as an object

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }
});


router.get('/Character/:id_Character', async (req, res) => {
  const id_User = req.session.userId;
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);

  if (id_User) {
    try {
      const Character = await prisma.character.findUnique({
        where: { id_Character },
        include: {
          User: true,
        },
      });

      if (!Character) {
        return res.status(404).json({ error: 'Character not found' });
      }
      // Check if the connected user is linked to the character or has the role "admin"
      if (Character.User.id === id_User || Character.User.role === 'admin') {
        delete Character.User;
        return res.json(Character);
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});

router.put('/Character', async (req, res) => {
  const id_User = req.session.userId;
  const { id, field, value } = req.body;

  // Make sure the required parameters are present in the request body
  if (!id || !field) {
    return res.status(400).json({ error: 'Missing required parameters in the request body.' });
  }

  let parsedValue;

  if (id_User) {
    if (field === 'avatar' && value && value.startsWith('data:image')) {
      const matches = value.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const extension = matches[1].split('/')[1] || 'png';
        const buffer = Buffer.from(matches[2], 'base64');
        const fileName = `custom/avatar_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
        const uploadPath = path.join(process.cwd(), 'app/public/images/characters', fileName);
        fs.writeFileSync(uploadPath, buffer);
        parsedValue = `/images/characters/${fileName}`;
      } else {
        parsedValue = value;
      }
    } else if (!isNaN(value) && field !== 'avatar') {
      parsedValue = parseInt(value);
    } else {
      parsedValue = value;
    }

    try {

      const character = await prisma.character.findUnique({
        where: { id_Character: parseInt(id) },
        include: {
          User: true,
        },
      });

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }
      // Check if the connected user is linked to the character or has the role "admin"
      if (character.User.id === id_User || character.User.role === 'admin') {
        const updatedCharacter = await prisma.character.update({
          where: { id_Character: parseInt(id) },
          data: { [field]: parsedValue },
        });
        return res.json(updatedCharacter);
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});


router.get('/Character/create/new/', async (req, res) => {
  const userId = req.session.userId;

  if (userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { characters: true } });

      // Check if the connected user is the same as the user creating the character or has the role "admin"
      if (user.id === userId || req.session.role === 'admin') {
        const isUserFirstCharacter = user.characters.length === 0;

        const character = await prisma.character.create({
          data: {
            User: { connect: { id: userId } },
            maxblessurelegere: 4,
            maxblessuregrave: 3,
            maxblessuremortelle: 2
          },
        });

        //If it's the first of this user's characters make it his favorite 
        if (isUserFirstCharacter) {
          await prisma.favoriteCharacter.create({
            data: {
              user: { connect: { id: userId } },
              character: { connect: { id_Character: character.id_Character } },
            },
          });

          await prisma.conversation.create({
            data: {
              User: { connect: { id: userId } },
            },
          });
        }

        return res.redirect('/Characters');
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});

router.get('/Character/show/:id_Character', async (req, res) => {
  const id_User = req.session.userId;
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);

  if (id_User) {
    try {
      const character = await prisma.character.findUnique({
        where: { id_Character },
        include: {
          User: true,
        },
      });

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }

      // Check if the connected user is linked to the character or has the role "admin"
      if (character.User.id === id_User || req.session.role === 'admin') {
        delete character.User;

        const equipmentPath = path.join(process.cwd(), 'data', 'equipment.json');
        let equipmentList = [];
        try {
          equipmentList = JSON.parse(fs.readFileSync(equipmentPath, 'utf8'));
        } catch (err) {
          console.error('Error loading equipment.json', err);
        }

        return res.render('character.html.twig', { character, equipmentList });
      } else {
        return res.render('../views/login.html.twig');
      }

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});

router.get('/Character/Favorite/set/:id_Character', async (req, res) => {
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const id_User = req.session.userId;
  const { userId } = req.session; // Assuming you have the user ID stored in req.session.userId

  if (id_User) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { FavoriteCharacter: true } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the connected user is the same as the user creating the character or has the role "admin"
      if (user.id === id_User || req.session.role === 'admin') {
        const existingFavoriteCharacter = user.FavoriteCharacter.find(fc => fc.characterId === id_Character);

        if (existingFavoriteCharacter) {
          // Character is already the favorite, don't do anything
          return res.json({ message: 'Character is already the favorite' });
        } else {
          await prisma.favoriteCharacter.deleteMany({ where: { userId: user.id } });

          const favoriteCharacter = await prisma.favoriteCharacter.create({
            data: {
              user: { connect: { id: user.id } },
              character: { connect: { id_Character: id_Character } }
            }
          });

          return res.json(favoriteCharacter);
        }
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});

router.get('/Favorite/Character/get/:userId', async (req, res) => {
  var { userId } = req.params;
  var id_User = parseInt(userId);
  try {

    const favoriteCharacter = await prisma.favoriteCharacter.findFirst({
      where: { userId: id_User },
      include: { character: true },
    });

    if (!favoriteCharacter) {
      return res.status(404).json({ error: 'Favorite character not selected' });
    }

    return res.json(favoriteCharacter.character);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/Conversation/new/', async (req, res) => {
  const userId = req.session.userId;

  if (userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { characters: true } });

      // Check if the connected user is the same as the user creating the character or has the role "admin"
      if (user.id === userId || req.session.role === 'admin') {

        const conversation = await prisma.conversation.create({
          data: {
            User: { connect: { id: userId } },
            // Add other properties for the character here
          },
        });

        return res.redirect('/');
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.render('../views/login.html.twig');
  }
});

router.get('/Conversation/get/:conversationId', async (req, res) => {
  var { conversationId } = req.params;
  conversationId = parseInt(conversationId);
  const userId = req.session.userId;
  try {

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
    });

    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/Conversation/delete/:conversationId', async (req, res) => {
  var { conversationId } = req.params;
  conversationId = parseInt(conversationId);
  const userId = req.session.userId;
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found.`);
    }

    // Delete the conversation and its associated messages, rolls, and contexts (cascading delete)
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});





router.put('/throw', async (req, res) => {
  const id_User = req.session.userId;
  const { modifier, competence, caracteristic } = req.body;

  // Make sure the required parameters are present in the request body
  if (!modifier || !competence || !caracteristic) {
    return res.status(400).json({ error: 'Missing required parameters in the request body.' });
  }

  if (id_User) {
    try {
      const user = await prisma.favoriteCharacter.findFirst({
        where: { userId: id_User },
        include: { character: true },
      });

      const character = user.character;

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }
      const result = getThrowsByStats(character, modifier, competence, caracteristic);

      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});


router.put('/share/throw', async (req, res) => {
  const id_User = req.session.userId;
  const { result, relances, caracteristic, competence, thrownByAI } = req.body;

  let rollContent = "";

  const grouped = {};
  if (result && Array.isArray(result)) {
    result.forEach(dice => {
      if (!grouped[dice.value]) grouped[dice.value] = [];
      grouped[dice.value].push(dice.values);
    });
    const rollParts = [];
    for (const [d, vals] of Object.entries(grouped)) {
      rollParts.push(`d${d}: ${vals.join(', ')}`);
    }
    rollContent = rollParts.join(' | ');
  }

  if (caracteristic || competence) {
    const r = parseInt(relances) || 0;
    if (r > 0) {
      rollContent += `\n Vous avez ${r} relance${r > 1 ? 's' : ''} possible${r > 1 ? 's' : ''}.`;
    } else {
      rollContent += "\n Vous n'avez aucune relance possible.";
    }
  } else if (relances) {
    rollContent += "\n Vous avez " + relances + " relances possibles.";
  }

  // Make sure the required parameters are present in the request body
  if (!result) {
    return res.status(400).json({ error: 'Missing required parameters in the request body.' });
  }



  if (id_User) {
    try {
      const user = await prisma.favoriteCharacter.findFirst({
        where: { userId: id_User },
        include: { character: true },
      });

      const character = user.character;



      const roll = await prisma.roll.create({
        data: {
          content: rollContent,
          characterId_Character: character.id_Character,
          isStatRoll: !!(caracteristic || competence),
          caracteristic: caracteristic || null,
          competence: competence || null,
          thrownByAI: thrownByAI || false
        },
        include: {
          Character: { select: { nom: true, avatar: true, genre: true } }
        }
      });

      
      for (const client of rollClients) {
          if ((character.groupeId && client.groupeId === character.groupeId) || client.userId === id_User) {
              client.res.write(`data: ${JSON.stringify([roll])}\n\n`);
          }
      }
      return res.json("No soucis roll créé");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});



router.get('/stream/rolls', async (req, res) => {
  const id_User = req.session.userId;

  if (!id_User) return res.status(401).send("Unauthorized");
  
  try {
      const queryGroupeId = req.query.groupe_id ? parseInt(req.query.groupe_id) : null;
      
      const user = await prisma.favoriteCharacter.findFirst({
        where: { userId: id_User },
        include: { character: true },
      });
      const character = user?.character;
      const groupeId = queryGroupeId || character?.groupeId;


      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders();
      
      // Send an initial comment to keep the connection alive immediately
      res.write(': connected\n\n');

      // Keepalive heartbeat
      const heartbeat = setInterval(() => {
          res.write(': ping\n\n');
      }, 15000);

      const client = { res, groupeId, userId: id_User };
      rollClients.add(client);

      req.on('close', () => {

          clearInterval(heartbeat);
          rollClients.delete(client);
      });
  } catch (err) {
      console.error("SSE Error:", err);
      res.status(500).end();
  }
});

router.put('/fetch/rolls', async (req, res) => {
  const id_User = req.session.userId;
  if (id_User) {
    try {
      const queryGroupeId = req.query.groupe_id ? parseInt(req.query.groupe_id) : null;
      let whereClause = {};

      if (queryGroupeId) {
          whereClause = { Character: { groupeId: queryGroupeId } };
      } else {
          const user = await prisma.favoriteCharacter.findFirst({
            where: { userId: id_User },
            include: { character: true },
          });

          const character = user?.character;
          if (!character) {
              return res.json([]);
          }

          whereClause = character.groupeId ? {
            Character: {
              groupeId: character.groupeId,
            },
          } : {
            characterId_Character: character.id_Character,
          };
      }

      const rolls = await prisma.roll.findMany({
        where: whereClause,
        orderBy: { id: 'asc' },
        include: {
          Character: { select: { nom: true, avatar: true, genre: true } }
        }
      });



      return res.json(rolls);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});





// --- GROUPE ROUTES ---

router.post('/Groupe', async (req, res) => {
  const { nom, niveau, reserveDes, reputation, capacitesGroupe, instinctGroupe, capacitesInstinctGroupe } = req.body;
  try {
    const groupe = await prisma.groupe.create({
      data: {
        nom,
        niveau: parseInt(niveau) || 1,
        reserveDes: parseInt(reserveDes) || 0,
        reputation: reputation || "1",
        capacitesGroupe: capacitesGroupe || "",
        instinctGroupe: instinctGroupe || "",
        capacitesInstinctGroupe: capacitesInstinctGroupe || ""
      }
    });
    res.json(groupe);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.get('/Groupe/:id', async (req, res) => {
  try {
    const groupe = await prisma.groupe.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    res.json(groupe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/Groupe/:id', async (req, res) => {
  try {
    const groupe = await prisma.groupe.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    res.json(groupe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/Groupe/:id', async (req, res) => {
  try {
    const updated = await prisma.groupe.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/Character/:charId/joinGroupe/:groupeId', async (req, res) => {
  try {
    const char = await prisma.character.update({
      where: { id_Character: parseInt(req.params.charId) },
      data: { groupeId: parseInt(req.params.groupeId) }
    });
    res.json(char);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});

router.post('/Character/:charId/leaveGroupe', async (req, res) => {
  try {
    const char = await prisma.character.update({
      where: { id_Character: parseInt(req.params.charId) },
      data: { groupeId: null }
    });
    res.json(char);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});


router.get("/groupes", async (req, res) => {
  const id_User = req.session.userId;
  if (!id_User) {
    return res.render("../views/login.html.twig");
  }

  try {
    const groupes = await prisma.groupe.findMany();
    
    const favoriteCharacter = await prisma.favoriteCharacter.findFirst({
      where: { userId: id_User },
      include: { character: true },
    });

    res.render("groupes.html.twig", {
      groupes: groupes,
      activeCharacter: favoriteCharacter ? favoriteCharacter.character : null
    });
  } catch (err) {


    res.status(500).send("Erreur lors de la récupération des groupes: " + err.message);
  }
});

router.post('/Character/Favorite/inventory', async (req, res) => {
  try {
    const { charId, inventory } = req.body;
    const sId = parseInt(charId);
    if (!sId) return res.status(400).send("Invalid character ID");
    await prisma.character.update({
      where: { id_Character: sId },
      data: { inventory: inventory }
    });
    res.status(200).send("Updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/Character/Favorite/inventory', async (req, res) => {
  try {
    const { charId, inventory } = req.body;
    const sId = parseInt(charId);
    if (!sId) return res.status(400).send("Invalid character ID");
    await prisma.character.update({
      where: { id_Character: sId },
      data: { inventory: inventory }
    });
    res.status(200).send("Updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;
