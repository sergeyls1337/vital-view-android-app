
export interface DailyActivity {
  date: string;
  steps: number;
  distance: number;
  calories: number;
  duration: number; // in minutes
  activityType?: string;
}

export type ActivityType = "walking" | "running" | "cycling" | "hiking" | "swimming" | "gym";
