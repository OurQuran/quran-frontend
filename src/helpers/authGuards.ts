import { getToken } from "./localStorage";
import { RoleTypeEnum } from "@/types/authTypes";
import { useAuthStore } from "@/store/authStore";

export function requireAuth(isRoute: boolean = false): boolean {
  if (getToken()) {
    return true;
  } else {
    if (isRoute && typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
}

export function isLoggedIn(isRoute: boolean = false): boolean {
  if (getToken()) {
    if (isRoute && typeof window !== "undefined") {
      window.location.href = "/";
    }
    return true;
  } else {
    return false;
  }
}

export async function hasPermission(
  role: RoleTypeEnum | RoleTypeEnum[]
): Promise<boolean> {
  const token = getToken();
  if (!token) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return false;
  }
  const store = useAuthStore.getState();
  if (!store.user?.role) {
    await store.fetchMe();
  }
  const { user } = useAuthStore.getState();
  if (!user) return false;

  const hasPerm = Array.isArray(role)
    ? role.includes(user.role)
    : user.role === role;

  if (!hasPerm && typeof window !== "undefined") {
    window.location.href = `/?redirect=${encodeURIComponent(window.location.pathname)}`;
    return false;
  }
  return true;
}

export function hasPermissionClient(
  role: RoleTypeEnum | RoleTypeEnum[]
): boolean {
  if (!getToken()) {
    return false;
  }
  const { user } = useAuthStore.getState();
  if (!user) return false;

  const hasPerm = Array.isArray(role)
    ? role.includes(user.role)
    : user.role === role;

  return hasPerm;
}
