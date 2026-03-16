'use client';
import { Button } from '@/components/ui/button';
import type { WidgetType } from '@/lib/types';
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  Table,
  CircleDollarSign,
} from 'lucide-react';

interface WidgetPaletteProps {
  onAddWidget: (type: WidgetType) => void;
}

const widgetOptions: { type: WidgetType; name: string; icon: React.ReactNode }[] = [
  { type: 'kpi', name: 'KPI Card', icon: <CircleDollarSign /> },
  { type: 'table', name: 'Table', icon: <Table /> },
  { type: 'bar', name: 'Bar Chart', icon: <BarChart /> },
  { type: 'line', name: 'Line Chart', icon: <LineChart /> },
  { type: 'pie', name: 'Pie Chart', icon: <PieChart /> },
  { type: 'area', name: 'Area Chart', icon: <AreaChart /> },
  { type: 'scatter', name: 'Scatter Plot', icon: <ScatterChart /> },
];

export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  return (
    <aside className="w-64 border-r bg-card p-4">
      <h3 className="mb-4 text-lg font-semibold">Widgets</h3>
      <div className="grid grid-cols-2 gap-2">
        {widgetOptions.map(option => (
          <Button
            key={option.type}
            variant="outline"
            className="flex h-20 flex-col items-center justify-center gap-2 p-2 text-center"
            onClick={() => onAddWidget(option.type)}
          >
            {option.icon}
            <span className="text-xs">{option.name}</span>
          </Button>
        ))}
      </div>
    </aside>
  );
}
