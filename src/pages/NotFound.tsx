
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-health-blue to-health-teal p-6">
      <div className="text-center bg-white rounded-xl p-8 shadow-lg max-w-md">
        <h1 className="text-4xl font-bold mb-4 text-health-blue">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Button 
          className="bg-health-blue hover:bg-health-teal"
          onClick={() => window.location.href = "/"}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
