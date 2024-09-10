import type { Metadata } from 'next';
import './globals.css';
import { GlobalScroll } from '@/Providers/GlobalScrollProvider';
import { MosaicBackgroundProvider } from '@/Providers/MosaicBackgroundProvider';
import Navbar from '@/components/Navbar';
import { TooltipProvider } from '@/core/Tooltip';

export const metadata: Metadata = {
  title: 'Eyens portfolio',
  description: 'A personal portfolio website',
  openGraph: {
    images: [
      {
        url: '/preview.png',
        width: 1353,
        height: 657,
        alt: 'preview',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='light'>
      <body className='overflow-x-hidden '>
        <GlobalScroll>
          <TooltipProvider delayDuration={100}>
            <MosaicBackgroundProvider>
              <Navbar />
              {children}
            </MosaicBackgroundProvider>
          </TooltipProvider>
        </GlobalScroll>
      </body>
    </html>
  );
}
