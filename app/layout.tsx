// Root layout — the actual layout is in app/[locale]/layout.tsx
// This file is required by Next.js but all real layout logic lives
// in the locale-specific layout to support next-intl routing.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
