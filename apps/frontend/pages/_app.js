import '../styles/globals.css';
import Layout from '../components/Layout';
import { ToastProvider } from '../components/ToastProvider';
import { useEffect } from 'react';
import { loadDictionary } from '../utils/pwaLocalDictionary';

function MyApp({ Component, pageProps }) {
  // Check if the Component has a getLayout function
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  // Initialize PWA features and load dictionary when app starts
  useEffect(() => {
    // Load the dictionary in the background when the app starts
    if (typeof window !== 'undefined') {
      // Preload the dictionary for offline use
      loadDictionary().catch(error => {
        console.error('Error preloading dictionary:', error);
      });
    }
  }, []);

  return (
    <ToastProvider>
      {getLayout(<Component {...pageProps} />)}
    </ToastProvider>
  );
}

export default MyApp;
