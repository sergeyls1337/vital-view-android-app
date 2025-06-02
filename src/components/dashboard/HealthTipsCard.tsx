
import { Card } from "@/components/ui/card";
import { Lightbulb, TrendingUp, Target, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HealthTip {
  id: string;
  text: string;
  color: string;
  icon: 'water' | 'steps' | 'sleep' | 'weight' | 'general';
}

interface HealthTipsCardProps {
  healthTips: HealthTip[];
}

const HealthTipsCard = ({ healthTips }: HealthTipsCardProps) => {
  const { t } = useLanguage();

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'general':
        return <Lightbulb className="h-4 w-4 text-white" />;
      case 'steps':
        return <TrendingUp className="h-4 w-4 text-white" />;
      case 'weight':
        return <Target className="h-4 w-4 text-white" />;
      default:
        return <Zap className="h-4 w-4 text-white" />;
    }
  };

  return (
    <Card className="p-5 hover-scale transition-all duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">{t('dashboard.todaysTips')}</h3>
        <div className="flex items-center text-sm text-gray-500">
          <Lightbulb className="h-4 w-4 mr-1" />
          <span>{healthTips.length} tips</span>
        </div>
      </div>
      <ul className="space-y-3">
        {healthTips.map((tip, index) => (
          <li key={tip.id} className={`flex items-start gap-3 animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
            <div className={`min-w-8 min-h-8 rounded-full ${tip.color} flex items-center justify-center shadow-sm`}>
              {getIcon(tip.icon)}
            </div>
            <p className="text-sm leading-relaxed">{tip.text}</p>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default HealthTipsCard;
