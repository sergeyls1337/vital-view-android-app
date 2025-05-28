
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActivityData } from "@/hooks/useActivityData";
import { useWaterData } from "@/hooks/useWaterData";
import { useSleepData } from "@/hooks/useSleepData";
import { useWeightData } from "@/hooks/useWeightData";
import { 
  CalendarDays, 
  Clock, 
  TrendingUp, 
  Award,
  Activity,
  Droplets,
  Moon,
  Scale
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const StatisticsPage = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
  const { activities, getCurrentWeekStats } = useActivityData();
  const waterData = useWaterData();
  const { sleepEntries } = useSleepData();
  const { weightEntries, getCurrentWeight } = useWeightData();

  const weekStats = getCurrentWeekStats();

  // Calculate overall statistics
  const totalActivities = activities.length;
  const totalWaterIntake = waterData.weeklyData.reduce((sum, day) => sum + day.amount, 0);
  const averageSleepHours = sleepEntries.length > 0 
    ? sleepEntries.reduce((sum, entry) => sum + entry.hours, 0) / sleepEntries.length 
    : 0;
  const currentWeight = getCurrentWeight();
  const initialWeight = weightEntries.length > 0 ? weightEntries[0].weight : currentWeight;
  const weightChange = currentWeight - initialWeight;

  // Prepare data for charts
  const activityTrendData = weekStats.map((day, index) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index],
    steps: day.steps,
    calories: day.calories
  }));

  const sleepTrendData = sleepEntries.slice(-7).map(entry => ({
    date: entry.date,
    hours: entry.hours,
    quality: entry.quality
  }));

  const waterTrendData = waterData.weeklyData.map(day => ({
    day: day.day,
    amount: day.amount
  }));

  const activityDistribution = [
    { name: t('statistics.walking'), value: 40, color: '#3b82f6' },
    { name: t('statistics.running'), value: 25, color: '#10b981' },
    { name: t('statistics.cycling'), value: 20, color: '#f59e0b' },
    { name: t('statistics.swimming'), value: 15, color: '#8b5cf6' }
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-20 px-6 max-w-4xl mx-auto">
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
            className="capitalize"
          >
            {t(`statistics.${period}`)}
          </Button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t('statistics.totalActivities')}
          value={totalActivities}
          subtitle={t('statistics.allTime')}
          icon={Activity}
          color="bg-blue-500"
        />
        <StatCard
          title={t('statistics.waterIntake')}
          value={`${(totalWaterIntake / 1000).toFixed(1)}L`}
          subtitle={t('statistics.thisWeek')}
          icon={Droplets}
          color="bg-cyan-500"
        />
        <StatCard
          title={t('statistics.avgSleep')}
          value={`${averageSleepHours.toFixed(1)}h`}
          subtitle={t('statistics.perNight')}
          icon={Moon}
          color="bg-purple-500"
        />
        <StatCard
          title={t('statistics.weightChange')}
          value={`${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)}kg`}
          subtitle={t('statistics.total')}
          icon={Scale}
          color={weightChange < 0 ? "bg-green-500" : "bg-red-500"}
        />
      </div>

      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="activity">{t('navigation.activity')}</TabsTrigger>
          <TabsTrigger value="water">{t('navigation.water')}</TabsTrigger>
          <TabsTrigger value="sleep">{t('navigation.sleep')}</TabsTrigger>
          <TabsTrigger value="weight">{t('navigation.weight')}</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('statistics.weeklyActivityTrends')}</CardTitle>
              <CardDescription>{t('statistics.stepsAndCalories')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="steps" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name={t('dashboard.steps')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name={t('dashboard.calories')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('statistics.activityDistribution')}</CardTitle>
              <CardDescription>{t('statistics.favoriteActivities')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {activityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('statistics.waterIntakeTrends')}</CardTitle>
              <CardDescription>{t('statistics.dailyWaterConsumption')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}ml`, t('statistics.waterIntake')]} />
                    <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('statistics.sleepPatterns')}</CardTitle>
              <CardDescription>{t('statistics.sleepDurationQuality')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sleepTrendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="hours" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      name={t('dashboard.hours')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="quality" 
                      stroke="#14b8a6" 
                      strokeWidth={2}
                      name={t('statistics.qualityScale')}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('statistics.weightProgress')}</CardTitle>
              <CardDescription>{t('statistics.weightJourney')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightEntries}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip formatter={(value) => [`${value} kg`, t('dashboard.weight')]} />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default StatisticsPage;
