
import { 
  LineChart, 
  Line,
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

interface WeightData {
  date: string;
  weight: number;
}

interface WeightTrackChartProps {
  data: WeightData[];
  goalWeight: number;
}

const WeightTrackChart = ({ data, goalWeight }: WeightTrackChartProps) => {
  // Find min and max for Y axis domain
  const weights = data.map(item => item.weight);
  const minWeight = Math.min(...weights, goalWeight) - 1;
  const maxWeight = Math.max(...weights, goalWeight) + 1;
  
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[minWeight, maxWeight]}
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
            formatter={(value: number) => [`${value} kg`, "Weight"]}
          />
          <ReferenceLine 
            y={goalWeight} 
            stroke="#84cc16" 
            strokeDasharray="3 3" 
            label={{ 
              value: `Goal: ${goalWeight} kg`, 
              position: 'left',
              fill: '#84cc16',
              fontSize: 12
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="weight" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ 
              fill: "#3b82f6", 
              strokeWidth: 2,
              r: 4
            }}
            activeDot={{ 
              fill: "#3b82f6", 
              strokeWidth: 2,
              r: 6
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightTrackChart;
