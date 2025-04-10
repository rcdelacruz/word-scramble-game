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
      </body>
    </Html>
  );
}
