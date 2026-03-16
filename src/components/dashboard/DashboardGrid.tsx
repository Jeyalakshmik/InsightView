'use client';
import { WidgetWrapper } from './WidgetWrapper';
import type { DashboardWidget, CustomerOrder } from '@/lib/types';
import { ChartWidget } from '../widgets/ChartWidget';
import { KpiCard } from '../widgets/KpiCard';
import { TableWidget } from '../widgets/TableWidget';

interface DashboardGridProps {
  widgets: DashboardWidget[];
  onLayoutChange: (layout: DashboardWidget[]) => void;
  onDelete: (widgetId: string) => void;
  onConfigure: (widget: DashboardWidget) => void;
  isConfigMode: boolean;
  orders: CustomerOrder[];
}

export function DashboardGrid({
  widgets,
  onDelete,
  onConfigure,
  isConfigMode,
  orders,
}: DashboardGridProps) {
  const renderWidget = (widget: DashboardWidget) => {
    switch (widget.type) {
      case 'kpi':
        return <KpiCard orders={orders} config={widget.config as any} />;
      case 'table':
        return <TableWidget orders={orders} config={widget.config as any} />;
      case 'bar':
      case 'line':
      case 'area':
      case 'scatter':
      case 'pie':
        return <ChartWidget orders={orders} type={widget.type} config={widget.config as any} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <div
      className="grid grid-cols-12 gap-4"
    >
      {widgets.map(widget => (
        <WidgetWrapper
          key={widget.id}
          widget={widget}
          onDelete={onDelete}
          onConfigure={onConfigure}
          isConfigMode={isConfigMode}
          style={{
            gridColumn: `span ${widget.w}`,
            gridRow: `span ${widget.h}`,
            minHeight: `${widget.h * 2}rem`, // Basic height control
          }}
        >
          {renderWidget(widget)}
        </WidgetWrapper>
      ))}
    </div>
  );
}
