export const ADMIN_COOKIE = "vespera_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.AUTH_SECRET || "dev-admin-secret";
}

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminToken() {
  const password = getAdminPassword();
  if (!password) return "";

  const payload = new TextEncoder().encode(`${getSecret()}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", payload);
  return toHex(digest);
}

export async function isValidAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const expected = await createAdminToken();
  if (!expected || token.length !== expected.length) return false;

  let mismatch = 0;
  for (let i = 0; i < token.length; i += 1) {
    mismatch |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}
