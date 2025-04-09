import '../styles/globals.css';
import Layout from '../components/Layout';
import { ToastProvider } from '../components/ToastProvider';

function MyApp({ Component, pageProps }) {
  // Check if the Component has a getLayout function
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <ToastProvider>
      {getLayout(<Component {...pageProps} />)}
    </ToastProvider>
  );
}

export default MyApp;
