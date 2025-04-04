import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app.css";

import './globals.css';

// 1. Import Amplify UI styles
import '@aws-amplify/ui-react/styles.css';

// 2. Import the configuration component
import ConfigureAmplifyClientSide from '@/app/components/ConfigureAmplifyClientSide'; // Adjust path if needed

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Stocks App',
  description: 'Authenticated Stock Tracking',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 3. Render the configuration component */}
        <ConfigureAmplifyClientSide />
        {children}
      </body>
    </html>
  );
}
