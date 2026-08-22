# GODS — Admin Dashboard React/Vite

Migration du dashboard MJ legacy vers React, en gardant le contrat Twig/backend et le stockage navigateur existant.

## Architecture

- `AdminDashboardApp.tsx` — composition racine, aucun métier lourd.
- `hooks/useAdminDashboard.ts` — état et actions métier du dashboard.
- `components/` — UI découpée par responsabilité.
- `utils/dice.ts` — jets D10 et dégâts.
- `utils/combat.ts` — transformation PJ/PNJ, armure, initiative, blessures.
- `utils/constants.ts` — tables de règles et listes de sélection.
- `types/admin.ts` — contrats TypeScript du dashboard.
- `admin-dashboard.tsx` — entrypoint Vite.
- `admin.html.twig` — mount point + injection JSON + bundle.

## Entrée Vite

Le bundle attendu par Twig est :

```text
/js/admin-dashboard.js
```

L'entrypoint source est :

```text
admin-dashboard.tsx
```

## Données Twig attendues

Le template injecte :

- `activeGroupeId`
- `groupes`
- `worldState`
- `characters`
- `equipment`
- `adversaries`

Les noms correspondent au dashboard legacy : les PJ viennent de `characters`, les équipements de `equipment` et le bestiaire de `adversaries`.

## Compatibilité conservée

- `/admin/world-state`
- `localStorage.gmTabsState`
- `localStorage.combatantsState`
- `/js/dashboardTrackRolls.js`
- `?groupe_id=...`
- données d'armure `Protection: C(...)/P(...)/T(...)`

Le premier chargement sans `gmTabsState` reconstruit les PJ depuis `characters`, puis réutilise `combatantsState` si celui-ci existe. Cela permet une transition sans perdre les scènes déjà enregistrées.

## Déploiement

Copier le contenu React dans le dossier source Vite existant, adapter uniquement les chemins relatifs si ton arborescence diffère, puis lancer le build habituel :

```bash
npm run build
```
