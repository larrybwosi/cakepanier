'use client';

import { usePathname } from 'next/navigation';

export function FooterHider() {
  const pathname = usePathname();

  // Logical paths for (new) group
  const isNewRoute = [
    '/home',
    '/menu',
    '/our-craft',
    '/cakes',
    '/findus',
    '/box'
  ].some(path => pathname === path) || pathname.startsWith('/product/');

  if (!isNewRoute) return null;

  return (
    <style jsx global>{`
      /* Hide the global footer which is a direct child of body */
      body > footer {
        display: none !important;
      }
    `}</style>
  );
}
