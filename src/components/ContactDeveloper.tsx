
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactDeveloperProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactDeveloper = ({ isOpen, onClose }: ContactDeveloperProps) => {
  const { t } = useLanguage();
  const [feedback, setFeedback] = useState({
    type: 'feedback',
    subject: '',
    message: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate sending feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(t('feedback.sent'));
      setFeedback({
        type: 'feedback',
        subject: '',
        message: '',
        email: '',
      });
      onClose();
    } catch (error) {
      toast.error(t('feedback.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-health-purple/20 rounded-full flex items-center justify-center mr-4">
            <MessageCircle className="h-6 w-6 text-health-purple" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{t('settings.contactDeveloper')}</h2>
            <p className="text-gray-500 text-sm">{t('feedback.description')}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input
              id="email"
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="subject">{t('feedback.subject')}</Label>
            <Input
              id="subject"
              value={feedback.subject}
              onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">{t('feedback.message')}</Label>
            <Textarea
              id="message"
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-health-purple hover:bg-purple-600"
            >
              {isSubmitting ? (
                <>{t('common.loading')}</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {t('common.submit')}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ContactDeveloper;
