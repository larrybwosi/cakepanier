"use server";

import { logtoConfig } from "@/lib/logto.config";
import { signIn, signOut } from "@logto/next/server-actions";

export async function signInLogto() {
  return await signIn(logtoConfig);
}
export async function signOutLogto() {
  return await signOut(logtoConfig);
}
