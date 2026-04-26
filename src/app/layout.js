import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata = {
  title: 'ElectIQ — Your AI-Powered Election Guide',
  description: 'ElectIQ helps citizens understand the election process, check voter eligibility, register to vote, and find polling stations — powered by Google Gemini AI.',
  keywords: 'election guide, voter registration, how to vote, polling station, India election, voter ID, eligibility checker',
  openGraph: {
    title: 'ElectIQ — Your AI-Powered Election Guide',
    description: 'Personalized election guidance powered by AI. Know your rights, register to vote, find your booth.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a1a" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
      </head>
      <body>
        <div className="mesh-bg">
          <div className="mesh-orb mesh-orb-1" />
        </div>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
