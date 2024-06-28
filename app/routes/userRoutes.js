import { Router } from 'express';
import twig from 'twig';
import { prisma } from '../prisma/prismaClient.js';

const router = Router();

router.get('/dashboard', async (req, res) => {
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId

  if (id_User) {
    try {


      const characters = await prisma.character.findMany({
        where: { userId: id_User },
      });

      const conversations = await prisma.conversation.findMany({
        where: { userId: id_User, Name: null },
        orderBy: { id: 'desc' },
      });

      if (conversations.length === 0) {
        return res.redirect('/Conversation/new/');
      }

      // Sort conversations in reverse order based on their index in the array
      conversations.sort((a, b) => b.id - a.id);

      if (!characters || characters.length === 0) {
        return res.redirect('/Character/create/new/');
      } else if (id_User !== "undefined" && id_User !== "" && id_User !== null) {
        const favoriteCharacter = await prisma.favoriteCharacter.findFirst({
          where: { userId: id_User },
          include: { character: true },
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

        return res.render('index.html.twig', { characters: sortedCharacters, conversations: conversations }); // Pass sortedCharacters as an object
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

// Render the register page
router.get('/home', (req, res) => {
  res.render('../views/home.html.twig');
});

// Render the login page
router.get('/maps', (req, res) => {
  res.render('../views/maps.html.twig');
});


// Render the character form
router.get('/newcharacter', (req, res) => {
  res.render('../views/newcharacter.html.twig');
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
        puissance,
        resistance,
        precicion,
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
        rituels
      } = req.body;

      puissance = parseInt(puissance);
      resistance = parseInt(resistance);
      precicion = parseInt(precicion);
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
          instinct,
          signeastro,
          origine,
          puissance,
          resistance,
          precicion,
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
          userId: id_User,
          inventory: '{"ops":[{"insert":"\n"}]}'
        },
      });
      console.log(newCharacter);
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

      if (!characters || characters.length === 0) {
        return res.status(404).json({ error: 'No characters found for the user' });
      }

      return res.render('characterslist.html.twig', { characters }); // Pass characters as an object

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
    if (!isNaN(value)) {
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
        return res.render('character.html.twig', { character });
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


export default router;