
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface SleepQualitySelectorProps {
  value: number;
  onChange: (quality: number) => void;
}

const SleepQualitySelector = ({ value, onChange }: SleepQualitySelectorProps) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const qualityLabels = [
    '', 'Terrible', 'Poor', 'Bad', 'Fair', 'Average', 
    'Good', 'Great', 'Excellent', 'Perfect', 'Amazing'
  ];

  const getStarColor = (starIndex: number) => {
    const activeValue = hoveredStar !== null ? hoveredStar : value;
    if (starIndex <= activeValue) {
      if (activeValue <= 3) return "text-red-400";
      if (activeValue <= 5) return "text-orange-400";
      if (activeValue <= 7) return "text-yellow-400";
      return "text-purple-400";
    }
    return "text-gray-300";
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-1 h-auto hover:bg-transparent"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`h-6 w-6 transition-all duration-200 transform hover:scale-110 ${getStarColor(star)}`}
              fill={star <= (hoveredStar !== null ? hoveredStar : value) ? "currentColor" : "none"}
            />
          </Button>
        ))}
      </div>
      
      <div className="text-center">
        <span className="text-lg font-semibold text-purple-600">
          {value}/10
        </span>
        {qualityLabels[value] && (
          <p className="text-sm text-gray-600 mt-1">
            {qualityLabels[value]}
          </p>
        )}
      </div>
    </div>
  );
};

export default SleepQualitySelector;
