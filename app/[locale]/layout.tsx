import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Playfair_Display, Noto_Sans_Thai } from 'next/font/google';
import { routing } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-ui',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const notoThai = Noto_Sans_Thai({
  subsets: ['thai'],
  variable: '--font-thai',
  weight: ['300', '400', '500'],
  display: 'swap',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = (messages as Record<string, Record<string, string>>).meta ?? {};

  const baseUrl = 'https://huuman.studio';
  const localeUrls: Record<string, string> = {
    en: `${baseUrl}/en`,
    th: `${baseUrl}/th`,
    sv: `${baseUrl}/sv`,
  };

  return {
    title: meta.title ?? 'HUUMAN STUDIO',
    description: meta.description ?? 'Premium Creative Technology Studio',
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: meta.ogTitle ?? 'HUUMAN STUDIO',
      description: meta.ogDescription ?? 'We build digital systems that move businesses forward.',
      url: localeUrls[locale] ?? baseUrl,
      siteName: 'HUUMAN STUDIO',
      type: 'website',
      locale: locale === 'th' ? 'th_TH' : locale === 'sv' ? 'sv_SE' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle ?? 'HUUMAN STUDIO',
      description: meta.ogDescription ?? 'We build digital systems that move businesses forward.',
    },
    alternates: {
      canonical: localeUrls[locale],
      languages: {
        'en': `${baseUrl}/en`,
        'th': `${baseUrl}/th`,
        'sv': `${baseUrl}/sv`,
        'x-default': `${baseUrl}/en`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'th' | 'sv')) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${notoThai.variable}`}>
      <head>
        <meta name="theme-color" content="#060914" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-[#060914] text-[#F0EDE8] antialiased overflow-x-hidden font-ui">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
