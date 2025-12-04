import type { User } from "@shared/schema";

const AUTH_KEY = "rtg_demo_user";

export function saveUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getUser(): User | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
