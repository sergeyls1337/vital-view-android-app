
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { Droplets, Zap } from "lucide-react";

interface WaterAmountSelectorProps {
  onAddWater: (amount: number) => void;
}

const WaterAmountSelector = ({ onAddWater }: WaterAmountSelectorProps) => {
  const { t } = useLanguage();
  const [customAmount, setCustomAmount] = useState(250);
  const [isOpen, setIsOpen] = useState(false);

  const presetAmounts = [
    { amount: 50, label: "Sip", icon: "💧" },
    { amount: 100, label: "Small", icon: "🥃" },
    { amount: 250, label: "Cup", icon: "☕" },
    { amount: 500, label: "Bottle", icon: "🍼" },
    { amount: 750, label: "Large", icon: "🧃" }
  ];

  const handleCustomAdd = () => {
    if (customAmount > 0) {
      onAddWater(customAmount);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-5 gap-2">
        {presetAmounts.map(({ amount, label, icon }) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => onAddWater(amount)}
            className="flex flex-col h-16 w-16 p-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
          >
            <span className="text-lg mb-1">{icon}</span>
            <span className="text-xs font-medium">{amount}</span>
          </Button>
        ))}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Zap className="h-3 w-3" />
            {t('water.customAmount')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              {t('water.addCustomAmount')}
            </DialogTitle>
            <DialogDescription>
              {t('water.enterAmountDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">{t('water.amount')} (ml)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                max="2000"
                value={customAmount}
                onChange={(e) => setCustomAmount(Number(e.target.value))}
                className="mt-1"
                placeholder="Enter amount..."
              />
            </div>
            
            {/* Quick preset buttons in dialog */}
            <div>
              <Label className="text-sm text-muted-foreground">Quick select:</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {[125, 200, 350, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomAmount(amount)}
                    className={customAmount === amount ? "bg-blue-100 border-blue-300" : ""}
                  >
                    {amount}ml
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleCustomAdd} 
              className="bg-health-blue hover:bg-blue-600 flex items-center gap-2"
            >
              <Droplets className="h-4 w-4" />
              {t('water.addWater')}
            </Button>
            <DialogClose asChild>
              <Button variant="outline">{t('common.cancel')}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WaterAmountSelector;
