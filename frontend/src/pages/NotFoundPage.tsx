import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link 
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-brand-400 to-purple-400 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-brand-400/25 transition-all duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 