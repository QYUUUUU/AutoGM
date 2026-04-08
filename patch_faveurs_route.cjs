const fs = require('fs');

let routesCode = fs.readFileSync('app/routes/userRoutes.js', 'utf8');

const faveursRoute = `
/**
 * @route GET /faveurs
 * @description Renders the faveurs selection page
 * @access Public/Private
 */
router.get('/faveurs', async (req, res) => {
  const id_User = req.session.userId;
  let characters = [];
  if (id_User) {
    try {
      characters = await prisma.character.findMany({
        where: { userId: id_User },
      });
    } catch (e) {
      console.error(e);
    }
  }
  res.render('../views/faveurs.html.twig', { characters });
});
`;

if (!routesCode.includes("router.get('/faveurs'")) {
    routesCode = routesCode.replace("module.exports = router;", faveursRoute + "\nmodule.exports = router;");
    fs.writeFileSync('app/routes/userRoutes.js', routesCode);
    console.log("Added /faveurs route to userRoutes.js");
}
