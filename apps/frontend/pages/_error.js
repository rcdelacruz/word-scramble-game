import Link from 'next/link';

function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </h1>
      <p className="text-lg mb-6">
        We apologize for the inconvenience. Please try again later.
      </p>
      <Link href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
        Go back home
      </Link>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
