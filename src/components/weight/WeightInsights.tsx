
import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeightInsightsProps {
  weightEntries: any[];
  goalWeight: number;
}

const WeightInsights = ({ weightEntries, goalWeight }: WeightInsightsProps) => {
  const { t } = useLanguage();
  
  const getInsights = () => {
    if (weightEntries.length < 3) {
      return {
        trend: 'insufficient_data',
        averageChange: 0,
        consistency: 0,
        prediction: ''
      };
    }
    
    const recent7Days = weightEntries.slice(-7);
    const totalChange = recent7Days[recent7Days.length - 1].weight - recent7Days[0].weight;
    const averageChange = totalChange / recent7Days.length;
    
    // Calculate consistency (lower variance = more consistent)
    const weights = recent7Days.map(entry => entry.weight);
    const average = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const variance = weights.reduce((sum, weight) => sum + Math.pow(weight - average, 2), 0) / weights.length;
    const consistency = Math.max(0, 100 - (variance * 10));
    
    let trend = 'stable';
    if (averageChange > 0.1) trend = 'increasing';
    if (averageChange < -0.1) trend = 'decreasing';
    
    // Simple prediction based on current trend
    const currentWeight = weightEntries[weightEntries.length - 1].weight;
    const daysToGoal = Math.abs((currentWeight - goalWeight) / Math.abs(averageChange));
    const prediction = averageChange !== 0 && daysToGoal < 365 ? Math.ceil(daysToGoal) : null;
    
    return {
      trend,
      averageChange: Math.abs(averageChange),
      consistency: Math.round(consistency),
      prediction
    };
  };
  
  const insights = getInsights();
  
  const getTrendIcon = () => {
    switch (insights.trend) {
      case 'increasing':
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-5 w-5 text-green-500" />;
      default:
        return <BarChart3 className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const getTrendText = () => {
    switch (insights.trend) {
      case 'increasing':
        return t('weight.trendIncreasing');
      case 'decreasing':
        return t('weight.trendDecreasing');
      case 'insufficient_data':
        return t('weight.insufficientData');
      default:
        return t('weight.trendStable');
    }
  };
  
  if (insights.trend === 'insufficient_data') {
    return (
      <Card className="p-5 bg-gradient-to-r from-gray-50 to-slate-50">
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-600 mb-2">{t('weight.insightsTitle')}</h3>
          <p className="text-sm text-gray-500">{t('weight.needMoreData')}</p>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-l-purple-500">
      <div className="flex items-center mb-4">
        <h3 className="font-medium text-lg mr-2">{t('weight.insights')}</h3>
        {getTrendIcon()}
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <TrendingDown className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm text-gray-600">{t('weight.weeklyTrend')}</span>
          </div>
          <span className="font-medium">{getTrendText()}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 text-purple-500 mr-2" />
            <span className="text-sm text-gray-600">{t('weight.consistency')}</span>
          </div>
          <span className="font-medium">{insights.consistency}%</span>
        </div>
        
        {insights.prediction && (
          <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-sm text-gray-600">{t('weight.goalPrediction')}</span>
            </div>
            <span className="font-medium">{insights.prediction} days</span>
          </div>
        )}
        
        <div className="p-3 bg-purple-100 rounded-lg">
          <p className="text-xs text-purple-700">
            💡 {insights.trend === 'decreasing' ? t('weight.goodProgress') : 
                insights.trend === 'increasing' ? t('weight.stayMotivated') : 
                t('weight.maintainHabits')}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WeightInsights;
