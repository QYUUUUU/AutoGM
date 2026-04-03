const fs = require('fs');

let code = fs.readFileSync('app/controllers/adminController.js', 'utf8');

const newFunctions = `

export async function listAdversaries(req, res) {
  if (req.session.userId == 1) {
    try {
      const adversaries = await prisma.adversary.findMany();
      res.render('../views/adversaries.html.twig', { adversaries });
    } catch (e) {
      console.error(e);
      res.status(500).send("Error");
    }
  } else {
    res.redirect('/');
  }
}

export async function createAdversary(req, res) {
  if (req.session.userId == 1) {
    try {
      await prisma.adversary.create({
        data: {
          name: req.body.name || "Inconnu",
          description: req.body.description || "",
          type: req.body.type || "Humain",
          menace: req.body.menace || "Mineure",
          experience: req.body.experience || "Débutant",
          role: req.body.role || "Mineur",
          attaque: req.body.attaque || "3D",
          contact: req.body.contact || "5/7",
          action: req.body.action || "3D",
          specialite: req.body.specialite || "4D",
          specialite_details: req.body.specialite_details || "",
          relances: req.body.relances || "0D",
          reserve: req.body.reserve || "0D",
          reaction: req.body.reaction || "3D",
          arme: req.body.arme || "",
          armure: req.body.armure || "",
          blessuresLegeres: parseInt(req.body.blessuresLegeres) || 2,
          blessuresGraves: parseInt(req.body.blessuresGraves) || 3,
          blessuresMortelles: parseInt(req.body.blessuresMortelles) || 4,
          capacites: req.body.capacites || "",
          userId: req.session.userId
        }
      });
      res.redirect('/admin/adversaries');
    } catch (e) {
      console.error(e);
      res.status(500).send("Error saving adversary");
    }
  } else {
    res.redirect('/');
  }
}

export async function deleteAdversary(req, res) {
  if (req.session.userId == 1) {
    try {
      await prisma.adversary.delete({
        where: { id: parseInt(req.params.id) }
      });
      res.redirect('/admin/adversaries');
    } catch (e) {
      console.error(e);
      res.status(500).send("Error deleting adversary");
    }
  } else {
    res.redirect('/');
  }
}

`;

fs.writeFileSync('app/controllers/adminController.js', code + newFunctions);
console.log('Admin controller updated');
