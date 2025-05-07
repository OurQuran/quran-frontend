import { redirect } from "react-router";
import { getToken } from "./localStorage";
import { RoleTypeEnum } from "@/types/authTypes";
import { useAuthStore } from "@/store/authStore";

export function requireAuth(isRoute: Boolean = false): boolean | Response {
  if (getToken()) {
    return true;
  } else {
    if (isRoute) {
      return redirect("/login");
    }
    return false;
  }
}

export function isLoggedIn(isRoute: Boolean = false) {
  if (getToken()) {
    if (isRoute) {
      return redirect("/");
    }
    return true;
  } else {
    return false;
  }
}

export async function hasPermission(
  role: RoleTypeEnum | RoleTypeEnum[]
): Promise<boolean | Response> {
  if (!getToken()) {
    return redirect("/login");
  }
  const store = useAuthStore.getState();
  if (!store.user?.role) {
    await store.fetchMe();
  }
  const { user } = useAuthStore.getState();
  const hasPerm = Array.isArray(role)
    ? role.includes(user.role)
    : user.role === role;

  if (!hasPerm) {
    return redirect(`/?redirect=${window.location.pathname}`);
  }
  return true;
}

export function hasPermissionClient(
  role: RoleTypeEnum | RoleTypeEnum[]
): Boolean {
  if (!getToken()) {
    return false;
  }
  const { user } = useAuthStore.getState();
  const hasPerm = Array.isArray(role)
    ? role.includes(user.role)
    : user.role === role;

  return hasPerm;
}
