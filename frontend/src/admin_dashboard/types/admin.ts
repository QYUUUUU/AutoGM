export type AnyRecord = Record<string, any>;

export type WorldState = AnyRecord;

export interface Combatant {
  id: string | number;
  isPC: boolean;
  name: string;
  reaction: number;
  init: number;
  armor: string;
  lMax: number;
  gMax: number;
  mMax: number;
  l: number;
  g: number;
  m: number;
  npcData?: AnyRecord;
  fullChar?: AnyRecord;
}

export interface Scene {
  name: string;
  combatants: Combatant[];
}

export type SceneMap = Record<string, Scene>;

export interface AdminDashboardData {
  activeGroupeId?: string | number | null;
  groupes?: AnyRecord[];
  worldState?: WorldState;
  characters?: AnyRecord[];
  equipment?: AnyRecord[];
  adversaries?: AnyRecord[];
}

export type SaveState = "idle" | "saving" | "saved" | "error";
export type ActiveSection = "world" | "combat";
export type WoundType = "l" | "g" | "m";

export interface DiceRollResult {
  rolls: number[];
  successes: number;
}

export interface QuickNpcConfig {
  name: string;
  threat: string;
  experience: string;
  role: string;
  specialty: string;
}
