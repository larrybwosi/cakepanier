import Header from "@repo/ui/components/Header";
import { getUser } from "@repo/lib/dealio/auth-utils";
import { signInLogto, signOutLogto } from "@repo/lib/actions/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        signInAction={signInLogto}
        signOutAction={signOutLogto}
      />
      {children}
    </div>
  );
}
