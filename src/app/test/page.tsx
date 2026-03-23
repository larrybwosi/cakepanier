'use client';
import { useState } from 'react';

const colors = {
  surface: '#fdf9f0',
  'surface-container-low': '#f7f3ea',
  'surface-container': '#f1eee5',
  'surface-container-high': '#ece8df',
  'surface-container-highest': '#e6e2d9',
  'surface-container-lowest': '#ffffff',
  'on-surface': '#1c1c17',
  'on-surface-variant': '#554336',
  primary: '#8f4900',
  'primary-container': '#b35e04',
  'on-primary': '#ffffff',
  secondary: '#60613c',
  'secondary-container': '#e2e2b4',
  'on-secondary-container': '#646540',
  'outline-variant': '#dbc2b0',
  'inverse-surface': '#31312b',
  'inverse-on-surface': '#f4f0e7',
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body, .af-root {
    background: #fdf9f0;
    color: #1c1c17;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .af-serif { font-family: 'Noto Serif', serif; }

  .caramel-btn {
    background: radial-gradient(circle at center, #8f4900 0%, #b35e04 100%);
    color: #fff;
    border: none;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .caramel-btn:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(143,73,0,0.25); }
  .caramel-btn:active { transform: scale(0.97); }

  .ghost-btn {
    background: transparent;
    border: 1px solid rgba(219,194,176,0.4);
    color: #8f4900;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
  }
  .ghost-btn:hover { background: #f7f3ea; transform: scale(1.02); }

  .editorial-shadow { box-shadow: 0 8px 32px rgba(28,28,23,0.06); }
  .ambient-shadow { box-shadow: 0 8px 32px rgba(28,28,23,0.05), 0 2px 8px rgba(28,28,23,0.03); }

  .nav-glass {
    background: rgba(253,249,240,0.82);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 1px 0 rgba(219,194,176,0.25);
  }

  .product-card:hover .product-img { transform: scale(1.06); }

  .chip {
    border-radius: 16px 8px 16px 8px;
    background: #e2e2b4;
    color: #646540;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 4px 12px;
    display: inline-block;
  }

  .feature-icon {
    width: 48px; height: 48px; border-radius: 50%;
    background: #e2e2b4;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 1.25rem;
  }

  input[type="email"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  input[type="email"]:focus {
    outline: 2px solid rgba(96,97,60,0.4);
    outline-offset: 0;
  }

  .nav-link {
    font-family: 'Noto Serif', serif;
    font-size: 1rem;
    color: #1c1c17;
    text-decoration: none;
    transition: color 0.15s, transform 0.15s;
    cursor: pointer;
  }
  .nav-link:hover { color: #8f4900; transform: scale(1.04); }
  .nav-link.active { color: #8f4900; border-bottom: 2px solid #8f4900; padding-bottom: 2px; }

  .hero-img-main {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.6s ease;
  }
  .hero-img-wrap:hover .hero-img-main { transform: scale(1.03); }

  @media (max-width: 768px) {
    .hero-floating { display: none !important; }
    .craft-quote { display: none !important; }
  }

  .scroll-reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .scroll-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .mobile-menu {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(253,249,240,0.97);
    z-index: 200;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    backdrop-filter: blur(20px);
  }
`;

const NAV_LINKS = ['Home', 'Menu', 'Our Craft', 'Cakes', 'Find Us'];

const CRAFT_FEATURES = [
  {
    icon: '🌾',
    title: 'Local Heritage Grains',
    desc: 'We source exclusively from regional mills that prioritize soil health and flavor over yield.',
  },
  {
    icon: '🕐',
    title: '24-Hour Proofing',
    desc: 'Time develops the deep complex flavors and makes the bread more digestible and nutritious.',
  },
  {
    icon: '💧',
    title: 'Natural Starters',
    desc: 'No commercial yeast. Only our 30-year-old starter, "Mother," drives every rise.',
  },
];

export default function ArtisanalFlourish() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = e => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="af-root" style={{ minHeight: '100vh' }}>
      <style>{styles}</style>

      {/* NAV */}
      <nav
        className="nav-glass"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 1.5rem',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 68,
          }}
        >
          <a
            href="#"
            className="af-serif"
            style={{
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#8f4900',
              fontSize: '1.4rem',
              textDecoration: 'none',
              transition: 'transform 0.2s',
            }}
          >
            Artisanal Flourish
          </a>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
            {NAV_LINKS.map((l, i) => (
              <a key={l} className={`nav-link${i === 0 ? ' active' : ''}`}>
                {l}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              className="caramel-btn"
              style={{ padding: '0.6rem 1.4rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '0.95rem' }}
            >
              Order Now
            </button>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'none',
                flexDirection: 'column',
                gap: 5,
                padding: 4,
              }}
              className="hamburger"
              aria-label="Open menu"
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  style={{ display: 'block', width: 24, height: 2, background: '#1c1c17', borderRadius: 2 }}
                />
              ))}
            </button>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .hamburger { display: flex !important; }
          }
        `}</style>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <button
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#1c1c17',
            }}
          >
            ✕
          </button>
          {NAV_LINKS.map(l => (
            <a key={l} className="af-serif nav-link" style={{ fontSize: '1.8rem' }} onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
          <button className="caramel-btn" style={{ padding: '0.8rem 2rem', borderRadius: '0.75rem', fontWeight: 600 }}>
            Order Now
          </button>
        </div>
      )}

      <main>
        {/* HERO */}
        <section
          style={{
            background: '#fdf9f0',
            padding: '4rem 1.5rem 6rem',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            {/* Left */}
            <div style={{ gridColumn: 'span 12' }} className="hero-left">
              <span className="chip" style={{ marginBottom: '1.5rem' }}>
                Est. 1994
              </span>
              <h1
                className="af-serif"
                style={{
                  fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                  lineHeight: 1.08,
                  color: '#1c1c17',
                  marginBottom: '1.5rem',
                  maxWidth: 640,
                }}
              >
                Baked Daily with <em style={{ color: '#8f4900', fontStyle: 'italic' }}>Love</em> &amp; Local Grains
              </h1>
              <p
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  color: '#554336',
                  maxWidth: 480,
                  marginBottom: '2.5rem',
                }}
              >
                Every loaf tells a story of patience, 24-hour slow fermentation, and stone-milled heirloom grains from
                our neighboring farms.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="caramel-btn"
                  style={{ padding: '1rem 2rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1.05rem' }}
                >
                  Pre-order Now
                </button>
                <button
                  className="ghost-btn"
                  style={{ padding: '1rem 2rem', borderRadius: '0.75rem', fontWeight: 700, fontSize: '1.05rem' }}
                >
                  Explore Menu
                </button>
              </div>
            </div>

            {/* Right images */}
            <div style={{ gridColumn: 'span 12', position: 'relative', marginTop: '2rem' }} className="hero-right">
              <div
                className="hero-img-wrap editorial-shadow"
                style={{
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  transform: 'rotate(1.5deg)',
                  aspectRatio: '4/3',
                }}
              >
                <img
                  className="hero-img-main"
                  src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=900&q=80"
                  alt="Freshly baked sourdough"
                />
              </div>
              <div
                className="hero-floating editorial-shadow"
                style={{
                  position: 'absolute',
                  bottom: -40,
                  left: -20,
                  width: 180,
                  height: 180,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transform: 'rotate(-5deg)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534432182912-63863115e106?w=400&q=80"
                  alt="Pastries"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          <style>{`
            @media (min-width: 1024px) {
              .hero-left { grid-column: span 6 !important; }
              .hero-right { grid-column: span 6 !important; margin-top: 0 !important; }
            }
          `}</style>
        </section>

        {/* FROM THE OVEN */}
        <section style={{ background: '#f7f3ea', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '3rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2
                  className="af-serif"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: '#1c1c17', marginBottom: '0.5rem' }}
                >
                  From the Oven
                </h2>
                <p style={{ color: '#554336', fontSize: '0.95rem' }}>
                  Signature staples and seasonal favorites, pulled fresh every dawn.
                </p>
              </div>
              <a
                href="#"
                style={{
                  color: '#8f4900',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'gap 0.2s',
                }}
              >
                View Full Menu →
              </a>
            </div>

            {/* Product grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* Classic Sourdough – featured */}
              <div
                className="product-card editorial-shadow"
                style={{
                  background: '#ffffff',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  gridColumn: 'span 1',
                  cursor: 'pointer',
                }}
              >
                <div style={{ overflow: 'hidden', aspectRatio: '4/3' }}>
                  <img
                    className="product-img"
                    src="https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=700&q=80"
                    alt="Classic Sourdough"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <span className="chip" style={{ marginBottom: '0.75rem' }}>
                    Bestseller
                  </span>
                  <h3 className="af-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '0.25rem' }}>
                    Classic Sourdough
                  </h3>
                  <p style={{ color: '#554336', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Wild yeast, sea salt, and organic wheat. Crusted perfection with a tender, airy crumb.
                  </p>
                </div>
              </div>

              {/* Seasonal Berry Tart */}
              <div
                className="product-card ambient-shadow"
                style={{ background: '#ece8df', borderRadius: '1.25rem', overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ overflow: 'hidden', aspectRatio: '1/1' }}>
                  <img
                    className="product-img"
                    src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80"
                    alt="Berry Tart"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 className="af-serif" style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    Seasonal Berry Tart
                  </h4>
                  <p style={{ color: '#554336', fontSize: '0.85rem' }}>Crème pâtissière and local berries.</p>
                </div>
              </div>

              {/* Cinnamon Roll */}
              <div
                className="product-card ambient-shadow"
                style={{ background: '#f1eee5', borderRadius: '1.25rem', overflow: 'hidden', cursor: 'pointer' }}
              >
                <div style={{ overflow: 'hidden', aspectRatio: '1/1' }}>
                  <img
                    className="product-img"
                    src="https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80"
                    alt="Cinnamon Roll"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 className="af-serif" style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>
                    Spiced Cinnamon Roll
                  </h4>
                  <p style={{ color: '#554336', fontSize: '0.85rem' }}>Brioche dough, ceylon cinnamon, honey glaze.</p>
                </div>
              </div>

              {/* Baker's Whim */}
              <div
                style={{
                  background: 'radial-gradient(circle at top left, #8f4900, #b35e04)',
                  borderRadius: '1.25rem',
                  padding: '2rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  gridColumn: 'span 1',
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 className="af-serif" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                    Baker's Whim
                  </h4>
                  <p style={{ opacity: 0.88, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    Every Tuesday we experiment with ancient grains. Ask us what's proofing today.
                  </p>
                  <button
                    style={{
                      background: '#fff',
                      color: '#8f4900',
                      border: 'none',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '0.5rem',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    Pre-order Special
                  </button>
                </div>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.5rem',
                    flexShrink: 0,
                  }}
                >
                  🥐
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE CRAFT */}
        <section style={{ background: '#f7f3ea', padding: '5rem 1.5rem 6rem' }}>
          <div
            style={{
              maxWidth: 1280,
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '4rem',
              alignItems: 'center',
            }}
            className="craft-grid"
          >
            {/* Image */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1607478900766-efe13248b125?w=900&q=80"
                alt="Baker kneading dough"
                style={{ width: '100%', borderRadius: '1.5rem', display: 'block' }}
                className="editorial-shadow"
              />
              <div
                className="craft-quote editorial-shadow"
                style={{
                  position: 'absolute',
                  top: -32,
                  right: -24,
                  background: '#fff',
                  borderRadius: '1.25rem',
                  padding: '1.25rem 1.5rem',
                  maxWidth: 200,
                  zIndex: 10,
                }}
              >
                <p
                  className="af-serif"
                  style={{
                    fontStyle: 'italic',
                    color: '#8f4900',
                    fontSize: '1rem',
                    marginBottom: '0.5rem',
                    lineHeight: 1.4,
                  }}
                >
                  "Patience is our main ingredient."
                </p>
                <p
                  style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}
                >
                  Master Baker
                </p>
              </div>
            </div>

            {/* Text */}
            <div>
              <h2
                className="af-serif"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '2.5rem', lineHeight: 1.15 }}
              >
                The Art of Slow Fermentation
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {CRAFT_FEATURES.map(({ icon, title, desc }) => (
                  <div key={title} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div className="feature-icon">
                      <span style={{ fontSize: '1.3rem' }}>{icon}</span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.4rem' }}>{title}</h4>
                      <p style={{ color: '#554336', lineHeight: 1.65, fontSize: '0.95rem' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @media (min-width: 1024px) {
              .craft-grid { grid-template-columns: 1fr 1fr !important; }
            }
          `}</style>
        </section>

        {/* NEWSLETTER */}
        <section style={{ background: '#fdf9f0', padding: '3rem 1.5rem 5rem' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div
              style={{
                background: '#31312b',
                borderRadius: '1.75rem',
                padding: 'clamp(2.5rem, 6vw, 5rem) 2rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative blobs */}
              <div
                style={{
                  position: 'absolute',
                  top: -80,
                  left: -80,
                  width: 240,
                  height: 240,
                  background: 'rgba(143,73,0,0.18)',
                  borderRadius: '50%',
                  filter: 'blur(50px)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -80,
                  right: -80,
                  width: 240,
                  height: 240,
                  background: 'rgba(96,97,60,0.18)',
                  borderRadius: '50%',
                  filter: 'blur(50px)',
                }}
              />

              <div style={{ position: 'relative', zIndex: 2 }}>
                <h2
                  className="af-serif"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: '#f4f0e7',
                    marginBottom: '1rem',
                    lineHeight: 1.1,
                  }}
                >
                  Stay in the Flour Loop
                </h2>
                <p
                  style={{
                    color: 'rgba(244,240,231,0.75)',
                    maxWidth: 520,
                    margin: '0 auto 2.5rem',
                    fontSize: '1.05rem',
                    lineHeight: 1.65,
                  }}
                >
                  Get notified when we pull the morning's first loaves or announce our weekend seasonal specialties.
                </p>

                {subscribed ? (
                  <div
                    style={{
                      background: 'rgba(226,226,180,0.15)',
                      border: '1px solid rgba(226,226,180,0.3)',
                      borderRadius: '0.75rem',
                      padding: '1rem 2rem',
                      color: '#e2e2b4',
                      fontWeight: 600,
                      display: 'inline-block',
                    }}
                  >
                    🥖 You're on the list! See you at dawn.
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubscribe}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      maxWidth: 440,
                      margin: '0 auto',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    }}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      style={{
                        flex: '1 1 200px',
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '0.75rem',
                        padding: '0.9rem 1.25rem',
                        color: '#f4f0e7',
                        fontSize: '0.95rem',
                        minWidth: 0,
                      }}
                    />
                    <button
                      type="submit"
                      className="caramel-btn"
                      style={{
                        padding: '0.9rem 1.75rem',
                        borderRadius: '0.75rem',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        flexShrink: 0,
                      }}
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ background: '#f1eee5', padding: '4rem 1.5rem 2rem' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          <div>
            <span
              className="af-serif"
              style={{ fontSize: '1.2rem', color: '#1c1c17', display: 'block', marginBottom: '0.75rem' }}
            >
              Artisanal Flourish
            </span>
            <p style={{ fontSize: '0.88rem', color: '#8f4900', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Hand-kneading traditions into every crust since 1994.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['📸', '📘'].map((icon, i) => (
                <span
                  key={i}
                  style={{ cursor: 'pointer', fontSize: '1.2rem', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.target.style.transform = 'scale(1.2)')}
                  onMouseLeave={e => (e.target.style.transform = 'scale(1)')}
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span
              style={{ fontWeight: 700, color: '#1c1c17', display: 'block', marginBottom: '1rem', fontSize: '0.95rem' }}
            >
              Explore
            </span>
            {['Instagram', 'Facebook', 'Newsletter', 'Privacy Policy'].map(l => (
              <a
                key={l}
                href="#"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: '#8f4900',
                  opacity: 0.7,
                  marginBottom: '0.6rem',
                  textDecoration: 'none',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => (e.target.style.opacity = '1')}
                onMouseLeave={e => (e.target.style.opacity = '0.7')}
              >
                {l}
              </a>
            ))}
          </div>

          <div>
            <span
              style={{ fontWeight: 700, color: '#1c1c17', display: 'block', marginBottom: '1rem', fontSize: '0.95rem' }}
            >
              Visit Us
            </span>
            <p style={{ fontSize: '0.875rem', color: '#8f4900', opacity: 0.7, lineHeight: 1.8 }}>
              123 Sourdough Lane
              <br />
              Grain District, NY 10012
              <br />
              Mon – Sun: 7am – 3pm
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(219,194,176,0.25)',
            paddingTop: '1.5rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#8f4900', opacity: 0.6 }}>
            © 2024 Artisanal Flourish Bakery. Hand-kneaded with love.
          </p>
        </div>
      </footer>
    </div>
  );
}
