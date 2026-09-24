import argon2 from 'argon2';

// argon2id: OWASP's current recommendation over bcrypt for new systems.
// Tuned parameters (memory cost, time cost, parallelism) below follow the
// OWASP Password Storage Cheat Sheet's argon2id baseline.
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456, // 19 MiB
  timeCost: 2,
  parallelism: 1,
};

export function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, ARGON2_OPTIONS);
}

export function verifyPassword(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain).catch(() => false);
}

// Minimum client-facing complexity requirement, enforced again here (not just
// in the Zod schema) so it can never be bypassed by calling the service directly.
const PASSWORD_MIN_LENGTH = 8;

export function isPasswordComplexEnough(password: string): boolean {
  if (password.length < PASSWORD_MIN_LENGTH) return false;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9\W]/.test(password);
  return hasLetter && hasNumberOrSymbol;
}
