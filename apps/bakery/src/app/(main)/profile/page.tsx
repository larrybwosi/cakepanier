import Profile from "./Profile";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@repo/lib/logto.config";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  if (!isAuthenticated) {
    redirect("/");
  }

  return <Profile initialUser={claims} />;
}
