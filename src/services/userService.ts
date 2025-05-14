
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  goalWeight?: number;
  goalSleep?: number;
  goalSteps?: number;
  goalWater?: number;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    height: 175,
    weight: 75,
    age: 30,
    gender: "Not specified",
    goalWeight: 70,
    goalSleep: 8,
    goalSteps: 10000,
    goalWater: 2.5,
  }
];

// In a real app, this would connect to a backend API
export const userService = {
  currentUser: null as User | null,

  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUser = user;
          resolve(user);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 500);
    });
  },

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  },

  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser;
    
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }
    
    return null;
  },

  updateProfile(updates: Partial<User>): Promise<User> {
    return new Promise((resolve) => {
      const currentUser = this.getCurrentUser();
      if (!currentUser) throw new Error("No user logged in");
      
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      this.currentUser = updatedUser;
      
      setTimeout(() => {
        resolve(updatedUser);
      }, 500);
    });
  }
};
