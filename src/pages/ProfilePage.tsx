import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import PageHeader from "@/components/PageHeader";
import BottomNavigation from "@/components/BottomNavigation";
import { User, Settings, LogOut, RotateCcw, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dataService } from "@/services/dataService";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [goalSleep, setGoalSleep] = useState("");
  const [goalSteps, setGoalSteps] = useState("");
  const [goalWater, setGoalWater] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        if (!currentUser) {
          navigate("/auth");
        } else {
          console.log("Loaded user data:", currentUser);
          setProfileUser(currentUser);
          setName(currentUser.name || "");
          setEmail(currentUser.email || "");
          setHeight(currentUser.height?.toString() || "");
          setWeight(currentUser.weight?.toString() || "");
          setAge(currentUser.age?.toString() || "");
          setGender(currentUser.gender || "");
          setGoalWeight(currentUser.goalWeight?.toString() || "");
          setGoalSleep(currentUser.goalSleep?.toString() || "");
          setGoalSteps(currentUser.goalSteps?.toString() || "");
          setGoalWater(currentUser.goalWater?.toString() || "");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user profile");
        navigate("/auth");
      }
    };

    loadUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      console.log("Saving profile with data:", {
        name,
        email,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        goalWeight: goalWeight ? parseFloat(goalWeight) : undefined,
        goalSleep: goalSleep ? parseFloat(goalSleep) : undefined,
        goalSteps: goalSteps ? parseInt(goalSteps) : undefined,
        goalWater: goalWater ? parseFloat(goalWater) : undefined,
      });
      
      const updatedUser = await userService.updateProfile({
        name,
        email,
        height: height ? parseFloat(height) : undefined,
        weight: weight ? parseFloat(weight) : undefined,
        age: age ? parseInt(age) : undefined,
        gender,
        goalWeight: goalWeight ? parseFloat(goalWeight) : undefined,
        goalSleep: goalSleep ? parseFloat(goalSleep) : undefined,
        goalSteps: goalSteps ? parseInt(goalSteps) : undefined,
        goalWater: goalWater ? parseFloat(goalWater) : undefined,
      });
      
      // Update user preferences in Supabase directly as a backup
      if (user) {
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            steps_goal: goalSteps ? parseInt(goalSteps) : 10000,
            water_goal: goalWater ? parseFloat(goalWater) * 1000 : 2000, // Convert from L to ml
            sleep_goal: goalSleep ? parseFloat(goalSleep) : 8.0,
            weight_goal: goalWeight ? parseFloat(goalWeight) : null
          });
      }
      
      setProfileUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
      
      // Force reload user data in other components
      window.dispatchEvent(new CustomEvent('user-preferences-updated'));
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetStatistics = async () => {
    if (!user) return;
    
    try {
      // Clear user-specific data from database
      await dataService.clearUserData(user.id);
      
      toast.success("All statistics have been reset!");
      
      // Refresh the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error('Error resetting statistics:', error);
      toast.error("Failed to reset statistics");
    }
  };

  const handleLogout = async () => {
    try {
      await userService.logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/auth");
    }
  };

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-health-purple"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-6 max-w-lg mx-auto">
      <PageHeader 
        title="Your Profile" 
        description="Manage your personal information"
      />
      
      <Card className="p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-health-purple/20 rounded-full flex items-center justify-center mr-4">
            <User className="h-8 w-8 text-health-purple" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{profileUser.name}</h2>
            <p className="text-gray-500">{profileUser.email}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input 
                  id="height" 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input 
                  id="age" 
                  type="number" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input 
                  id="gender" 
                  value={gender} 
                  onChange={(e) => setGender(e.target.value)} 
                />
              </div>
            </div>
            
            <h3 className="font-medium pt-4">Health Goals</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                <Input 
                  id="goalWeight" 
                  type="number" 
                  value={goalWeight} 
                  onChange={(e) => setGoalWeight(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="goalSleep">Goal Sleep (hrs)</Label>
                <Input 
                  id="goalSleep" 
                  type="number" 
                  value={goalSleep} 
                  onChange={(e) => setGoalSleep(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goalSteps">Goal Steps</Label>
                <Input 
                  id="goalSteps" 
                  type="number" 
                  value={goalSteps} 
                  onChange={(e) => setGoalSteps(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="goalWater">Goal Water (L)</Label>
                <Input 
                  id="goalWater" 
                  type="number" 
                  value={goalWater} 
                  onChange={(e) => setGoalWater(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="flex space-x-4 pt-4">
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-health-purple hover:bg-purple-600" 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Height</p>
                <p className="font-medium">{profileUser.height ? `${profileUser.height} cm` : "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{profileUser.weight ? `${profileUser.weight} kg` : "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="font-medium">{profileUser.age || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{profileUser.gender || "Not set"}</p>
              </div>
            </div>
            
            <h3 className="font-medium mb-4">Health Goals</h3>
            <div className="grid grid-cols-2 gap-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Target Weight</p>
                <p className="font-medium">{profileUser.goalWeight ? `${profileUser.goalWeight} kg` : "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Sleep</p>
                <p className="font-medium">{profileUser.goalSleep ? `${profileUser.goalSleep} hours` : "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Steps Target</p>
                <p className="font-medium">{profileUser.goalSteps ? `${profileUser.goalSteps.toLocaleString()} steps` : "Not set"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Daily Water Target</p>
                <p className="font-medium">{profileUser.goalWater ? `${profileUser.goalWater} liters` : "Not set"}</p>
              </div>
            </div>
            
            <div className="flex space-x-4 mb-4">
              <Button 
                className="flex-1 bg-health-purple hover:bg-purple-600"
                onClick={() => setIsEditing(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
            
            <Button 
              className="w-full bg-red-500 hover:bg-red-600 text-white"
              onClick={handleResetStatistics}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All Statistics
            </Button>
          </div>
        )}
      </Card>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;
