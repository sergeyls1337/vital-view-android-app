
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface SleepData {
  day: string;
  hours: number;
  quality: number;
}

interface SleepQualityChartProps {
  data: SleepData[];
}

const SleepQualityChart = ({ data }: SleepQualityChartProps) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 10]}
            tick={{ fontSize: 12, fill: '#6b7280' }} 
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "none", 
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
              padding: "12px"
            }}
            formatter={(value: number, name: string) => {
              if (name === "hours") return [`${value} hours`, "Sleep Duration"];
              return [`${value}/10`, "Sleep Quality"];
            }}
            labelStyle={{ color: '#374151', fontWeight: 'medium' }}
          />
          <Bar 
            dataKey="hours" 
            fill="url(#purpleGradient)" 
            radius={[6, 6, 0, 0]} 
            barSize={28}
          />
          <Bar 
            dataKey="quality" 
            fill="url(#tealGradient)" 
            radius={[6, 6, 0, 0]} 
            barSize={28}
          />
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepQualityChart;
