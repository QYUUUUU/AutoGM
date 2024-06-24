
import { prisma } from '../prisma/prismaClient.js';

export async function getDashboard(req, res) {
    const id_User = req.session.userId;

    if (!id_User) {
        return res.render('../views/login.html.twig');
    }

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

        conversations.sort((a, b) => b.id - a.id);

        if (!characters || characters.length === 0) {
            return res.redirect('/Character/create/new/');
        }

        const favoriteCharacter = await prisma.favoriteCharacter.findFirst({
            where: { userId: id_User },
            include: { character: true },
        });

        const favoriteCharacterId = favoriteCharacter?.characterId;

        const sortedCharacters = characters.sort((a, b) => {
            if (a.id_Character === favoriteCharacterId) {
                return -1;
            } else if (b.id_Character === favoriteCharacterId) {
                return 1;
            } else {
                return 0;
            }
        });

        return res.render('index.html.twig', { characters: sortedCharacters, conversations });
    } catch (error) {
        console.error(error);
        return res.render('../views/login.html.twig');
    }
}
