
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  className?: string;
  unit?: string;
  progress?: number;
}

const HealthMetricCard = ({
  title,
  value,
  icon,
  color = "bg-health-blue",
  className,
  unit,
  progress,
}: HealthMetricCardProps) => {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="p-4 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline mt-1">
            <h3 className="text-2xl font-bold">{value}</h3>
            {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={cn("rounded-full p-2", color)}>{icon}</div>
      </div>
      {progress !== undefined && (
        <div className="w-full h-1.5 bg-gray-100">
          <div 
            className={cn("h-full", color)} 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </Card>
  );
};

export default HealthMetricCard;
