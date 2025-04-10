import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add preconnect for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Add Google Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* PWA Meta Tags */}
        <meta name="application-name" content="Word Scramble Game" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Word Scramble" />
        <meta name="description" content="A fun word game where you create words from random letters" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#6366f1" />

        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icons/icon-32x32.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icons/icon-16x16.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/icons/icon-32x32.svg" />
      </Head>
      <body>
        {/* Script to set dark mode immediately to prevent flickering */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Check for saved preference
              var savedMode = localStorage.getItem('darkMode');

              // Default to dark mode if no preference is saved
              if (savedMode === null) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
              } else if (savedMode === 'true') {
                document.documentElement.classList.add('dark');
              }
            })();
          `
        }} />
        <Main />
        <NextScript />

        {/* PWA Service Worker Registration */}
        <script src="/sw-register.js" />
      </body>
    </Html>
  );
}
