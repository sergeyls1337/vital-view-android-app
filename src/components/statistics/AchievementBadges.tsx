
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Award, Zap, Crown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  earned: boolean;
  progress?: number;
  requirement?: string;
}

interface AchievementBadgesProps {
  achievements: Achievement[];
}

const AchievementBadges = ({ achievements }: AchievementBadgesProps) => {
  const { t } = useLanguage();

  const earnedAchievements = achievements.filter(a => a.earned);
  const progressAchievements = achievements.filter(a => !a.earned && a.progress);

  return (
    <Card className="hover-scale transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {t('statistics.achievements')}
        </CardTitle>
        <CardDescription>
          {earnedAchievements.length} {t('statistics.of')} {achievements.length} {t('statistics.earned')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {earnedAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-green-600 dark:text-green-400">
                🎉 {t('statistics.recentAchievements')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {earnedAchievements.slice(0, 6).map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className="flex flex-col items-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950 rounded-lg border border-yellow-200 dark:border-yellow-800"
                    >
                      <div className={`p-2 rounded-full ${achievement.color} mb-2`}>
                        <IconComponent className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-xs font-medium text-center">{achievement.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {progressAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-blue-600 dark:text-blue-400">
                🎯 {t('statistics.inProgress')}
              </h4>
              <div className="space-y-2">
                {progressAchievements.slice(0, 3).map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className={`p-1.5 rounded ${achievement.color} opacity-60`}>
                        <IconComponent className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{achievement.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {achievement.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
