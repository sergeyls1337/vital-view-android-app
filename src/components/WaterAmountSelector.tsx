
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

interface WaterAmountSelectorProps {
  onAddWater: (amount: number) => void;
}

const WaterAmountSelector = ({ onAddWater }: WaterAmountSelectorProps) => {
  const { t } = useLanguage();
  const [customAmount, setCustomAmount] = useState(250);
  const [isOpen, setIsOpen] = useState(false);

  const presetAmounts = [50, 100, 250, 500, 750];

  const handleCustomAdd = () => {
    if (customAmount > 0) {
      onAddWater(customAmount);
      setIsOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {presetAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => onAddWater(amount)}
            className="min-w-16"
          >
            +{amount}
          </Button>
        ))}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {t('water.customAmount')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('water.addCustomAmount')}</DialogTitle>
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
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCustomAdd} className="bg-health-blue hover:bg-blue-600">
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
