
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const type = searchParams.get('type');
      const token_hash = searchParams.get('token_hash');
      
      if (type === 'email' && token_hash) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email'
          });

          if (error) {
            setStatus('error');
            setMessage('Failed to verify email. The link may have expired.');
            toast.error('Email verification failed');
          } else {
            setStatus('success');
            setMessage('Your email has been successfully verified! You can now use all features of HealthTrack.');
            toast.success('Email verified successfully!');
          }
        } catch (error) {
          setStatus('error');
          setMessage('An unexpected error occurred during verification.');
          toast.error('Verification failed');
        }
      } else if (type === 'recovery') {
        setStatus('success');
        setMessage('You can now reset your password. Please enter a new password below.');
      } else {
        setStatus('error');
        setMessage('Invalid verification link.');
      }
    };

    handleEmailConfirmation();
  }, [searchParams]);

  const handleContinue = () => {
    const type = searchParams.get('type');
    if (type === 'recovery') {
      // For password recovery, redirect to a password reset form
      navigate('/auth?reset=true');
    } else {
      // For email verification, redirect to dashboard
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-health-purple to-health-blue p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="w-16 h-16 bg-health-purple/20 rounded-full flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-health-purple animate-spin" />
            </div>
          )}
          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          )}
          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Verifying...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Verification Failed'}
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        {status !== 'loading' && (
          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full bg-health-purple hover:bg-purple-600"
            >
              {status === 'success' ? 'Continue to HealthTrack' : 'Try Again'}
            </Button>
            
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline" 
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmailConfirmation;
