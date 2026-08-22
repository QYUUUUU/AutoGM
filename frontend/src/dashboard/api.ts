import type { ThrowRequestPayload, ThrowResponsePayload } from "./types";

export async function throwStatCheck(payload: ThrowRequestPayload): Promise<ThrowResponsePayload> {
  const response = await fetch("/throw", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (err.error) alert(err.error);
    throw new Error(err.error || response.statusText);
  }
  return response.json();
}

export async function updateCharacterField(id: string | number, field: string, value: any): Promise<Response> {
  const response = await fetch("/Character", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, field, value }),
  });
  if (!response.ok) console.error(`Error updating ${field} for Character ${id}`);
  return response;
}

export async function updateInventoryReq(charId: string | number, inventory: any[]) {
  return fetch('/Character/Favorite/inventory', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ charId, inventory: JSON.stringify(inventory) })
  });
}

export async function fetchCharacter(characterId: string | number) {
  const response = await fetch(`/Character/${characterId}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

// --- Group API ---
export async function createAndJoinGroup(charId: string | number, payload: any) {
  const res = await fetch('/Groupe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const grp = await res.json();
  await fetch(`/Character/${charId}/joinGroupe/${grp.id}`, { method: 'POST' });
}

export async function joinGroupReq(charId: string | number, grpId: string | number) {
  await fetch(`/Character/${charId}/joinGroupe/${grpId}`, { method: 'POST' });
}

export async function leaveGroupReq(charId: string | number) {
  await fetch(`/Character/${charId}/leaveGroupe`, { method: 'POST' });
}

export async function updateGroupDiceReq(grpId: string | number, reserveDes: number) {
  await fetch(`/Groupe/${grpId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reserveDes })
  });
}

// --- Add to api.ts ---
export async function removeRitualReq(characterId: string | number, ritualName: string) {
  const res = await fetch('/rituels/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ characterId, ritualName })
  });
  return res.json();
}

// Add these to your existing api.ts
export async function sendAgentMessage(prompt: string, conversationId: number | null) {
  const res = await fetch("/backend/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, conversationId }),
  });
  if (!res.ok) throw new Error("Server error");
  return res.json();
}

export async function sendRulesMessage(prompt: string, conversationId: number | null) {
  const res = await fetch("/backend/rules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, conversationId }),
  });
  if (!res.ok) throw new Error("Server error");
  return res.json();
}