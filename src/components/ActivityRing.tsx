
import { useState, useEffect } from "react";

interface ActivityRingProps {
  size?: number;
  progress: number;
  strokeWidth?: number;
  color?: string;
  label: string;
  value: string;
}

const ActivityRing = ({
  size = 100,
  progress = 0,
  strokeWidth = 8,
  color = "#3b82f6",
  label,
  value,
}: ActivityRingProps) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (displayProgress / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background Ring */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="#e5e5e5"
            fill="none"
          />
          
          {/* Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-medium text-gray-500">{label}</span>
          <span className="text-xl font-bold">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityRing;
