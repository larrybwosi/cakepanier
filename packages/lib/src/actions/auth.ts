"use server";

import { logtoConfig } from "@repo/lib/logto.config";
import { signIn, signOut } from "@logto/next/server-actions";

export async function signInLogto() {
  return await signIn(logtoConfig);
}
export async function signOutLogto() {
  return await signOut(logtoConfig);
}
