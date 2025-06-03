
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Bell, Clock, Zap, Coffee, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";

interface WaterReminderDrawerProps {
  onSetReminder: (intervalMinutes: number) => void;
}

const WaterReminderDrawer = ({ onSetReminder }: WaterReminderDrawerProps) => {
  const { t } = useLanguage();
  const [intervalMinutes, setIntervalMinutes] = useState(60);
  const [isOpen, setIsOpen] = useState(false);

  const handleSetReminder = () => {
    if (intervalMinutes < 15) {
      toast({
        title: t('water.reminderError'),
        description: t('water.reminderMinInterval'),
        variant: "destructive",
      });
      return;
    }

    onSetReminder(intervalMinutes);
    setIsOpen(false);
  };

  const presetIntervals = [
    { minutes: 15, label: "Frequent", icon: Zap, description: "Every 15 minutes" },
    { minutes: 30, label: "Active", icon: Coffee, description: "Every 30 minutes" },
    { minutes: 60, label: "Regular", icon: Clock, description: "Every hour" },
    { minutes: 120, label: "Relaxed", icon: Moon, description: "Every 2 hours" }
  ];

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          {t('water.setReminder')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-health-blue" />
              {t('water.waterReminder')}
            </DrawerTitle>
            <DrawerDescription>
              {t('water.reminderDescription')}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="space-y-6">
              <div>
                <Label>{t('water.quickSelect')}</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {presetIntervals.map(({ minutes, label, icon: Icon, description }) => (
                    <Button
                      key={minutes}
                      variant="outline"
                      onClick={() => setIntervalMinutes(minutes)}
                      className={`h-auto p-4 flex flex-col items-start gap-2 transition-all duration-300 ${
                        intervalMinutes === minutes 
                          ? "bg-health-blue text-white border-health-blue" 
                          : "hover:bg-blue-50 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{label}</span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs opacity-75">{description}</p>
                        <p className="text-sm font-semibold">{minutes} min</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="interval">{t('water.reminderInterval')} (minutes)</Label>
                <Input
                  id="interval"
                  type="number"
                  min="15"
                  max="480"
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('water.reminderMinimum')}
                </p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button 
              onClick={handleSetReminder} 
              className="bg-health-blue hover:bg-blue-600 flex items-center gap-2"
            >
              <Bell className="h-4 w-4" />
              {t('water.setReminder')}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">{t('common.cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WaterReminderDrawer;
