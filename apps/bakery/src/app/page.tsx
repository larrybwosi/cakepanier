import Header from "@repo/ui/components/Header";
import Hero from "@repo/ui/components/Hero";
import About from "@repo/ui/components/About";
import Footer from "@repo/ui/components/Footer";
import { signInLogto, signOutLogto } from "@repo/lib/actions/auth";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header signInAction={signInLogto} signOutAction={signOutLogto} />
      <Hero />
      <About />
      <Footer />
    </main>
  );
}
