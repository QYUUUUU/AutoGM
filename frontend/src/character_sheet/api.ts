// ─── API helpers ────────────────────────────────────────────────────────────
// Matches the real backend contract used by the legacy character.js:
// a single generic endpoint, PUT /Character, body { id, field, value }.
// There is no per-field or per-resource route — every field (including the
// avatar, sent as a base64 data URL) goes through this one call.

export async function updateCharacterField(id: number | string, field: string, value: any) {
  const res = await fetch("/Character", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, field, value }),
  });

  if (!res.ok) {
    throw new Error(`Failed to update ${field} for Character ${id} (${res.status})`);
  }

  // The avatar update responds with { avatar: "<new backend path>" }.
  // Other fields don't rely on a response body, but we parse defensively.
  return res.json().catch(() => ({}));
}

// Reads a File as a base64 data URL — this is what the backend expects for
// the "avatar" field's value (see updateCharacterField above).
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}