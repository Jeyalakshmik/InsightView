'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  MoveVertical,
} from 'lucide-react';

interface WidgetPaletteProps {
  onAddWidget: (type: WidgetType) => void;
}

const widgetGroups = [
    {
        title: 'Charts',
        value: 'charts',
        items: [
            { type: 'bar' as WidgetType, name: 'Bar Chart', icon: <BarChart /> },
            { type: 'line' as WidgetType, name: 'Line Chart', icon: <LineChart /> },
            { type: 'pie' as WidgetType, name: 'Pie Chart', icon: <PieChart /> },
            { type: 'area' as WidgetType, name: 'Area Chart', icon: <AreaChart /> },
            { type: 'scatter' as WidgetType, name: 'Scatter Plot', icon: <ScatterChart /> },
        ]
    },
    {
        title: 'Tables',
        value: 'tables',
        items: [
            { type: 'table' as WidgetType, name: 'Table', icon: <Table /> },
        ]
    },
    {
        title: 'KPIs',
        value: 'kpis',
        items: [
            { type: 'kpi' as WidgetType, name: 'KPI Value', icon: <CircleDollarSign /> },
        ]
    }
]


export function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  return (
    <aside className="w-64 space-y-4 border-r bg-card p-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">Widget Library</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to your canvas
        </p>
      </div>
      <Accordion
        type="multiple"
        defaultValue={['charts', 'tables', 'kpis']}
        className="w-full"
      >
        {widgetGroups.map(group => (
          <AccordionItem value={group.value} key={group.value}>
            <AccordionTrigger className="px-2 text-sm font-medium hover:no-underline">
              {group.title}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-col gap-1">
                {group.items.map(option => (
                  <Button
                    key={option.type}
                    variant="ghost"
                    className="h-auto justify-start gap-2 p-2 text-sm font-normal"
                    onClick={() => onAddWidget(option.type)}
                  >
                    <MoveVertical className="h-4 w-4 text-muted-foreground" />
                    {option.icon}
                    <span>{option.name}</span>
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </aside>
  );
}
