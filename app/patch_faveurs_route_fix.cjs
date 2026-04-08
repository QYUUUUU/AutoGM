const fs = require('fs');

let routesCode = fs.readFileSync('routes/userRoutes.js', 'utf8');

const faveursRoute = `
/**
 * @route GET /faveurs
 * @description Renders the faveurs selection page
 * @access Public/Private
 */
router.get('/faveurs', async (req, res) => {
  const id_User = req.session?.userId;
  let characters = [];
  let faveurs = [];
  try {
    faveurs = await prisma.faveur.findMany();
    if (id_User) {
      characters = await prisma.character.findMany({
        where: { userId: id_User },
      });
    }
  } catch (e) {
    console.error(e);
  }
  
  res.render('../views/faveurs.html.twig', { characters, faveurs });
});
`;

if (!routesCode.includes("router.get('/faveurs'")) {
    routesCode = routesCode.replace("export default router;", faveursRoute + "\nexport default router;");
    fs.writeFileSync('routes/userRoutes.js', routesCode);
    console.log("Added /faveurs route to userRoutes.js");
}
