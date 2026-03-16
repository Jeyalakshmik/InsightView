'use client';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CustomerOrder, WidgetType, ChartConfig, PieChartConfig } from '@/lib/types';
import { useMemo } from 'react';

interface ChartWidgetProps {
  orders: CustomerOrder[];
  type: WidgetType;
  config: ChartConfig | PieChartConfig;
}

const COLORS = ['#2268CC', '#1CBFDB', '#8884d8', '#82ca9d', '#ffc658'];

export function ChartWidget({ orders, type, config }: ChartWidgetProps) {
  const data = useMemo(() => {
    if ((!('xAxis' in config) || !config.xAxis) && (!('dataKey' in config) || !config.dataKey)) return [];
    if (!orders.length) return [];
    
    const dataKey = 'dataKey' in config ? config.dataKey : undefined;
    const xAxisKey = 'xAxis' in config ? config.xAxis : undefined;
    const yAxisKey = 'yAxis' in config ? config.yAxis : undefined;

    if (type === 'pie' && dataKey) {
        const aggregated = orders.reduce((acc, order) => {
            const key = order[dataKey];
            if (typeof key === 'string' || typeof key === 'number') {
                const value = (acc[key] || 0) + 1;
                acc[key] = value;
            }
            return acc;
        }, {} as Record<string, number>);
        
        return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
    }
    
    if (xAxisKey && yAxisKey) {
        if (type === 'scatter') {
            return orders.map(o => ({
                [xAxisKey]: o[xAxisKey],
                [yAxisKey]: o[yAxisKey],
            }));
        }

        const numericYKeys = ['quantity', 'unitPrice', 'totalAmount'];
        const isNumericY = numericYKeys.includes(yAxisKey);

        const aggregatedData = orders.reduce((acc, order) => {
            let xValue = order[xAxisKey];
            const yValue = order[yAxisKey];

            if (xValue === null || xValue === undefined || yValue === null || yValue === undefined) return acc;
            
            const originalXForSort = xValue;

            if (xAxisKey === 'orderDate' && ['bar', 'line', 'area'].includes(type)) {
                xValue = new Date(xValue as string).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
            }

            const key = String(xValue);

            if (!acc[key]) {
                acc[key] = { 
                    x: xValue, 
                    y: 0,
                    originalX: originalXForSort
                };
            }

            if (isNumericY && typeof yValue === 'number') {
                acc[key].y += yValue;
            } else {
                acc[key].y += 1;
            }
            
            return acc;
        }, {} as Record<string, {x: any, y: number, originalX: any}>);

        let chartData = Object.values(aggregatedData).map(d => ({
            [xAxisKey]: d.x,
            [yAxisKey]: d.y,
            originalX: d.originalX,
        }));


        if (xAxisKey === 'orderDate' && ['line', 'area'].includes(type)) {
            chartData = chartData.sort((a, b) => new Date(a.originalX).getTime() - new Date(b.originalX).getTime());
        }
        
        return chartData;
    }


    return [];
  }, [orders, config, type]);


  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">No data to display or widget not configured.</div>;
  }

  const renderChart = () => {
    const chartConfig = config as ChartConfig;
    const pieConfig = config as PieChartConfig;

    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={chartConfig.yAxis} fill={chartConfig.color || COLORS[0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={chartConfig.yAxis} stroke={chartConfig.color || COLORS[0]} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={chartConfig.yAxis} fill={chartConfig.color || COLORS[0]} stroke={chartConfig.color || COLORS[0]}/>
          </AreaChart>
        );
      case 'scatter': {
        const numericKeys = ['quantity', 'unitPrice', 'totalAmount'];
        const xAxisType = numericKeys.includes(chartConfig.xAxis || '') ? 'number' : 'category';
        const yAxisType = numericKeys.includes(chartConfig.yAxis || '') ? 'number' : 'category';
        return (
          <ScatterChart>
            <CartesianGrid />
            <XAxis type={xAxisType} dataKey={chartConfig.xAxis} name={chartConfig.xAxis} />
            <YAxis type={yAxisType} dataKey={chartConfig.yAxis} name={chartConfig.yAxis} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Orders" data={data} fill={chartConfig.color || COLORS[0]} />
          </ScatterChart>
        );
      }
      case 'pie':
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return <div>Invalid chart type</div>;
    }
  };

  return <ResponsiveContainer width="100%" height="100%">{renderChart()}</ResponsiveContainer>;
}
