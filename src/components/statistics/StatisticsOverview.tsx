
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Droplets, Moon, Scale, Calendar, Target, Trophy, TrendingUp, TrendingDown } from "lucide-react";
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

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (trend < 0) return "text-red-600 bg-red-50 border-red-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover-scale transition-all duration-300 relative overflow-hidden group hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${metric.color} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                <metric.icon className="h-5 w-5 text-white" />
              </div>
              {metric.achievement && (
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse">
                  <Trophy className="h-3 w-3 mr-1" />
                  {metric.achievement}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {metric.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 group-hover:scale-105">
                {metric.value}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex-1">{metric.subtitle}</p>
                {metric.trend !== 0 && (
                  <Badge className={`text-xs flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                    {getTrendIcon(metric.trend)}
                    {metric.trend > 0 ? '+' : ''}{metric.trend}%
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Gradient overlay for hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticsOverview;
