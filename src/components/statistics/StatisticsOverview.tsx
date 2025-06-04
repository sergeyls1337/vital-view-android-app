
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Moon, Scale, Calendar, Target, Trophy } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OverviewMetric {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  trend: number;
  achievement?: string;
}

interface StatisticsOverviewProps {
  metrics: OverviewMetric[];
}

const StatisticsOverview = ({ metrics }: StatisticsOverviewProps) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover-scale transition-all duration-200 relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.color} shadow-sm`}>
                <metric.icon className="h-5 w-5 text-white" />
              </div>
              {metric.achievement && (
                <Badge variant="outline" className="text-xs">
                  <Trophy className="h-3 w-3 mr-1" />
                  {metric.achievement}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {metric.value}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                {metric.trend !== 0 && (
                  <Badge variant={metric.trend > 0 ? "default" : "destructive"} className="text-xs">
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsOverview;
