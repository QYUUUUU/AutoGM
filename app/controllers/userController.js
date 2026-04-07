
import { prisma } from '../prisma/prismaClient.js';

/**
 * @fileoverview userController.js
 * @description Manages general frontend data aggregation. Currently primarily orchestrates the main application Dashboard.
 * Has strong dependencies on Express Request Sessions (`req.session.userId`).
 */

/**
 * @function getDashboard
 * @description Gathers data for the user's dashboard view: fetches the user's characters, conversations, and determines their "favorite" active character to put it at the top of the UI list.
 * Features:
 * - Session identity verification (redirects to Login if unauthenticated).
 * - Automatic redirect to `/Character/create/new/` if the user has no characters.
 * - Automatic redirect to `/Conversation/new/` if no unnamed conversations exist.
 * - Sorts all characters to bump the pinned "favorite" character to array index `[0]`.
 * 
 * Wait for obsolete code confirmation: Multiple cascading redirect flows (`res.redirect`) exist here based on lack of conversations or characters. This logic couples the dashboard rendering intrinsically to the user's progression state.
 * @param {Object} req - Express Request object (requires `req.session.userId`).
 * @param {Object} res - Express Response object.
 * @returns {Promise<void>} Rendered TWIG template `index.html.twig` or redirect.
 */
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
