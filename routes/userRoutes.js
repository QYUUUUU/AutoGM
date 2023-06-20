import { Router } from 'express';
import twig from 'twig';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId

  try {
    const prisma = new PrismaClient();

    const characters = await prisma.character.findMany({
      where: { userId: id_User },
    });

    if (!characters || characters.length === 0) {
      return res.status(404).json({ error: 'No characters found for the user' });
    }

    if (id_User !== "undefined" && id_User !== "" && id_User !== null) {
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

      res.render('index.html.twig', { characters: sortedCharacters }); // Pass sortedCharacters as an object
    } else {
      res.render('../views/login.html.twig');
    }
  } catch (error) {
    console.error(error);
    res.render('../views/login.html.twig');
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


router.get('/Characters/', async (req, res) => {
  const id_User  = req.session.userId; // Assuming you have the user ID stored in req.session.userId

  try {
    const prisma = new PrismaClient();
    const characters = await prisma.character.findMany({
      where: { userId:id_User },
    });

    if (!characters || characters.length === 0) {
      return res.status(404).json({ error: 'No characters found for the user' });
    }
    
    res.render('characterslist.html.twig', { characters }); // Pass characters as an object

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/Character/:id_Character', async (req, res) => {
  const id_User = req.session.userId;
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const prisma = new PrismaClient();

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
      res.json(Character);
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/Character/:id/:field/:value', async (req, res) => {
  const id_User = req.session.userId;
  const { id, field, value } = req.params;
  let parsedValue;

  if (!isNaN(value)) {
    parsedValue = parseInt(value);
  } else {
    parsedValue = value;
  }

  try {
    const prisma = new PrismaClient();
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
      res.json(updatedCharacter);
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/Character/create/new/', async (req, res) => {
  const id_User = req.session.userId;
  const { userId } = req.session; // Assuming you have the user ID stored in req.session.userId
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the connected user is the same as the user creating the character or has the role "admin"
    if (user.id === id_User || req.session.role === 'admin') {
      const character = await prisma.character.create({
        data: {
          User: { connect: { id: userId } },
          // Add other properties for the character here
        },
      });

      res.redirect('/Characters');
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

router.get('/Character/show/:id_Character', async (req, res) => {
  const id_User = req.session.userId;
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const prisma = new PrismaClient();

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
      res.render('character.html.twig', { character });
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/Character/Favorite/set/:id_Character', async (req, res) => {
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const id_User = req.session.userId;
  const { userId } = req.session; // Assuming you have the user ID stored in req.session.userId
  const prisma = new PrismaClient();

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
        res.json({ message: 'Character is already the favorite' });
      } else {
        await prisma.favoriteCharacter.deleteMany({ where: { userId: user.id } });

        const favoriteCharacter = await prisma.favoriteCharacter.create({
          data: {
            user: { connect: { id: user.id } },
            character: { connect: { id_Character: id_Character } }
          }
        });

        res.json(favoriteCharacter);
      }
    } else {
      res.status(403).json({ error: 'Unauthorized access' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;