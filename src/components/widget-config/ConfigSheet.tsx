'use client';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { DashboardWidget } from '@/lib/types';
import { KpiConfigurator } from './KpiConfigurator';
import { ChartConfigurator } from './ChartConfigurator';
import { TableConfigurator } from './TableConfigurator';
import { PieChartConfigurator } from './PieChartConfigurator';

interface ConfigSheetProps {
  widget: DashboardWidget | null;
  onClose: () => void;
  onSave: (widgetId: string, newConfig: any) => void;
}

export function ConfigSheet({ widget, onClose, onSave }: ConfigSheetProps) {
  const renderConfigurator = () => {
    if (!widget) return null;

    switch (widget.type) {
      case 'kpi':
        return (
          <KpiConfigurator widget={widget} onSave={onSave} onClose={onClose} />
        );
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter':
        return (
          <ChartConfigurator widget={widget} onSave={onSave} onClose={onClose} />
        );
      case 'pie':
        return (
          <PieChartConfigurator widget={widget} onSave={onSave} onClose={onClose} />
        );
      case 'table':
        return (
          <TableConfigurator widget={widget} onSave={onSave} onClose={onClose} />
        );
      default:
        return <div>No configurator for this widget type.</div>;
    }
  };

  return (
    <Sheet open={!!widget} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure Widget</SheetTitle>
          <SheetDescription>
            Customize the settings for your widget.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">{renderConfigurator()}</div>
      </SheetContent>
    </Sheet>
  );
}
