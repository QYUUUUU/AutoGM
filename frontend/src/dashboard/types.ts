export interface InjuryTrack {
  current: number;
  max: number;
}

export interface CharacterSummary {
  id: string | number;
  nom: string;
}

export interface EquipmentItem {
  id: string | number;
  name: string;
  stats?: string;
  desc?: string;
  type?: string;
}

export interface InventoryItem {
  name: string;
  type: string;
  stats: string;
  desc: string;
  quantity: number;
}

export interface Group {
  id: string | number;
  nom: string;
  niveau: number;
  reputation: string;
  reserveDes: number;
  instinctGroupe: string;
  capacitesInstinctGroupe: string;
  capacitesGroupe: string;
}

export interface ActiveCharacter {
  id: string | number;
  nom: string;
  avatar?: string | null;
  genre?: string;

  blessurelegere: InjuryTrack;
  blessuregrave: InjuryTrack;
  blessuremortelle: InjuryTrack;
  effort: { current: number; max: number };
  sangfroid: { current: number; max: number };

  armeEquipeeName: string;
  armureEquipeeName: string;
  
  notes: string;
  inventory: InventoryItem[];
  groupe: Group | null;
  
  // Lore & Abilities
  origine?: string;
  instinct?: string;
  avantage?: string;
  desavantage?: string;
  capaciteInstinct1?: string;
  langues: string[];
  specialites: { specialite: string; competence: string }[];
  faveurs: string[];
  rituelsMaitrises: string[];
  
  stadeEclat?: string;
  formeEclat?: string;
  sphereEclat?: string;
  apparenceEclat?: string;
  embrasementEclat?: string;
  capacitesEclat?: string[];
}

export type InjuryField = "blessurelegere" | "blessuregrave" | "blessuremortelle";
export type ResourceField = "effort" | "sangfroid";

export interface ThrowRequestPayload {
  modifier: number;
  competence: string;
  caracteristic: string;
  isCollective: boolean;
}

export interface ThrowResponsePayload {
  totalDice: number;
  relances: number;
  extraDice?: Record<string, number>;
}

export type DiceCounts = Record<string, number>;

declare global {
  interface Window {
    randomDiceThrow?: (
      diceCounts: DiceCounts,
      relances: number,
      caracteristic: string | null,
      competence: string | null,
      thrownByAI?: boolean
    ) => void;
    animateRemoteRoll?: (results: any[], color: string) => void;
    myRollIds?: string[];
  }
}