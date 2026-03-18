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
  Trash2,
} from 'lucide-react';
import { Separator } from '../ui/separator';

interface WidgetPaletteProps {
  onAddWidget: (type: WidgetType) => void;
  onClear: () => void;
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
      {
        type: 'scatter' as WidgetType,
        name: 'Scatter Plot',
        icon: <ScatterChart />,
      },
    ],
  },
  {
    title: 'Tables',
    value: 'tables',
    items: [{ type: 'table' as WidgetType, name: 'Table', icon: <Table /> }],
  },
  {
    title: 'KPIs',
    value: 'kpis',
    items: [
      { type: 'kpi' as WidgetType, name: 'KPI Value', icon: <CircleDollarSign /> },
    ],
  },
];

export function WidgetPalette({ onAddWidget, onClear }: WidgetPaletteProps) {
  return (
    <aside className="flex w-64 flex-col border-r bg-card">
      <div className="space-y-1 p-4">
        <h3 className="text-lg font-semibold">Widget Library</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to your canvas
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          defaultValue={['charts', 'tables', 'kpis']}
          className="w-full"
        >
          {widgetGroups.map(group => (
            <AccordionItem value={group.value} key={group.value} className="border-none">
              <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">
                {group.title}
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="flex flex-col gap-1 px-2">
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
      </div>
      <div className="mt-auto p-2">
        <Separator className="my-2" />
        <Button variant="destructive" className="w-full justify-start" onClick={onClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Data
        </Button>
      </div>
    </aside>
  );
}
