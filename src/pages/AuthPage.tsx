
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, UserPlus, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showEmailSent, setShowEmailSent] = useState(false);
  const [emailSentType, setEmailSentType] = useState<'signup' | 'reset'>('signup');
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast.success("Login successful!");
        navigate("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          return;
        }
        await signUp(formData.email, formData.password, formData.username);
        setEmailSentType('signup');
        setShowEmailSent(true);
        toast.success("Account created successfully! Please check your email to verify your account.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      
      if (error) throw error;
      
      setEmailSentType('reset');
      setShowEmailSent(true);
      setShowForgotPassword(false);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (showEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-health-purple to-health-blue p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-health-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="h-8 w-8 text-health-purple" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {emailSentType === 'signup' ? 'Check Your Email' : 'Reset Link Sent'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {emailSentType === 'signup' 
              ? `We've sent a verification link to ${formData.email}. Please check your email and click the link to verify your account.`
              : `We've sent a password reset link to ${formData.email}. Please check your email and follow the instructions to reset your password.`
            }
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => {
                setShowEmailSent(false);
                setEmailSentType('signup');
              }}
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
            
            <p className="text-sm text-gray-500">
              Didn't receive an email? Check your spam folder or try again.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-health-purple to-health-blue p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-health-purple/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-health-purple" />
            </div>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-health-purple hover:bg-purple-600"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="text-health-purple hover:text-purple-600 text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 inline mr-1" />
              Back to Sign In
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-health-purple to-health-blue p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-health-purple/20 rounded-full flex items-center justify-center">
            {isLogin ? (
              <User className="h-8 w-8 text-health-purple" />
            ) : (
              <UserPlus className="h-8 w-8 text-health-purple" />
            )}
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600">
            {isLogin ? "Sign in to your health tracking account" : "Join HealthTrack to start monitoring your wellness"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isLogin}
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-health-purple hover:bg-purple-600"
            disabled={isLoading}
          >
            {isLoading 
              ? (isLogin ? "Signing in..." : "Creating account...") 
              : (isLogin ? "Sign In" : "Create Account")
            }
          </Button>
        </form>

        {isLogin && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-health-purple hover:text-purple-600 text-sm font-medium"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-health-purple hover:text-purple-600 text-sm font-medium"
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
