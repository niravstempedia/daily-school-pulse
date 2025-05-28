
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <img 
            src="https://thestempedia.com/wp-content/uploads/2023/06/STEMpedia-Main-Logo.png" 
            alt="STEMpedia Logo" 
            className="h-40 mx-auto mb-8 object-contain"
          />
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
          <a href="/" className="text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </a>
        </div>
      </div>
      
      <footer className="text-center py-4">
        <p className="text-sm text-gray-600">
          © 2024 STEMpedia. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default NotFound;
