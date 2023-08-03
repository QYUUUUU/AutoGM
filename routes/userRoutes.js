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
        where: { userId: id_User, Name: null },
        orderBy: { id: 'desc' },
      });

      console.log(conversations);

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
  }else{
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
    
    return res.render('characterslist.html.twig', { characters }); // Pass characters as an object

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}else{
  return res.render('../views/login.html.twig');
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
        return res.json(Character);
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }else{
    return res.render('../views/login.html.twig');
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
        return res.json(updatedCharacter);
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }else{
    return res.render('../views/login.html.twig');
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
  }else{
    return res.render('../views/login.html.twig');
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
        return res.render('character.html.twig', { character });
      } else {
        return res.render('../views/login.html.twig');
      }
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }else{
    return res.render('../views/login.html.twig');
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
  }else{
    return res.render('../views/login.html.twig');
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

    return res.json(favoriteCharacter.character);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
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
  }else{
    return res.render('../views/login.html.twig');
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


    return res.json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/AutoGM', async (req, res) => {
  console.log("AUTO GM CALLED")
  const id_User = req.session.userId; // Assuming you have the user ID stored in req.session.userId
  console.log(id_User);
  if(id_User){
    try {
      const prisma = new PrismaClient();
  
      const characters = await prisma.character.findMany({
        where: { userId: id_User },
      });

      const conversations = await prisma.conversation.findMany({
        where: { userId: id_User, Name: "Auto" },
      });
      
      if (!conversations.some((conversation) => conversation.Name === "Auto")) {
        return res.redirect('/Conversation/auto/new/');
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
  
        return res.render('autoGM.html.twig', { characters: sortedCharacters, conversations: conversations }); // Pass sortedCharacters as an object
      } else {
        return res.render('../views/login.html.twig');
      }
    } catch (error) {
      console.error(error);
      return res.render('../views/login.html.twig');
    }
  }else{
    return res.render('../views/login.html.twig');
  }
});



router.get('/Conversation/auto/new', async (req, res) => {
  console.log("NEW AUTO CALLED")
  const userId = req.session.userId;
  const prisma = new PrismaClient();
  if(userId){
    try {
      const user = await prisma.user.findUnique({ where: { id: userId }, include: { characters: true } });
  
      // Check if the connected user is the same as the user creating the character or has the role "admin"
      if (user.id === userId || req.session.role === 'admin') {
  
        const currentConversation = await prisma.conversation.create({
          data: {
            Name:"Auto",
            User: { connect: { id: userId } },
            // Add other properties for the character here
          },
        });

        await prisma.message.create({
          data: {
            content: `Your name is GM. You are a Game Master of a tabletop RPG game and you narrate situations in which, I, the player, make decisions. The world you are making me play in is a Dark fantasy themed one. The scenario takes place in a medieval city of the kingdom of Avhorea. The ruler of the kingdom is "Sevire the Red", nickname she acquired by killing all the noble houses that were her ennemies, and by disennobling the weakest ones she still has ennemies within her kingdom, although they don't fight her upfront and scheme in the shadows.

            Adrien se réveille un matin au camp militaire de son régiment. Adrien est un soldat de l’empire du soleil noir. Il fait partit du 17ème régiment, composé de 2500 hommes.
            
            Le Culte du Soleil Noir est une religion fanatique qui prêche l'arrivée d'un nouveau Prophète et considère le soleil comme l'Œil de l'Unique. Ils organisent des fêtes religieuses appelées le Massacre du Soleil Noir, où des orgies ont lieu et des sacrifices violents sont effectués.
            
            Son régiment, aux côtés du 16ème, est chargé d’assister Vox Aedes, l’ordre dont la mission est de répandre le Culte du soleil noir dans leur mission actuelle, faire du prosélytisme en Avhorae.
            
            Le Culte tente d'infiltrer les terres de l'ouest en général, mais a été interdit depuis l'ascension de Sevire au trône d’Avhorae.
            
            Des purges ont même été organisées par Sévire pour éliminer les congrégations clandestines mais les fidèles du Culte tentent maintenant de recruter parmi les survivants des familles ducales déchues lors de l’accession au pouvoir de Sévire.
            
            Adrien est donc rapidement équipé et prêt à aider à l’installation du camp caché dans la montagne au nord de la ville de Cyridon.
            
            Durant la matinée, Adrius est interrompu dans ses corvées par son officier responsable qui lui demande de le suivre vers la tente du général.
            
            drien et son groupe, désormais équipés d'habits civils, commencent leur infiltration dans la ville de Cyridon. Ils doivent se mêler à la population locale pour obtenir des informations cruciales sur l'exécution publique planifiée par Sévire.
            
            Sevire has a magical sword, that make her almost as strong as a god, and 8 other blades are weilded by her most faithful servents, and generals of her army, the silver phalanx.
            
            To help yourself, you must use tools when necessary. Always decide the player's actions resolution via the throwing of a d20 dice.
            
            If you have a general question about the lore of GODS or its rules use the tool gods-lore with the Action gods-lore and the Action Input set to the question asked, the tool will then answer your question.`, // Replace with the actual content
            sender: "Bot",   // Replace with the actual sender
            Conversation: { connect: { id: currentConversation.id } },
            // Add other properties for the character here
          },
        });

        await prisma.message.create({
          data: {
            content: "Bienvenue dans le royaume d'Avhorea, cher voyageur. Vous incarnez un garde de l'empire du Soleil noir chargé d'espionner le royaume d'Avhorae et son impératrice Sévire, dites moi quand vous voulez commencer à jouer.'.", // Replace with the actual content
            sender: "Bot",   // Replace with the actual sender
            Conversation: { connect: { id: currentConversation.id } },
            // Add other properties for the character here
          },
        });

    
        return res.redirect('/AutoGM');
      } else {
        return res.status(403).json({ error: 'Unauthorized access' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  }else{
    return res.render('../views/login.html.twig');
  }
  
});
export default router;