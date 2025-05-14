
import { Home, Activity, Droplets, Moon, LineChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/activity", icon: Activity, label: "Activity" },
    { path: "/water", icon: Droplets, label: "Water" },
    { path: "/sleep", icon: Moon, label: "Sleep" },
    { path: "/weight", icon: LineChart, label: "Weight" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-100 h-16 flex justify-around items-center px-2 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-1/5 ${
              isActive ? "text-health-blue" : "text-gray-500"
            }`}
          >
            <div className="relative">
              <Icon size={24} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-health-blue rounded-full" />
              )}
            </div>
            <span className="text-xs mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
