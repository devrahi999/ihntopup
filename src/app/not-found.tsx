import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4">
            <img 
              src="/logo/logo.png" 
              alt="IHN TOPUP Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
