"use server";

import { logtoConfig } from "@/lib/logto.config";
import { signIn } from "@logto/next/server-actions";

export async function signInLogto() {
  return await signIn(logtoConfig);
}

// export async function signOut() {
//   "use server";

//   const signOutUrl = `${logtoConfig.endpoint}/api/sign-out?appId=${logtoConfig.appId}`;
//   return signOutUrl;
// }
