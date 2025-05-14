
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await userService.login(email, password);
      toast.success("Login successful!");
      navigate("/profile");
    } catch (error) {
      toast.error("Invalid credentials. Use demo@example.com / password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 bg-health-purple/20 rounded-full flex items-center justify-center">
          <User className="h-8 w-8 text-health-purple" />
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-center mb-4">Sign In</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="demo@example.com" 
            required 
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password" 
            required 
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-health-purple hover:bg-purple-600"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
        
        <p className="text-xs text-center text-gray-500">
          Use demo@example.com / password
        </p>
      </form>
    </Card>
  );
};

export default LoginForm;
