// page.tsx
import CartClient from "@repo/ui/components/CardClient";
import { logtoConfig } from "@repo/lib/logto.config";
import { getLogtoContext } from "@logto/next/server-actions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shopping Cart | Dealio",
    description: "Review your items and proceed to checkout.",
};

export default async function CartPage() {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
    const user = isAuthenticated ? claims : null;
    return <CartClient user={user} />;
}
