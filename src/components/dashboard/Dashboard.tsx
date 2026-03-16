'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { WidgetPalette } from './WidgetPalette';
import { DashboardGrid } from './DashboardGrid';
import { ConfigSheet } from '../widget-config/ConfigSheet';
import { AiSummary } from './AiSummary';
import { useData } from '@/context/DataContext';
import { filterOrdersByDate } from '@/lib/utils';
import type {
  DashboardLayout,
  DashboardWidget,
  DateFilter,
  WidgetType,
} from '@/lib/types';
import {
  Save,
  Settings,
  X,
} from 'lucide-react';

const defaultLayout: DashboardLayout = { widgets: [] };
const DATE_FILTERS: DateFilter[] = ['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days'];

export function Dashboard() {
  const { orders } = useData();
  const [layout, setLayout] = useState<DashboardLayout>(defaultLayout);
  const [isConfigMode, setIsConfigMode] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>('All Time');
  const [configuringWidget, setConfiguringWidget] = useState<DashboardWidget | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLayout = localStorage.getItem('dashboardLayout');
    if (savedLayout) {
      setLayout(JSON.parse(savedLayout));
    } else {
        // If no layout, enter config mode
        setIsConfigMode(true);
    }
  }, []);

  const saveLayout = useCallback(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
    setIsConfigMode(false);
  }, [layout]);


  const addWidget = (type: WidgetType) => {
    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      type,
      x: 0,
      y: findNextAvailableY(layout),
      w: type === 'table' ? 12 : 4,
      h: 8,
      config: { title: `New ${type} Widget` } as any,
    };
    setLayout(prev => ({ ...prev, widgets: [...prev.widgets, newWidget] }));
  };

  const findNextAvailableY = (currentLayout: DashboardLayout) => {
    if (currentLayout.widgets.length === 0) return 0;
    const bottomMostWidget = currentLayout.widgets.reduce((prev, curr) => {
        return (prev.y + prev.h > curr.y + curr.h) ? prev : curr;
    });
    return bottomMostWidget.y + bottomMostWidget.h;
  }

  const deleteWidget = (widgetId: string) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId),
    }));
  };

  const updateWidgetConfig = (widgetId: string, newConfig: any) => {
    setLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...newConfig } } : w
      ),
    }));
  };

   const handleLayoutChange = (newWidgets: DashboardWidget[]) => {
    setLayout({ widgets: newWidgets });
  };

  const filteredOrders = filterOrdersByDate(orders, dateFilter);

  if (!isClient) return null;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-card p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Select
            value={dateFilter}
            onValueChange={(value: DateFilter) => setDateFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              {DATE_FILTERS.map(filter => (
                <SelectItem key={filter} value={filter}>
                  {filter}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AiSummary filteredOrders={filteredOrders} dateFilter={dateFilter} />
          {isConfigMode ? (
            <>
            <Button onClick={saveLayout}><Save className="mr-2 h-4 w-4"/>Save</Button>
            <Button variant="outline" onClick={() => setIsConfigMode(false)}><X className="mr-2 h-4 w-4"/>Cancel</Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => setIsConfigMode(true)}>
              <Settings className="mr-2 h-4 w-4"/>
              Configure
            </Button>
          )}
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {isConfigMode && <WidgetPalette onAddWidget={addWidget} />}
        <main className="flex-1 overflow-y-auto p-4">
          {layout.widgets.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed">
              <div className="text-center">
                <h2 className="text-xl font-semibold">Your Dashboard is Empty</h2>
                <p className="text-muted-foreground">
                    {isConfigMode ? "Drag widgets from the left panel to start." : "Click 'Configure' to add widgets."}
                </p>
              </div>
            </div>
          ) : (
            <DashboardGrid
              widgets={layout.widgets}
              onLayoutChange={handleLayoutChange}
              onDelete={deleteWidget}
              onConfigure={setConfiguringWidget}
              isConfigMode={isConfigMode}
              orders={filteredOrders}
            />
          )}
        </main>
      </div>
      <ConfigSheet
        widget={configuringWidget}
        onClose={() => setConfiguringWidget(null)}
        onSave={updateWidgetConfig}
      />
    </div>
  );
}
