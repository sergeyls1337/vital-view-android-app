
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import WeightTrackChart from "@/components/WeightTrackChart";
import WeightProgressCard from "@/components/weight/WeightProgressCard";
import WeightGoalSetter from "@/components/weight/WeightGoalSetter";
import WeightInsights from "@/components/weight/WeightInsights";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWeightData } from "@/hooks/useWeightData";
import { useWeightGoal } from "@/hooks/useWeightGoal";
import { TrendingDown, ChevronDown, TrendingUp, Calculator, Ruler } from "lucide-react";

const WeightPage = () => {
  const { t } = useLanguage();
  const { 
    weightEntries, 
    loading, 
    saveWeightEntry, 
    getCurrentWeight, 
    getCurrentBMI, 
    getBMICategory,
    userHeight,
    updateUserHeight 
  } = useWeightData();
  const { goalWeight, updateGoalWeight } = useWeightGoal();
  const [weight, setWeight] = useState("");
  const [showHeightInput, setShowHeightInput] = useState(false);
  const [tempHeight, setTempHeight] = useState(userHeight.toString());
  
  const currentWeight = getCurrentWeight();
  const currentBMI = getCurrentBMI();
  const bmiInfo = getBMICategory(currentBMI);

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
    if (newWeight < 20 || newWeight > 300) {
      toast({
        title: t('weight.invalidWeight'),
        description: "Please enter a weight between 20-300 kg",
        variant: "destructive"
      });
      return;
    }

    const success = await saveWeightEntry(newWeight);
    
    if (success) {
      setWeight("");
      toast({
        title: t('weight.weightAdded'),
        description: `${t('weight.added')} ${newWeight} kg ${t('weight.toRecords')}`,
      });
    }
  };

  const handleHeightUpdate = () => {
    const height = parseFloat(tempHeight);
    if (height >= 100 && height <= 250) {
      updateUserHeight(height);
      setShowHeightInput(false);
      toast({
        title: "Height Updated",
        description: `Height set to ${height} cm`,
      });
    } else {
      toast({
        title: "Invalid Height",
        description: "Please enter a height between 100-250 cm",
        variant: "destructive"
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
    <div className="pb-20 px-6 max-w-lg mx-auto space-y-6">
      <PageHeader 
        title={t('navigation.weight')} 
        description={t('weight.description')}
      />
      
      <Card className="p-5">
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
        
        <div className="grid grid-cols-3 gap-4 mb-6">
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

        {/* BMI Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Calculator className="h-4 w-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium">BMI</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHeightInput(!showHeightInput)}
              className="text-xs"
            >
              <Ruler className="h-3 w-3 mr-1" />
              {userHeight}cm
            </Button>
          </div>
          
          {showHeightInput && (
            <div className="flex gap-2 mb-3">
              <Input
                type="number"
                value={tempHeight}
                onChange={(e) => setTempHeight(e.target.value)}
                placeholder="Height in cm"
                className="text-sm"
              />
              <Button size="sm" onClick={handleHeightUpdate}>Save</Button>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <span className={`text-lg font-bold ${bmiInfo.color}`}>
              {currentBMI > 0 ? currentBMI : '--'}
            </span>
            <span className={`text-sm ${bmiInfo.color}`}>
              {currentBMI > 0 ? bmiInfo.category : 'Set height to calculate'}
            </span>
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

      <WeightProgressCard 
        currentWeight={currentWeight}
        goalWeight={goalWeight}
        weightEntries={weightEntries}
      />

      <WeightGoalSetter 
        goalWeight={goalWeight}
        onGoalChange={updateGoalWeight}
      />
      
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{t('weight.progressChart')}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </div>
        
        <WeightTrackChart data={weightEntries} goalWeight={goalWeight} />
      </Card>

      <WeightInsights 
        weightEntries={weightEntries}
        goalWeight={goalWeight}
      />
      
      <Card className="p-5">
        <h3 className="font-medium mb-3">{t('weight.weightHistory')}</h3>
        {weightEntries.length > 0 ? (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {[...weightEntries].reverse().map((entry, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">{entry.date}</span>
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
