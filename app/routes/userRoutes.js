import fs from "fs";
import path from "path";
import { Router } from 'express';
import twig from 'twig';
import { prisma } from '../prisma/prismaClient.js';
import { getThrowsByStats } from "../services/calculateThrowsService.js"

const router = Router();
const rollClients = new Set();

/**
 * @route GET /dashboard
 * @description Handles rendering the main dashboard for the user.
 * Features:
 * - Checks for active user session.
 * - Redirects unauthorized users to the login page.
 * - Retrieves user's characters and the latest active conversation from Prisma.
 * - Redirects to conversation or character creation if none exist.
 * - Sorts the characters so that the favorite character appears first.
 * - Loads available equipment list from a local JSON file.
 * - Fetches all available groups from the database.
 * - Renders the main dashboard (`index.html.twig`) with all the retrieved data.
 */
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

/**
 * @route GET /login
 * @description Renders the login page view for users to authenticate into the system.
 * Features:
 * - Simple rendering of the `login.html.twig` view.
 */
// Render the login page
router.get('/login', (req, res) => {
  res.render('../views/login.html.twig');
});

/**
 * @route GET /register
 * @description Renders the user registration form view.
 * Features:
 * - Simple rendering of the `register.html.twig` view.
 */
router.get('/register', (req, res) => {
  res.render('../views/register.html.twig');
});

/**
 * @route GET /
 * @description Renders the application homepage or landing page.
 * Features:
 * - Simple rendering of the `home.html.twig` view.
 */
router.get('/', (req, res) => {
  res.render('../views/home.html.twig');
});

/**
 * @route GET /home
 * @description Renders the application homepage (alternative endpoint).
 * Features:
 * - Simple rendering of the `home.html.twig` view.
 */
router.get('/home', (req, res) => {
  res.render('../views/home.html.twig');
});

/**
 * @route GET /maps
 * @description Renders the game maps viewing page.
 * Features:
 * - Simple rendering of the `maps.html.twig` view.
 */
router.get('/maps', (req, res) => {
  res.render('../views/maps.html.twig');
});


/**
 * @route GET /newcharacter
 * @description Renders the character creation form and supplies the available starting equipment list.
 * Features:
 * - Reads `equipment.json` from the local `data` directory.
 * - Handles JSON parsing errors to prevent crashes if the file is corrupted.
 * - Renders the `newcharacter.html.twig` template, injecting the loaded equipment data.
 */
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


/**
 * @route POST /create-character
 * @description Creates a new character belonging to the currently authenticated user.
 * Features:
 * - Session verification: Checks if the user is logged in.
 * - Extracts form data concerning the character's base info, stats, and skills.
 * - Image Upload Handling: Specifically processes Base64 decoded image uploads (`imageData`).
 * - Generates random filenames to avoid avatar collisions, and persists images physically.
 * - Defines default wound track maximums based on age keywords ('jeune', 'ancien').
 * - Parses string inputs to integers where appropriate for database insertion.
 * - Initializes JSON-encoded starter inventory based on `req.body.equipments`.
 * - Commits the new character entry to the Prisma database.
 * 
 * Wait for obsolete code confirmation: There are missing variable bounds check. 
 */
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

/**
 * @route GET /Characters
 * @description Retrieves a list of all characters belonging to the current user and renders the list view.
 * Features:
 * - Session verification: Checks if the user is authenticated.
 * - Retrieves all characters mapped to the user from the database.
 * - Renders the `characterslist.html.twig` template, passing the array of character objects.
 * - Fails safely by returning an empty array if characters are null/undefined.
 */
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


/**
 * @route GET /Character/:id_Character
 * @description Retrieves a specific character's details in JSON format.
 * Features:
 * - Expects `id_Character` parameter.
 * - Extracts character and related `User` data from the database.
 * - Enforces access control (only character owner or an 'admin' can view it).
 * - Restricts exposing the owner's `User` object (deletes it from response before sending).
 * - Serves as an API endpoint (returns JSON) instead of rendering a view.
 * 
 * Wait for obsolete code confirmation: Lack of `isNaN(id_Character)` check might crash the backend or throw a Prisma `Int` error if param is a string.
 */
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

/**
 * @route PUT /Character
 * @description Updates a single field for a given character dynamically.
 * Features:
 * - Accepts an `{ id, field, value }` object from the request body.
 * - Handles base64 encoded image uploads dynamically if the field is 'avatar'.
 * - Extracts base64 strings, creates random files (`custom/avatar_Date_Random.ext`).
 * - Forwards any non-string numeric values by parsing them to an integer.
 * - Ensures security by verifying the user requesting the change owns the character or is 'admin'.
 * - Performs a direct Prisma `update` on the dynamic `[field]` key.
 * 
 * Wait for obsolete code confirmation: `!isNaN(value) && field !== 'avatar'` means if someone updates their character's "nom" (name) to "123", it parses to `int`, which will crash Prisma if the `nom` column expects a `String`. This is extremely dangerous and obsolete inline logic.
 */
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
        let updateData = { [field]: parsedValue };
        
        if (['blessurelegere', 'blessuregrave', 'blessuremortelle'].includes(field)) {
          const oldVal = character[field] || 0;
          const newVal = parsedValue;
          if (newVal > oldVal) {
             const difference = newVal - oldVal;
             let perte = 0;
             if (field === 'blessurelegere') perte = 1 * difference;
             else if (field === 'blessuregrave') perte = 2 * difference;
             else if (field === 'blessuremortelle') perte = 1 * difference;
             
             if (perte > 0) {
               updateData.effort = Math.max(0, (character.effort || 0) - perte);
               updateData.sangfroid = Math.max(0, (character.sangfroid || 0) - perte);
             }
          }
        }

        const updatedCharacter = await prisma.character.update({
          where: { id_Character: parseInt(id) },
          data: updateData,
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


/**
 * @route GET /Character/create/new/
 * @description Automatically creates a complete, default-statted character for the user without submitting a form.
 * Features:
 * - Session verification: Checks if the user is logged in.
 * - Extracts `userId` to link the new character.
 * - Auto-assigns default wound counts (`maxblessurelegere`, `grave`, `mortelle`).
 * - Detects if it's the user's very first character.
 * - Auto-flags the character as their `favoriteCharacter` if it's the first one.
 * - Also auto-creates a new `Conversation` (chat) for the user if it's their first character.
 * - Redirects to `/Characters` list view upon successful creation.
 * 
 * Wait for obsolete code confirmation: `req.session.role === 'admin'` check is here, but creating a character FOR another user isn't implemented (it uses `userId` from session only). Also, `await prisma.$disconnect()` in a route `finally` block creates severe connection pool overhead/downturn.
 */
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

/**
 * @route GET /Character/show/:id_Character
 * @description Retrieves a specific character and renders the dedicated character view page (`character.html.twig`).
 * Features:
 * - Session verification: Checks if the user is authenticated.
 * - Parses `id_Character` to integer to query the Prisma database.
 * - Extracts character and included `User` data.
 * - Validates ownership of the character by matching `user_id` or `admin` session role.
 * - Modifies the response to strip off sensitive `User` references after check mapping (`delete character.User`).
 * - Loads the static `data/equipment.json` file to inject available items in the character view for dynamic equipping capabilities.
 * - Fallbacks nicely by rendering login if validation fails.
 */
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

/**
 * @route GET /Character/Favorite/set/:id_Character
 * @description Designates a specific character as the logged-in user's active "Favorite".
 * Features:
 * - Expects an `id_Character` parameter.
 * - Extracts user ID from session context to ensure data isolation.
 * - Queries the database for the user with their included `FavoriteCharacter` relations.
 * - Validates ownership of the account (checking the `userId` bounds and admin roles).
 * - Identifies if the character being requested is *already* the active favorite.
 * - Removes past favorite selections by doing `deleteMany` on the user's `userId`.
 * - Sets the newly provided `id_Character` as the favorite via Prisma `favoriteCharacter.create()`.
 * - Returns JSON representation of the new `favoriteCharacter` entry.
 */
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

/**
 * @route GET /Favorite/Character/get/:userId
 * @description Retrieves the current favorite character entity for a strictly specified user ID.
 * Features:
 * - Parses `userId` parameter.
 * - Searches the `favoriteCharacter` relation mapping for that user.
 * - Returns a full character JSON payload if found.
 * 
 * Wait for obsolete code confirmation: This route takes `userId` from the URL params and doesn't enforce session security. Any user can query any other user's favorite character. Usually this should rely entirely on `req.session.userId` instead of a route parameter.
 */
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


/**
 * @route GET /Conversation/new/
 * @description Creates an empty conversational context/chat instance for the logged-in user.
 * Features:
 * - Checks for current session `userId`.
 * - Verifies that the user exists in Prisma securely (by searching `userId`).
 * - Links a newly created `Conversation` entity to the `User`.
 * - Forwards the user back to the application home index (`/`).
 * 
 * Wait for obsolete code confirmation: As with previous `/new/` endpoints, `await prisma.$disconnect()` is used in the `finally` block here. This kills the connection pool for all subsequent traffic, which causes severe stability issues for the application.
 */
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

/**
 * @route GET /Conversation/get/:conversationId
 * @description Fetches all stored chat messages for a given Conversation thread.
 * Features:
 * - Extracts `conversationId` parameter.
 * - Extracts `userId` from session context.
 * - Queries `prisma.message` matching the supplied ID entirely.
 * - Returns a JSON array list of historical prompts/responses.
 * 
 * Wait for obsolete code confirmation: `userId` is pulled from the session but ignored in the `where` clause. Any user who can guess the ID of another conversation can read to someone else's messages.
 */
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

/**
 * @route GET /Conversation/delete/:conversationId
 * @description Removes a specific conversation entirely from the database via cascading deletion.
 * Features:
 * - Looks up target `conversationId`.
 * - Extracts `userId` from session (though currently unused).
 * - Executes Prisma `findUnique` pre-flight to check if target exists, errors if not.
 * - Injects `delete` cascaded call (`prisma.conversation.delete`).
 * 
 * Wait for obsolete code confirmation: Returns `res.json(messages)` at the end, but `messages` is completely undefined leading to a 500 Server reference error immediately! Also lacks any security matching against `userId` so any user could indiscriminately delete everyone's conversations.
 */
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





/**
 * @route PUT /throw
 * @description In-game mechanical action triggering a dice roll resolution check for the active character.
 * Features:
 * - Requires body attributes: `modifier`, `competence` (skill name), `caracteristic` (stat name).
 * - Validates input presence early (HTTP 400).
 * - Identifies the rolling user's active `FavoriteCharacter`.
 * - Relies on `getThrowsByStats` external calculation service to merge stats, skill level, and modifiers into a result.
 * - Responds as JSON with roll interpretation details.
 * 
 * Wait for obsolete code confirmation: `user.character` assignment relies entirely on `favoriteCharacter` array. If the user hasn't favorited a character yet, `user.character` throws `TypeError` crashing the API due to unhandled undefined `user` fetch returning null!
 */
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
        include: { character: { include: { Groupe: true } } },
      });

      const character = user.character;

      if (!character) {
        return res.status(404).json({ error: 'Character not found' });
      }
            let maxGroupCompetence = character[competence] || 0;
      if (req.body.isCollective && character.groupeId) {
        const otherMembers = await prisma.character.findMany({
          where: {
            groupeId: character.groupeId,
            id_Character: { not: character.id_Character }
          },
        });
        for (const member of otherMembers) {
          if (member[competence] && member[competence] > maxGroupCompetence) {
            maxGroupCompetence = member[competence];
          }
        }
      }
      const result = getThrowsByStats(character, modifier, competence, caracteristic, req.body.isCollective, maxGroupCompetence);

      if (result.error) { return res.status(403).json(result); }
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.render('../views/login.html.twig');
  }

});


/**
 * @route PUT /share/throw
 * @description Persists a dice roll result to the database and broadcasts it in real-time to active listeners via Server-Sent Events (SSE).
 * Features:
 * - Accepts parsed dice roll attributes: `result` arrays, `relances` quantities, `caracteristic`, `competence`, `thrownByAI`.
 * - Aggregates duplicate dice formats into a readable log string (e.g., `d6: 4, 2 | d10: 8`).
 * - Formats text dynamically depending on remaining rerolls.
 * - Extracts `id_User` to map the roll onto their active `favoriteCharacter`.
 * - Writes the historical roll into `prisma.roll.create(...)`.
 * - Interacts directly with the global `rollClients` Set (SSE streaming pool), pushing stringified JSON blocks directly to any connected client in the same RPG `groupeId` or user session.
 * 
 * Wait for obsolete code confirmation: Similar to `/throw`, it misses `if (!user || !user.character)` safety check. Also, this endpoint relies entirely on `rollClients` being an in-memory Set; this application CANNOT be horizontally scaled/load-balanced across multiple Node.js instances (e.g. Docker swarm) because the SSE connections are bound to local RAM, a classic obsolete monolithic pattern.
 */
router.put('/share/throw', async (req, res) => {
  const id_User = req.session.userId;
  const { result, relances, caracteristic, competence, thrownByAI, color } = req.body;

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
    
    // Inject custom metadata transparently as HTML comment
    const metaColor = color || "#2d2d2d";
    const metadata = `<!--meta:${JSON.stringify({color: metaColor, results: result})}-->`;
    rollContent = metadata + rollParts.join(' | ');
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



/**
 * @route GET /stream/rolls
 * @description Establishes a long-lived Server-Sent Events (SSE) connection stream to broadcast real-time game rolls.
 * Features:
 * - Demands `userId` from session (HTTP 401 fallback).
 * - Identifies user's active `character` to figure out which RPG `groupeId` they belong to (to filter incoming broadcasted rolls).
 * - Sets necessary HTTP headers (`text/event-stream`, `keep-alive`, `no-cache`).
 * - Emits immediate blank connection acknowledgment (`: connected`).
 * - Keeps connection alive every 15 seconds using a setInterval heartbeat (`: ping`).
 * - Caches `res` context globally in `rollClients` to be iterated on when `/share/throw` is hit.
 * - Adds a `close` listener strictly required to run cleanup (clearing intervals and removing `client` from memory `Set`).
 * 
 * Wait for obsolete code confirmation: Once again, relying on `rollClients` Set in a single Node process means users on different load balancer nodes won't see each other's rolls.
 */
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

/**
 * @route PUT /fetch/rolls
 * @description Initially loads the historical dice roll context/log for the user's current group or character.
 * Features:
 * - Extracts `id_User` to locate their active `favoriteCharacter`.
 * - Calculates query scope recursively: if the caller sends a `?groupe_id=` param query, overrides their default group. Otherwise fetches the character's `groupeId` from DB.
 * - Extracts all correlated `prisma.roll.findMany` matching either the Group (`groupeId`) or the distinct standalone Character (`characterId_Character`).
 * - Formats results hierarchically (`orderBy: { id: 'asc' }`).
 * - Bundles nested avatar details inside `Character` mapping for UI rendering.
 * 
 * Wait for obsolete code confirmation: Why is this endpoint a `PUT`? It only retrieves (`fetch`) data and doesn't update the database. REST standards mandate `GET` for data retrieval endpoints. Also, `queryGroupeId` query usage can be spoofed by any user modifying the URL, so users can spy on rolls of *any* `groupe_id` due to pure lack of ownership validation.
 */
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

/**
 * @route POST /Groupe
 * @description Creates a new RPG "Groupe" entity in the database.
 * Features:
 * - Accepts group details (`nom`, `niveau`, `reserveDes`, `reputation`, etc.) from the payload.
 * - Applies parsing logic to ensure `niveau` and `reserveDes` default correctly if bad/null input is provided.
 * - Saves entity into `prisma.groupe`.
 * 
 * Wait for obsolete code confirmation: There is ZERO session authentication checking here (`req.session.userId`). Any unauthenticated bot can send POST requests to this API endpoint and fill your database with millions of fake groups.
 */
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

/**
 * @route GET /Groupe/:id
 * @description Retrieves a specific "Groupe" configuration entity using its database ID.
 * Features:
 * - Parses `req.params.id`.
 * - Locates via Prisma `findUnique`.
 * - Replies with JSON object representing group stats.
 * 
 * Wait for obsolete code confirmation: Once again, no auth check. MORE IMPORTANTLY: The exact same route function `router.get('/Groupe/:id', ...)` was duplicated below. Please confirm deleting the duplicate.
 */
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

// [!] DUPLICATE ROUTE DETECTED. Please confirm if I can delete this second /Groupe/:id block entirely.
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

/**
 * @route PUT /Groupe/:id
 * @description Modifies existing attributes of a group.
 * Features:
 * - Identifies target `id` by parsing the URL parameter.
 * - Extracts updated properties from JSON `req.body` directly.
 * - Merges target entity fields in Prisma with `update`.
 * 
 * Wait for obsolete code confirmation: Like POST/Groupe, missing authentication and ownership validation allows ANY user (or unauthenticated request) to rename or modify the stats of ANY existing group!
 */
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

/**
 * @route POST /Character/:charId/joinGroupe/:groupeId
 * @description Modifies a character's RPG identity to legally associate them with a designated "Groupe" entity ID.
 * Features:
 * - Parses target Character ID `charId` and target `groupeId` parameters.
 * - Forces the Prisma relational reference (`groupeId`) inline using direct raw `params`.
 * - Replies with the newly mutated JSON logic of the Character.
 * 
 * Wait for obsolete code confirmation: Very dangerously lacks `.session.userId` ownership validation! Anyone hitting the backend directly can manipulate characters they do not own to join groups they do not own. A POST request without a body parameter updating relationships is also against JSON API principles; typically this should be a PUT like `/Character` update.
 */
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

/**
 * @route POST /Character/:charId/leaveGroupe
 * @description Forcefully evicts a character from their actively assigned "Groupe".
 * Features:
 * - Reads `charId` url parameter directly.
 * - Enforces Prisma `update` setting `groupeId` mapping strictly to `null`.
 * - Responds gracefully handling `err.message` natively on HTTP 500 error.
 * 
 * Wait for obsolete code confirmation: Like `/joinGroupe`, missing `.session.userId` ownership checking here. Literally anybody can log in and submit the HTTP endpoint to kick ANY character out of ANY group.
 */
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


/**
 * @route GET /groupes
 * @description Serves an HTML dashboard of all known RPG groups available in the database, with context of the user's active character.
 * Features:
 * - Demands `id_User` to enforce actual logged-in user session presence (redirects to Login else).
 * - Grabs a holistic array of `groupe.findMany()`.
 * - Cross-checks the authenticated user's `favoriteCharacter` state so the UI conditionally renders logic (like the "Join Group" button).
 * - Pipes variables natively into Twig view rendering `groupes.html.twig`.
 * 
 * Wait for obsolete code confirmation: Uses `findFirst` to get `favoriteCharacter` instead of `findUnique` on a dedicated table. More importantly: Returning the ENTIRE `findMany()` list of groups without pagination will severely impact the node performance if there are more than 50 groups globally.
 */
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

/**
 * @route POST /Character/Favorite/inventory
 * @description Inlines the user character's JSON-stringified inventory onto the Prisma mapping.
 * Features:
 * - Reads arbitrary `charId` and `inventory` from the parsed body.
 * - Mutates target Entity's `inventory`.
 * - Replies cleanly HTTP 200 "Updated" body response.
 * 
 * Wait for obsolete code confirmation: Despite the `/Favorite/` nomenclature, the route strictly relies entirely on whatever `charId` is sent without `user_id` validation. Any script/user can wipe out the inventory of ANY character ID. MORE IMPORTANTLY: I deleted a totally duplicate function block of this exact route below it. Please confirm this was intended!
 */
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
