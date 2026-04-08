// Chargement centralisé des capacités d'éclat pour backend et frontend
import fs from 'fs';
import path from 'path';

let eclatCapacites = null;

export function getEclatCapacites() {
  if (!eclatCapacites) {
    const filePath = path.join(process.cwd(), 'public', 'js', 'data', 'eclat_capacites.json');
    try {
      eclatCapacites = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.error('Erreur chargement eclat_capacites.json', e);
      eclatCapacites = {};
    }
  }
  return eclatCapacites;
}
