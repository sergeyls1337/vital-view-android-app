
import { Home, Activity, Droplets, Moon, LineChart, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: "/", icon: Home, label: t('navigation.home'), color: "text-blue-500" },
    { path: "/activity", icon: Activity, label: t('navigation.activity'), color: "text-green-500" },
    { path: "/water", icon: Droplets, label: t('navigation.water'), color: "text-cyan-500" },
    { path: "/sleep", icon: Moon, label: t('navigation.sleep'), color: "text-purple-500" },
    { path: "/weight", icon: LineChart, label: t('navigation.weight'), color: "text-orange-500" },
    { path: "/statistics", icon: BarChart3, label: "Stats", color: "text-pink-500" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg shadow-2xl border-t border-border h-16 flex justify-around items-center px-1 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 transition-all duration-300 py-2 px-1 rounded-xl mx-0.5 group relative ${
              isActive 
                ? `${item.color} bg-gradient-to-br from-current/10 to-current/5 scale-110 shadow-lg` 
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
            }`}
          >
            <div className="relative">
              <Icon 
                size={20} 
                className={`transition-all duration-300 ${
                  isActive ? "scale-110 drop-shadow-sm" : "group-hover:scale-110"
                }`} 
              />
              {isActive && (
                <>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-current/20 animate-pulse scale-150" />
                </>
              )}
            </div>
            <span className={`text-xs mt-0.5 text-center transition-all duration-300 ${
              isActive ? "font-bold" : "font-medium"
            }`}>
              {item.label}
            </span>
            
            {/* Ripple effect for active item */}
            {isActive && (
              <div className="absolute inset-0 rounded-xl bg-current/5 animate-pulse" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
