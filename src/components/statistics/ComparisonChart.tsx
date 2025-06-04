
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Calendar, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ComparisonData {
  category: string;
  yourValue: number;
  average: number;
  unit: string;
}

interface ComparisonChartProps {
  data: ComparisonData[];
  title: string;
  description: string;
}

const ComparisonChart = ({ data, title, description }: ComparisonChartProps) => {
  const { t } = useLanguage();

  const chartData = data.map(item => ({
    category: item.category,
    yours: item.yourValue,
    average: item.average,
    difference: item.yourValue - item.average,
    unit: item.unit
  }));

  const chartConfig = {
    yours: {
      label: t('statistics.yourData'),
      color: "hsl(var(--chart-1))",
    },
    average: {
      label: t('statistics.average'),
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card className="hover-scale transition-all duration-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 mb-4">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="yours" fill="var(--color-yours)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="average" fill="var(--color-average)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        
        <div className="space-y-2">
          {data.map((item, index) => {
            const difference = item.yourValue - item.average;
            const percentDifference = item.average > 0 ? (difference / item.average) * 100 : 0;
            const isAbove = difference > 0;
            
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <span>{item.category}</span>
                <Badge variant={isAbove ? "default" : "secondary"} className="text-xs">
                  {isAbove ? '+' : ''}{difference.toFixed(1)}{item.unit} 
                  ({isAbove ? '+' : ''}{percentDifference.toFixed(1)}%)
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonChart;
