
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
import { Bell, Clock } from "lucide-react";
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
    
    toast({
      title: t('water.reminderSet'),
      description: t('water.reminderSetDescription').replace('{minutes}', intervalMinutes.toString()),
    });
  };

  const presetIntervals = [30, 60, 120, 180];

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
            <div className="space-y-4">
              <div>
                <Label htmlFor="interval">{t('water.reminderInterval')}</Label>
                <Input
                  id="interval"
                  type="number"
                  min="15"
                  max="480"
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('water.reminderMinimum')}
                </p>
              </div>
              
              <div>
                <Label>{t('water.quickSelect')}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {presetIntervals.map((interval) => (
                    <Button
                      key={interval}
                      variant="outline"
                      size="sm"
                      onClick={() => setIntervalMinutes(interval)}
                      className={intervalMinutes === interval ? "bg-health-blue text-white" : ""}
                    >
                      {interval} {t('water.minutes')}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button onClick={handleSetReminder} className="bg-health-blue hover:bg-blue-600">
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
