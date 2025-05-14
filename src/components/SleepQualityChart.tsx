
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
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 10]}
            tick={{ fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            width={30}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "white", 
              border: "none", 
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
            }}
            formatter={(value: number, name: string) => {
              if (name === "hours") return [`${value} hours`, "Sleep Duration"];
              return [`${value}/10`, "Sleep Quality"];
            }}
          />
          <Bar 
            dataKey="hours" 
            fill="#8b5cf6" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
          <Bar 
            dataKey="quality" 
            fill="#14b8a6" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepQualityChart;
