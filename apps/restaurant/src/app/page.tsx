import Header from "@repo/ui/components/Header";
import Hero from "@repo/ui/components/Hero";
import About from "@repo/ui/components/About";
import Footer from "@repo/ui/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Footer />
    </main>
  );
}
