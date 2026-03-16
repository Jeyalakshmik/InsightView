'use client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { DashboardWidget } from '@/lib/types';
import { Settings, Trash2, GripVertical } from 'lucide-react';

interface WidgetWrapperProps {
  widget: DashboardWidget;
  children: React.ReactNode;
  onDelete: (widgetId: string) => void;
  onConfigure: (widget: DashboardWidget) => void;
  isConfigMode: boolean;
  style?: React.CSSProperties;
}

export function WidgetWrapper({
  widget,
  children,
  onDelete,
  onConfigure,
  isConfigMode,
  style,
}: WidgetWrapperProps) {
  return (
    <div style={style}>
      <Card className="h-full w-full flex flex-col group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
          <CardTitle className="text-base font-medium">
            {(widget.config as any).title || `Widget ${widget.id}`}
          </CardTitle>
          {isConfigMode && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onConfigure(widget)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => onDelete(widget.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-1">{children}</CardContent>
      </Card>
    </div>
  );
}
