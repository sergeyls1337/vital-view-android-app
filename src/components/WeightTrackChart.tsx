
import { 
  LineChart, 
  Line,
  XAxis, 
  YAxis,
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
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
  // Find min and max for Y axis domain with some padding
  const weights = data.map(item => item.weight);
  const minWeight = Math.min(...weights, goalWeight) - 2;
  const maxWeight = Math.max(...weights, goalWeight) + 2;
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const weight = payload[0].value;
      const difference = (weight - goalWeight).toFixed(1);
      const diffText = parseFloat(difference) > 0 ? `+${difference}` : difference;
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-800">{label}</p>
          <p className="text-blue-600 font-semibold">{weight} kg</p>
          <p className={`text-xs ${parseFloat(difference) > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {diffText} kg from goal
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            domain={[minWeight, maxWeight]}
            tick={{ fontSize: 11, fill: '#64748b' }} 
            axisLine={false}
            tickLine={false}
            width={35}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={goalWeight} 
            stroke="#22c55e" 
            strokeDasharray="4 4" 
            strokeWidth={2}
            label={{ 
              value: `Goal: ${goalWeight} kg`, 
              position: 'left',
              fill: '#22c55e',
              fontSize: 11,
              fontWeight: 'bold'
            }} 
          />
          <Area
            type="monotone"
            dataKey="weight"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#weightGradient)"
            dot={{ 
              fill: "#3b82f6", 
              strokeWidth: 2,
              r: 4,
              stroke: "#ffffff"
            }}
            activeDot={{ 
              fill: "#3b82f6", 
              strokeWidth: 3,
              r: 6,
              stroke: "#ffffff"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightTrackChart;
