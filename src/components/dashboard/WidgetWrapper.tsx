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
}

export function WidgetWrapper({
  widget,
  children,
  onDelete,
  onConfigure,
  isConfigMode,
}: WidgetWrapperProps) {
  const handleConfigureClick = () => {
    onConfigure(widget);
  };

  const handleDeleteClick = () => {
    onDelete(widget.id);
  };

  // Prevent the drag-and-drop library from capturing the click
  const stopEventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="h-full">
      <Card className="group flex h-full w-full flex-col transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-[1.01]">
        <CardHeader
          className={`flex flex-row items-center justify-between space-y-0 p-4 ${
            isConfigMode ? 'cursor-grab' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            {isConfigMode && (
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            )}
            <CardTitle className="text-base font-medium">
              {(widget.config as any).title || `Widget ${widget.id}`}
            </CardTitle>
          </div>
          {isConfigMode && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer"
                onMouseDown={stopEventPropagation}
                onClick={handleConfigureClick}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 cursor-pointer text-destructive hover:text-destructive"
                onMouseDown={stopEventPropagation}
                onClick={handleDeleteClick}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="flex-1 p-4 pt-0">{children}</CardContent>
      </Card>
    </div>
  );
}
