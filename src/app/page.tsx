import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { getLogtoContext, getOrganizationToken } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto.config";

const Page = async () => {
  // Fetch the Logto authentication context on the server
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  // If the user is authenticated, we pass their claims (which includes name/username)
  const user = isAuthenticated ? claims : null;
  // console.log("User claims:", user); // Log the user claims for debugging

  return (
    <div className="min-h-screen">
      {/* Pass the user object to the Header */}
      <Header user={user} />
      <main>
        <Hero />
        <Products />
        <About />
        <Contact />
      </main>
    </div>
  );
};

export default Page;
