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
      try {
          if (activeGroupeId) {
             characters = await prisma.character.findMany({ where: { groupeId: activeGroupeId } });
          }
          const eqPath = path.join(process.cwd(), "data", "equipment.json");
          if (fs.existsSync(eqPath)) {
             equipment = JSON.parse(fs.readFileSync(eqPath, "utf8"));
          }
      } catch(e) { console.error("Error loading extra data", e); }
      
      res.render('../views/admin.html.twig', { worldState, groupes, activeGroupeId, characters, equipment });
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
