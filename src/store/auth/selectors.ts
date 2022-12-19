import { RootState } from "@/store/index";

export function isAuthSelector(state: RootState): boolean {
  return state.auth.isAdmin;
}

export function didTryAutoLoginSelector(state: RootState): boolean {
  return state.auth.didTryAutoLogin;
}

export function getToken(state: RootState): string | null {
  return state.auth.token;
}

export function getAdmin(state: RootState): object {
  return state.auth.admin;
}
