"use client";

import { useEffect, useState } from "react";
import { Home, ArrowLeft, Phone, Mail } from "lucide-react";

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Josefin+Sans:wght@200;300;400&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-sans-custom { font-family: 'Josefin Sans', sans-serif; }

        .grain::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 100;
          opacity: 0.4;
        }

        .divider-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, #92400e, transparent);
          margin: 0 auto;
        }

        .number-404 {
          font-size: clamp(7rem, 18vw, 16rem);
          line-height: 0.9;
          letter-spacing: -0.04em;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }

        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.25s; }
        .delay-3 { transition-delay: 0.4s; }
        .delay-4 { transition-delay: 0.55s; }
        .delay-5 { transition-delay: 0.7s; }

        .btn-primary {
          position: relative;
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #92400e;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary span { position: relative; z-index: 1; }

        .wheat-bg {
          background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(180,83,9,0.08) 0%, transparent 100%);
        }

        .border-thin { border-width: 0.5px; }
      `}</style>

      <div
        className="grain min-h-screen bg-stone-50 wheat-bg flex flex-col"
        style={{
          backgroundPosition: `${mousePos.x * 5}px ${mousePos.y * 5}px`,
        }}
      >
        {/* Header Bar */}
        <header className="w-full px-8 py-6 flex items-center justify-between border-b border-thin border-stone-200">
          <a
            href="/"
            className="font-display text-xl text-stone-800 tracking-wide italic"
          >
            La Maison
          </a>
          <nav className="hidden sm:flex items-center gap-8">
            {["Menu", "About", "Catering", "Contact"].map((item) => (
              <a
                key={item}
                href={`/${item.toLowerCase()}`}
                className="font-sans-custom text-xs tracking-[0.2em] uppercase text-stone-400 hover:text-amber-800 transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-3xl w-full text-center">
            {/* Overline */}
            <div className={`fade-up ${isVisible ? "visible" : ""} mb-6`}>
              <span className="font-sans-custom text-xs tracking-[0.35em] uppercase text-amber-700">
                Page Not Found
              </span>
            </div>

            {/* 404 Number */}
            <div
              className={`fade-up delay-1 ${isVisible ? "visible" : ""} mb-2`}
            >
              <h1
                className="number-404 font-display font-light text-stone-100 select-none"
                style={{
                  WebkitTextStroke: "1px rgba(146, 64, 14, 0.15)",
                  color: "transparent",
                }}
              >
                404
              </h1>
            </div>

            {/* Divider */}
            <div
              className={`fade-up delay-2 ${isVisible ? "visible" : ""} my-8`}
            >
              <div className="divider-line" />
            </div>

            {/* Headline */}
            <div
              className={`fade-up delay-2 ${isVisible ? "visible" : ""} mb-4`}
            >
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-stone-800 leading-tight">
                This page has left
                <br />
                <em className="text-amber-800">the kitchen</em>
              </h2>
            </div>

            {/* Body Copy */}
            <div
              className={`fade-up delay-3 ${isVisible ? "visible" : ""} mb-10`}
            >
              <p className="font-sans-custom font-light text-sm sm:text-base text-stone-500 leading-relaxed max-w-md mx-auto tracking-wide">
                The page you were looking for may have moved, been renamed, or
                is temporarily unavailable. Let us guide you back to where you
                need to be.
              </p>
            </div>

            {/* Action Buttons */}
            <div
              className={`fade-up delay-4 ${isVisible ? "visible" : ""} flex flex-col sm:flex-row items-center justify-center gap-4 mb-16`}
            >
              <a
                href="/"
                className="btn-primary inline-flex items-center justify-center gap-3 px-10 py-4 bg-stone-800 text-stone-50 font-sans-custom text-xs tracking-[0.2em] uppercase w-full sm:w-auto"
              >
                <span className="flex items-center gap-3">
                  <Home className="w-3.5 h-3.5" />
                  Return Home
                </span>
              </a>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-transparent text-stone-600 font-sans-custom text-xs tracking-[0.2em] uppercase border border-thin border-stone-300 hover:border-amber-700 hover:text-amber-800 transition-colors duration-300 w-full sm:w-auto"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Go Back
              </button>
            </div>

            {/* Quick Links */}
            <div className={`fade-up delay-5 ${isVisible ? "visible" : ""}`}>
              <div className="border-t border-thin border-stone-200 pt-10">
                <p className="font-sans-custom text-xs tracking-[0.25em] uppercase text-stone-400 mb-6">
                  You may be looking for
                </p>
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-3">
                  {[
                    { label: "Our Menu", href: "/menu" },
                    { label: "Custom Orders", href: "/custom-orders" },
                    { label: "Catering Services", href: "/catering" },
                    { label: "Gift Cards", href: "/gift-cards" },
                    { label: "Locations", href: "/locations" },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="font-sans-custom text-xs tracking-[0.15em] uppercase text-stone-500 hover:text-amber-800 transition-colors duration-200 border-b border-transparent hover:border-amber-800 pb-0.5"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Strip */}
        <footer className="w-full px-8 py-5 border-t border-thin border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans-custom text-xs text-stone-400 tracking-widest uppercase">
            Need assistance?
          </p>
          <div className="flex items-center gap-8">
            <a
              href="tel:+1-800-000-0000"
              className="flex items-center gap-2 font-sans-custom text-xs text-stone-400 hover:text-amber-800 transition-colors duration-200 tracking-wide"
            >
              <Phone className="w-3 h-3" />
              +1 (800) 000-0000
            </a>
            <a
              href="mailto:hello@lamaison.com"
              className="flex items-center gap-2 font-sans-custom text-xs text-stone-400 hover:text-amber-800 transition-colors duration-200 tracking-wide"
            >
              <Mail className="w-3 h-3" />
              hello@lamaison.com
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default NotFound;
