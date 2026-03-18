'use client';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { WidgetWrapper } from './WidgetWrapper';
import type { DashboardWidget, CustomerOrder } from '@/lib/types';
import { ChartWidget } from '../widgets/ChartWidget';
import { KpiCard } from '../widgets/KpiCard';
import { TableWidget } from '../widgets/TableWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  widgets: DashboardWidget[];
  onLayoutChange: (layout: DashboardWidget[]) => void;
  onDelete: (widget: DashboardWidget) => void;
  onConfigure: (widget: DashboardWidget) => void;
  isConfigMode: boolean;
  orders: CustomerOrder[];
}

export function DashboardGrid({
  widgets,
  onLayoutChange,
  onDelete,
  onConfigure,
  isConfigMode,
  orders,
}: DashboardGridProps) {
  const layout = widgets.map(w => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
  }));

  const handleLayoutChange = (newLayout: ReactGridLayout.Layout[]) => {
    const updatedWidgets = widgets.map(widget => {
      const layoutItem = newLayout.find(item => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      }
      return widget;
    });
    onLayoutChange(updatedWidgets);
  };

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
    <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={30}
      onLayoutChange={handleLayoutChange}
      isDraggable={isConfigMode}
      isResizable={isConfigMode}
      draggableHandle=".cursor-grab"
    >
      {widgets.map(widget => (
        <div key={widget.id} className={widget.type === 'kpi' ? 'kpi-widget' : ''}>
          <WidgetWrapper
            widget={widget}
            onDelete={onDelete}
            onConfigure={onConfigure}
            isConfigMode={isConfigMode}
          >
            {renderWidget(widget)}
          </WidgetWrapper>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
}
