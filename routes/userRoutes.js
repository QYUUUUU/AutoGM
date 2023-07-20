import { Router } from 'express';
import twig from 'twig';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.get('/', async (req, res) => {
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId
  console.log(id_User);
  if(id_User){
    try {
      const prisma = new PrismaClient();
  
      const characters = await prisma.character.findMany({
        where: { userId: id_User },
      });

      const conversations = await prisma.conversation.findMany({
        where: { userId: id_User },
      });
      
      // Sort conversations in reverse order based on their index in the array
      conversations.sort((a, b) => b.id - a.id);
  
      if (!characters || characters.length === 0) {
        res.redirect('/Character/create/new/');
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
  
        res.render('index.html.twig', { characters: sortedCharacters, conversations: conversations }); // Pass sortedCharacters as an object
      } else {
        res.render('../views/login.html.twig');
      }
    } catch (error) {
      console.error(error);
      res.render('../views/login.html.twig');
    }
  }else{
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

// Render the login page
router.get('/maps', (req, res) => {
  res.render('../views/maps.html.twig');
});


router.get('/Characters', async (req, res) => {
  const id_User  = req.session.userId; // Assuming you have the user ID stored in req.session.userId
  console.log(id_User);
  if(id_User){
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
}else{
  res.render('../views/login.html.twig');
}
});


router.get('/Character/:id_Character', async (req, res) => {
  const id_User = req.session.userId;
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const prisma = new PrismaClient();
  if(id_User){
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
  }else{
    res.render('../views/login.html.twig');
  }
  
});

router.put('/Character/:id/:field/:value', async (req, res) => {
  const id_User = req.session.userId;
  const { id, field, value } = req.params;
  let parsedValue;

  if(id_User){
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
  }else{
    res.render('../views/login.html.twig');
  }
  
});


router.get('/Character/create/new/', async (req, res) => {
  const userId = req.session.userId;
  const prisma = new PrismaClient();
  if(userId){
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { characters: true } });
  
      // Check if the connected user is the same as the user creating the character or has the role "admin"
      if (user.id === userId || req.session.role === 'admin') {
        const isUserFirstCharacter = user.characters.length === 0;
  
        const character = await prisma.character.create({
          data: {
            User: { connect: { id: userId } },
            // Add other properties for the character here
          },
        });
  
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
              // Add other properties for the character here
            },
          });
        }
  
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
  }else{
    res.render('../views/login.html.twig');
  }
  
});

router.get('/Character/show/:id_Character', async (req, res) => {
  const id_User = req.session.userId;
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const prisma = new PrismaClient();
  if(id_User){
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
        res.render('../views/login.html.twig');
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }else{
    res.render('../views/login.html.twig');
  }
  
});

router.get('/Character/Favorite/set/:id_Character', async (req, res) => {
  var { id_Character } = req.params;
  id_Character = parseInt(id_Character);
  const id_User = req.session.userId;
  const { userId } = req.session; // Assuming you have the user ID stored in req.session.userId
  const prisma = new PrismaClient();
  if(id_User){
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
    }
  }else{
    res.render('../views/login.html.twig');
  }
  
});

router.get('/Favorite/Character/get/:userId', async (req, res) => {
  var { userId } = req.params;
  var id_User = parseInt(userId);
  console.log(id_User)
  try {
    const prisma = new PrismaClient();

    const favoriteCharacter = await prisma.favoriteCharacter.findFirst({
      where: { userId: id_User },
      include: { character: true },
    });

    if (!favoriteCharacter) {
      return res.status(404).json({ error: 'Favorite character not selected' });
    }

    res.json(favoriteCharacter.character);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/Conversation/new/', async (req, res) => {
  const userId = req.session.userId;
  const prisma = new PrismaClient();
  if(userId){
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
  
        res.redirect('/');
      } else {
        res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }else{
    res.render('../views/login.html.twig');
  }
  
});

router.get('/Conversation/get/:conversationId', async (req, res) => {
  var { conversationId } = req.params;
  conversationId = parseInt(conversationId);
  const userId = req.session.userId;
  try {
    const prisma = new PrismaClient();

    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId,
      },
    });

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/Conversation/delete/:conversationId', async (req, res) => {
  var { conversationId } = req.params;
  conversationId = parseInt(conversationId);
  const userId = req.session.userId;
  try {
    const prisma = new PrismaClient();

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


    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;