import type { CountryExperience } from "./schema";
import { babelExperience } from "./babelExperience";

const placeholder = (id: string, name: string): CountryExperience => ({
  id, name, region: "Terres Sauvages", authored: false, beats: []
});

export const countries: Record<string, CountryExperience> = {
  babel: babelExperience,
  aon: placeholder("aon", "Aon"),
  avhorae: placeholder("avhorae", "Avhorae"),
  fakhar: placeholder("fakhar", "Fakhar"),
  khashan: placeholder("khashan", "Khashan"),
  "empire-du-soleil-noir": placeholder("empire-du-soleil-noir", "Empire du Soleil Noir"),
  horde: placeholder("horde", "Horde"),
  "royaumes-divises": placeholder("royaumes-divises", "Royaumes divisés"),
  ool: placeholder("ool", "Ool"),
  saeth: placeholder("saeth", "Saeth"),
  tegee: placeholder("tegee", "Tégée"),
  tuuhle: placeholder("tuuhle", "Tuuhle"),
  vaelor: placeholder("vaelor", "Vaelor"),
  valdheim: placeholder("valdheim", "Valdheim"),
};

export const getCountry = (id: string) => countries[id.toLowerCase()] ?? null;
