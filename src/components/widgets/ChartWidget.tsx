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
  Label,
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
    if (type === 'pie') {
      const pieConfig = config as PieChartConfig;
      if (!pieConfig.dataKey || !orders.length) return [];
      const aggregated = orders.reduce((acc, order) => {
        const key = order[pieConfig.dataKey];
        if (typeof key === 'string' || typeof key === 'number') {
          const strKey = String(key);
          acc[strKey] = (acc[strKey] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(aggregated).map(([name, value]) => ({ name, value }));
    }

    const chartConfig = config as ChartConfig;
    if (!chartConfig.xAxis || !chartConfig.yAxis || !orders.length) return [];

    const { xAxis: xAxisKey, yAxis: yAxisKey } = chartConfig;

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

      if (xAxisKey === 'orderDate') {
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
  }, [orders, config, type]);


  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-muted-foreground">No data to display or widget not configured.</div>;
  }

  const formatAxisLabel = (key: string | undefined) => {
    if (!key) return '';
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  const renderChart = () => {
    const chartConfig = config as ChartConfig;
    const pieConfig = config as PieChartConfig;
    const showLabels = (config as ChartConfig).showLabel ?? true;

    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis}>
              {showLabels && <Label value={formatAxisLabel(chartConfig.xAxis)} offset={-10} position="insideBottom" />}
            </XAxis>
            <YAxis>
              {showLabels && <Label value={formatAxisLabel(chartConfig.yAxis)} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey={chartConfig.yAxis} fill={chartConfig.color || COLORS[0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis}>
              {showLabels && <Label value={formatAxisLabel(chartConfig.xAxis)} offset={-10} position="insideBottom" />}
            </XAxis>
            <YAxis>
              {showLabels && <Label value={formatAxisLabel(chartConfig.yAxis)} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
            </YAxis>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={chartConfig.yAxis} stroke={chartConfig.color || COLORS[0]} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xAxis}>
              {showLabels && <Label value={formatAxisLabel(chartConfig.xAxis)} offset={-10} position="insideBottom" />}
            </XAxis>
            <YAxis>
              {showLabels && <Label value={formatAxisLabel(chartConfig.yAxis)} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
            </YAxis>
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
          <ScatterChart margin={{ top: 5, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid />
            <XAxis type={xAxisType} dataKey={chartConfig.xAxis} name={chartConfig.xAxis}>
              {showLabels && <Label value={formatAxisLabel(chartConfig.xAxis)} offset={-10} position="insideBottom" />}
            </XAxis>
            <YAxis type={yAxisType} dataKey={chartConfig.yAxis} name={chartConfig.yAxis}>
              {showLabels && <Label value={formatAxisLabel(chartConfig.yAxis)} angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />}
            </YAxis>
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Orders" data={data} fill={chartConfig.color || COLORS[0]} />
          </ScatterChart>
        );
      }
      case 'pie':
        const showPieLabels = (pieConfig).showLabel ?? true;
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={showPieLabels}>
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
