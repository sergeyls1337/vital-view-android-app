
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import WeightTrackChart from "@/components/WeightTrackChart";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWeightData } from "@/hooks/useWeightData";
import { TrendingDown, ChevronDown, TrendingUp } from "lucide-react";

const WeightPage = () => {
  const { t } = useLanguage();
  const { weightEntries, loading, saveWeightEntry, getCurrentWeight } = useWeightData();
  const [weight, setWeight] = useState("");
  const goalWeight = 70;
  
  const currentWeight = getCurrentWeight();

  const getWeightDifference = () => {
    if (weightEntries.length < 2) return 0;
    return +(currentWeight - weightEntries[0].weight).toFixed(1);
  };
  
  const handleAddWeight = async () => {
    if (!weight || isNaN(parseFloat(weight))) {
      toast({
        title: t('weight.invalidWeight'),
        description: t('weight.enterValidNumber'),
        variant: "destructive"
      });
      return;
    }

    const newWeight = parseFloat(weight);
    const success = await saveWeightEntry(newWeight);
    
    if (success) {
      setWeight("");
      toast({
        title: t('weight.weightAdded'),
        description: `${t('weight.added')} ${newWeight} kg ${t('weight.toRecords')}`,
      });
    }
  };
  
  const weightDifference = getWeightDifference();
  const weightToGoal = +(currentWeight - goalWeight).toFixed(1);

  if (loading) {
    return (
      <div className="pb-20 px-6 max-w-lg mx-auto">
        <PageHeader 
          title={t('navigation.weight')} 
          description={t('weight.description')}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading weight data...</div>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  
  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title={t('navigation.weight')} 
        description={t('weight.description')}
      />
      
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{t('weight.currentWeight')}</h3>
          <div className="flex items-center text-health-green">
            {weightDifference < 0 ? (
              <>
                <TrendingDown className="h-4 w-4 mr-1" />
                <span className="text-sm">{weightDifference} kg</span>
              </>
            ) : weightDifference > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 mr-1 text-red-500" />
                <span className="text-sm text-red-500">+{weightDifference} kg</span>
              </>
            ) : (
              <span className="text-sm">{t('weight.noChange')}</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.current')}</p>
            <p className="text-2xl font-bold">{currentWeight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.goal')}</p>
            <p className="text-2xl font-bold text-health-green">{goalWeight} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('weight.left')}</p>
            <p className="text-2xl font-bold text-health-blue">{weightToGoal > 0 ? weightToGoal : 0} kg</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-grow">
            <Input
              type="number"
              placeholder={t('weight.enterWeight')}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="pr-10"
              step="0.1"
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <span className="text-gray-500">kg</span>
            </div>
          </div>
          <Button 
            className="bg-health-blue hover:bg-blue-600"
            onClick={handleAddWeight}
          >
            {t('weight.add')}
          </Button>
        </div>
      </Card>
      
      <Card className="p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{t('weight.progressChart')}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </div>
        
        <WeightTrackChart data={weightEntries} goalWeight={goalWeight} />
      </Card>
      
      <Card className="p-5">
        <h3 className="font-medium mb-3">{t('weight.weightHistory')}</h3>
        {weightEntries.length > 0 ? (
          <div className="space-y-1">
            {[...weightEntries].reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span>{entry.date}</span>
                <span className="font-medium">{entry.weight} kg</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">{t('weight.noWeightEntries')}</p>
        )}
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default WeightPage;
