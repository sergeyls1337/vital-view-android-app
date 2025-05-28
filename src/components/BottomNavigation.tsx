
import { Home, Activity, Droplets, Moon, LineChart, BarChart3 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const BottomNavigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  const navItems = [
    { path: "/", icon: Home, label: t('navigation.home') },
    { path: "/activity", icon: Activity, label: t('navigation.activity') },
    { path: "/water", icon: Droplets, label: t('navigation.water') },
    { path: "/sleep", icon: Moon, label: t('navigation.sleep') },
    { path: "/weight", icon: LineChart, label: t('navigation.weight') },
    { path: "/statistics", icon: BarChart3, label: "Stats" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background shadow-lg border-t border-border h-16 flex justify-around items-center px-1 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive ? "text-health-blue" : "text-muted-foreground"
            }`}
          >
            <div className="relative">
              <Icon size={20} />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-health-blue rounded-full" />
              )}
            </div>
            <span className="text-xs mt-0.5 text-center">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNavigation;
