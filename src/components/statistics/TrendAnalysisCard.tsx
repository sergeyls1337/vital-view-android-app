
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrendData {
  metric: string;
  current: number;
  previous: number;
  unit: string;
  target?: number;
}

interface TrendAnalysisCardProps {
  trends: TrendData[];
}

const TrendAnalysisCard = ({ trends }: TrendAnalysisCardProps) => {
  const { t } = useLanguage();

  const getTrendIcon = (current: number, previous: number, target?: number) => {
    const change = current - previous;
    const percentChange = previous > 0 ? (change / previous) * 100 : 0;
    
    if (Math.abs(percentChange) < 1) return <Minus className="h-4 w-4 text-gray-500" />;
    if (target) {
      const distanceToCurrent = Math.abs(current - target);
      const distanceToPrevious = Math.abs(previous - target);
      return distanceToCurrent < distanceToPrevious ? 
        <TrendingUp className="h-4 w-4 text-green-500" /> : 
        <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return change > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getTrendBadge = (current: number, previous: number, target?: number) => {
    const change = current - previous;
    const percentChange = previous > 0 ? Math.abs((change / previous) * 100) : 0;
    
    if (percentChange < 1) return { text: "Stable", variant: "secondary" as const };
    
    if (target) {
      const distanceToCurrent = Math.abs(current - target);
      const distanceToPrevious = Math.abs(previous - target);
      return distanceToCurrent < distanceToPrevious ? 
        { text: "Improving", variant: "default" as const } : 
        { text: "Declining", variant: "destructive" as const };
    }
    
    return change > 0 ? 
      { text: "Increasing", variant: "default" as const } : 
      { text: "Decreasing", variant: "destructive" as const };
  };

  return (
    <Card className="hover-scale transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          {t('statistics.trendAnalysis')}
        </CardTitle>
        <CardDescription>{t('statistics.weeklyComparison')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trends.map((trend, index) => {
            const badge = getTrendBadge(trend.current, trend.previous, trend.target);
            const change = trend.current - trend.previous;
            const percentChange = trend.previous > 0 ? (change / trend.previous) * 100 : 0;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  {getTrendIcon(trend.current, trend.previous, trend.target)}
                  <div>
                    <p className="font-medium">{trend.metric}</p>
                    <p className="text-sm text-muted-foreground">
                      {trend.current.toFixed(1)}{trend.unit} 
                      {trend.target && (
                        <span className="ml-2 text-xs">
                          (Target: {trend.target}{trend.unit})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={badge.variant} className="mb-1">
                    {badge.text}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    {change > 0 ? '+' : ''}{change.toFixed(1)}{trend.unit} 
                    ({percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysisCard;
