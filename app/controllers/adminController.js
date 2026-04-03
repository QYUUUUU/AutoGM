import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function displayPannel(req, res) {
  if (req.session.userId == 1) {
    try {
      const groupes = await prisma.groupe.findMany();
      let activeGroupeId = req.query.groupe_id ? parseInt(req.query.groupe_id) : null;
      if (!activeGroupeId && groupes.length > 0) {
          activeGroupeId = groupes[0].id;
      }

      let worldState = null;
      if (activeGroupeId) {
        worldState = await prisma.worldState.findUnique({
          where: { groupeId: activeGroupeId }
        });
        if (!worldState) {
          worldState = await prisma.worldState.create({
            data: { groupeId: activeGroupeId }
          });
        }
      } else {
        // No group exists, generic world state
        worldState = await prisma.worldState.findUnique({
          where: { id: 1 }
        });
        if (!worldState) {
          worldState = await prisma.worldState.create({
            data: { id: 1 }
          });
        }
      }
      let characters = [];
      let equipment = [];
      let adversaries = [];
      try {
          if (activeGroupeId) {
             characters = await prisma.character.findMany({ where: { groupeId: activeGroupeId } });
          }
          const eqPath = path.join(process.cwd(), "data", "equipment.json");
          if (fs.existsSync(eqPath)) {
             equipment = JSON.parse(fs.readFileSync(eqPath, "utf8"));
          }
          adversaries = await prisma.adversary.findMany();
      } catch(e) { console.error("Error loading extra data", e); }
      
      res.render('../views/admin.html.twig', { worldState, groupes, activeGroupeId, characters, equipment, adversaries });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing request");
    }
  } else {
    res.redirect('/');
  }
}

export async function updateWorldState(req, res) {
  if (req.session.userId == 1) {
    const { timeOfDay, weekType, dayNumber, sinlaPhase, akhatState, loisCoutumes, rations, etatMontures, encombrement, groupeId } = req.body;
    try {
      const parsedGroupeId = groupeId ? parseInt(groupeId) : null;
      
      let existingWorldState = null;
      if (parsedGroupeId) {
         existingWorldState = await prisma.worldState.findUnique({ where: { groupeId: parsedGroupeId }});
      } else {
         existingWorldState = await prisma.worldState.findUnique({ where: { id: 1 }});
      }

      let updateData = {
          timeOfDay,
          weekType,
          dayNumber: parseInt(dayNumber),
          sinlaPhase,
          akhatState,
          loisCoutumes,
          rations: rations ? parseInt(rations) : 0,
          etatMontures,
          encombrement
      };

      if (existingWorldState) {
        await prisma.worldState.update({
          where: { id: existingWorldState.id },
          data: updateData
        });
      } else {
        await prisma.worldState.create({
          data: {
            ...updateData,
            groupeId: parsedGroupeId
          }
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating world state" });
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}


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

