import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import StatisticsOverview from "@/components/statistics/StatisticsOverview";
import TrendAnalysisCard from "@/components/statistics/TrendAnalysisCard";
import HealthScoreCard from "@/components/statistics/HealthScoreCard";
import ComparisonChart from "@/components/statistics/ComparisonChart";
import AchievementBadges from "@/components/statistics/AchievementBadges";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStatisticsData } from "@/hooks/useStatisticsData";
import { 
  Activity,
  Droplets,
  Moon,
  Scale,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const StatisticsPage = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  const {
    trends,
    healthMetrics,
    comparisonData,
    achievements,
    weekStats,
    totalActivities,
    totalWaterIntake,
    averageSleepHours,
    currentWeight,
    weightChange
  } = useStatisticsData();

  // Prepare overview metrics
  const overviewMetrics = [
    {
      title: t('statistics.totalActivities'),
      value: totalActivities.toString(),
      subtitle: t('statistics.allTime'),
      icon: Activity,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: 12,
      achievement: totalActivities >= 50 ? "Active" : undefined
    },
    {
      title: t('statistics.waterIntake'),
      value: `${(totalWaterIntake / 1000).toFixed(1)}L`,
      subtitle: t('statistics.thisWeek'),
      icon: Droplets,
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      trend: 8
    },
    {
      title: t('statistics.avgSleep'),
      value: `${averageSleepHours.toFixed(1)}h`,
      subtitle: t('statistics.perNight'),
      icon: Moon,
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: averageSleepHours >= 7 ? 5 : -3,
      achievement: averageSleepHours >= 8 ? "Well Rested" : undefined
    },
    {
      title: t('statistics.weightChange'),
      value: `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg`,
      subtitle: t('statistics.total'),
      icon: Scale,
      color: weightChange < 0 ? "bg-gradient-to-br from-green-500 to-green-600" : "bg-gradient-to-br from-red-500 to-red-600",
      trend: weightChange < 0 ? 10 : -5
    }
  ];

  const activityTrendData = weekStats.map((day, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    steps: day.steps,
    calories: day.calories
  }));

  const sleepTrendData = weekStats.slice(-7).map((day, index) => ({
    date: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    hours: 7 + Math.random() * 2, // Mock sleep data
    quality: 3 + Math.random() * 2
  }));

  const waterTrendData = weekStats.map((day, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    amount: 1800 + Math.random() * 800
  }));

  const activityDistribution = [
    { name: t('statistics.walking'), value: 40, color: '#3b82f6' },
    { name: t('statistics.running'), value: 25, color: '#10b981' },
    { name: t('statistics.cycling'), value: 20, color: '#f59e0b' },
    { name: t('statistics.swimming'), value: 15, color: '#8b5cf6' }
  ];

  const chartConfig = {
    steps: {
      label: t('dashboard.steps'),
      color: "hsl(var(--chart-1))",
    },
    calories: {
      label: t('dashboard.calories'),
      color: "hsl(var(--chart-2))",
    },
    hours: {
      label: t('dashboard.hours'),
      color: "hsl(var(--chart-3))",
    },
    quality: {
      label: t('statistics.qualityScale'),
      color: "hsl(var(--chart-4))",
    },
    amount: {
      label: t('statistics.waterIntake'),
      color: "hsl(var(--chart-5))",
    },
    weight: {
      label: t('dashboard.weight'),
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="pb-20 px-6 max-w-4xl mx-auto animate-fade-in">
      <PageHeader 
        title={t('statistics.title')} 
        description={t('statistics.description')}
      />

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {['week', 'month', 'year'].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
            className="capitalize hover-scale"
          >
            {t(`statistics.${period}`)}
          </Button>
        ))}
      </div>

      {/* Enhanced Overview Cards */}
      <StatisticsOverview metrics={overviewMetrics} />

      {/* New Advanced Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TrendAnalysisCard trends={trends} />
        <HealthScoreCard metrics={healthMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComparisonChart 
          data={comparisonData}
          title={t('statistics.comparison')}
          description={t('statistics.vsAverage')}
        />
        <AchievementBadges achievements={achievements} />
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">{t('navigation.activity')}</TabsTrigger>
          <TabsTrigger value="water">{t('navigation.water')}</TabsTrigger>
          <TabsTrigger value="sleep">{t('navigation.sleep')}</TabsTrigger>
          <TabsTrigger value="weight">{t('navigation.weight')}</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card className="hover-scale transition-all duration-200">
            <CardHeader>
              <CardTitle>{t('statistics.weeklyActivityTrends')}</CardTitle>
              <CardDescription>{t('statistics.stepsAndCalories')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72">
                <LineChart data={activityTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="var(--color-steps)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-steps)", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="calories" 
                    stroke="var(--color-calories)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-calories)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="hover-scale transition-all duration-200">
            <CardHeader>
              <CardTitle>{t('statistics.activityDistribution')}</CardTitle>
              <CardDescription>{t('statistics.favoriteActivities')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72">
                <PieChart>
                  <Pie
                    data={activityDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {activityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <Card className="hover-scale transition-all duration-200">
            <CardHeader>
              <CardTitle>{t('statistics.waterIntakeTrends')}</CardTitle>
              <CardDescription>{t('statistics.dailyWaterConsumption')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72">
                <BarChart data={waterTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="amount" 
                    fill="var(--color-amount)" 
                    radius={[6, 6, 0, 0]} 
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <Card className="hover-scale transition-all duration-200">
            <CardHeader>
              <CardTitle>{t('statistics.sleepPatterns')}</CardTitle>
              <CardDescription>{t('statistics.sleepDurationQuality')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72">
                <LineChart data={sleepTrendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="var(--color-hours)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-hours)", strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="quality" 
                    stroke="var(--color-quality)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-quality)", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <Card className="hover-scale transition-all duration-200">
            <CardHeader>
              <CardTitle>{t('statistics.weightProgress')}</CardTitle>
              <CardDescription>{t('statistics.weightJourney')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-72">
                <LineChart data={[{date: "2024-01", weight: 75}, {date: "2024-02", weight: 74}, {date: "2024-03", weight: 73}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="var(--color-weight)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-weight)", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default StatisticsPage;
