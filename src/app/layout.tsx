import type { Metadata } from 'next';
import './globals.css';
import { GlobalScroll } from '@/Providers/GlobalScrollProvider';
import { MosaicBackgroundProvider } from '@/Providers/MosaicBackgroundProvider';
import Navbar from '@/components/Navbar';
import { TooltipProvider } from '@/core/Tooltip';
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
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
