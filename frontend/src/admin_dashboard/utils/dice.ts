import type { DiceRollResult } from "../types/admin";

export function rollD10(pool: number, difficulty = 7): DiceRollResult {
  const safePool = Math.max(0, Number.isFinite(pool) ? Math.floor(pool) : 0);
  const rolls = Array.from({ length: safePool }, () => Math.floor(Math.random() * 10) + 1);
  return {
    rolls,
    successes: rolls.filter(value => value >= difficulty).length,
  };
}

export function parseDiceFormula(formula: string) {
  const raw = String(formula || "").toUpperCase().replace(/\s/g, "");
  const dice = parseInt(raw, 10) || 0;
  const bonus = raw.includes("+") ? parseInt(raw.split("+")[1], 10) || 0 : 0;
  return { raw, dice, bonus };
}

export function rollFormula(formula: string, difficulty = 7, rerolls = 0) {
  const { dice, bonus } = parseDiceFormula(formula);
  const first = rollD10(dice, difficulty);
  const failed = dice - first.successes;
  const rerollCount = Math.min(Math.max(0, rerolls), failed);
  const second = rerollCount ? rollD10(rerollCount, difficulty) : { rolls: [], successes: 0 };

  return {
    rolls: [...first.rolls, ...second.rolls],
    successes: first.successes + second.successes + bonus,
    rerollCount,
    bonus,
  };
}

export function rollDamageFormula(formula: string) {
  const raw = String(formula || "").toUpperCase().replace(/\s/g, "");
  const match = raw.match(/(\d+)D(\d+)/);
  if (!match) return { rolls: [], total: parseInt(raw, 10) || 0 };

  const dice = Number(match[1]);
  const sides = Number(match[2]);
  const rolls = Array.from({ length: dice }, () => Math.floor(Math.random() * sides) + 1);
  return { rolls, total: rolls.reduce((sum, value) => sum + value, 0) };
}
