import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function NewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#fdf9f0]">
      <NuqsAdapter>{children}</NuqsAdapter>
    </div>
  );
}
