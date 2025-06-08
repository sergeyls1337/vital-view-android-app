import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, Palette, MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import ContactDeveloper from "./ContactDeveloper";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [showContact, setShowContact] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40">
        <Card className="w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{t('settings.settings')}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-3">
                <Globe className="h-5 w-5 mr-2 text-health-purple" />
                <Label className="text-base font-medium">{t('settings.language')}</Label>
              </div>
              <Select value={language} onValueChange={(value: 'en' | 'uk') => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="uk">Українська</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center mb-3">
                <Palette className="h-5 w-5 mr-2 text-health-purple" />
                <Label className="text-base font-medium">{t('settings.theme')}</Label>
              </div>
              <Select value={theme} onValueChange={(value: 'light' | 'dark') => setTheme(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('settings.light')}</SelectItem>
                  <SelectItem value="dark">{t('settings.dark')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button
                onClick={() => setShowContact(true)}
                variant="outline"
                className="w-full justify-start"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {t('settings.contactDeveloper')}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <ContactDeveloper
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />
    </>
  );
};

export default SettingsPanel;
