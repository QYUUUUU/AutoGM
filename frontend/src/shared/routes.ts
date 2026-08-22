// Single source of truth for every real route on the site.
// Every current + future frontend entry (chrome, home, and whatever page
// we migrate next) imports from here instead of hardcoding hrefs, so a
// route rename only ever needs to happen in one place.
export const ROUTES = {
  home: "/home",
  login: "/login",
  register: "/register",
  assistant: "/dashboard",
  characters: "/characters",
  maps: "/maps",
  rituels: "/rituels",
  faveurs: "/faveurs",
  eclats: "/eclats",
  adminPannel: "/admin/pannel",
  adminAdversaries: "/admin/adversaries",
  monde: "/monde",
} as const;

export const NAV_FEATURES = [
  { label: "Mon Assistant", href: ROUTES.assistant },
  { label: "Mes Personnages", href: ROUTES.characters },
  { label: "Les Cartes", href: ROUTES.maps },
  { label: "Rituels", href: ROUTES.rituels },
  { label: "Faveurs", href: ROUTES.faveurs },
  { label: "Éclats", href: ROUTES.eclats },
  { label: "Le Monde", href: ROUTES.monde },
] as const;

export const ADMIN_NAV = [
  { label: "Dashboard MJ", href: ROUTES.adminPannel },
] as const;

// home.html.twig (and eventually every migrated page) injects this global
// before loading its bundle, e.g.:
//   <script>window.__GODS_SITE__ = { isAdmin: {{ isAdmin ? 'true' : 'false' }} };</script>
declare global {
  interface Window {
    __GODS_SITE__?: { isAdmin?: boolean };
  }
}

export function readIsAdmin(): boolean {
  return Boolean(window.__GODS_SITE__?.isAdmin);
}
