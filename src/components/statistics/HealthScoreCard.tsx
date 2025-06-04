
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Heart, Trophy, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HealthMetric {
  name: string;
  value: number;
  weight: number;
  optimal: number;
}

interface HealthScoreCardProps {
  metrics: HealthMetric[];
}

const HealthScoreCard = ({ metrics }: HealthScoreCardProps) => {
  const { t } = useLanguage();

  const calculateHealthScore = () => {
    let totalScore = 0;
    let totalWeight = 0;

    metrics.forEach(metric => {
      const score = Math.min(100, (metric.value / metric.optimal) * 100);
      totalScore += score * metric.weight;
      totalWeight += metric.weight;
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  };

  const healthScore = calculateHealthScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent", variant: "default" as const, icon: Trophy };
    if (score >= 80) return { text: "Great", variant: "default" as const, icon: Star };
    if (score >= 60) return { text: "Good", variant: "secondary" as const, icon: Heart };
    return { text: "Needs Work", variant: "destructive" as const, icon: Heart };
  };

  const badge = getScoreBadge(healthScore);
  const BadgeIcon = badge.icon;

  return (
    <Card className="hover-scale transition-all duration-200 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          {t('statistics.healthScore')}
        </CardTitle>
        <CardDescription>{t('statistics.overallHealthMetric')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(healthScore)} mb-2`}>
              {healthScore}
            </div>
            <Badge variant={badge.variant} className="flex items-center gap-1 w-fit mx-auto">
              <BadgeIcon className="h-3 w-3" />
              {badge.text}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {metrics.map((metric, index) => {
              const score = Math.min(100, (metric.value / metric.optimal) * 100);
              return (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{metric.name}</span>
                    <span className="font-medium">{score.toFixed(0)}%</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              );
            })}
          </div>
          
          <div className="text-xs text-muted-foreground text-center">
            {t('statistics.basedOnActivity')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthScoreCard;
