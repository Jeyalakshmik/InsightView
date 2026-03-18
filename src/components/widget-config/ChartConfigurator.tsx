'use client';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DashboardWidget, ChartConfig, CustomerOrder } from '@/lib/types';

interface ChartConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: ChartConfig) => void;
  onClose: () => void;
}

const AXIS_OPTIONS: (keyof CustomerOrder)[] = [
  'product',
  'quantity',
  'unitPrice',
  'totalAmount',
  'status',
  'createdBy',
  'orderDate',
  'country'
];
const COLORS = ['#2268CC', '#1CBFDB', '#8884d8', '#82ca9d', '#ffc658'];

export function ChartConfigurator({ widget, onSave, onClose }: ChartConfiguratorProps) {
  const [config, setConfig] = useState(widget.config as ChartConfig);

  useEffect(() => {
    setConfig(widget.config as ChartConfig);
  }, [widget]);

  const handleSave = () => {
    onSave(widget.id, config);
    onClose();
  };

  const isCreating = widget.id.startsWith('new-widget-');

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Widget Title</Label>
        <Input
          id="title"
          value={config.title || ''}
          onChange={e => setConfig({ ...config, title: e.target.value })}
        />
      </div>
      <div>
        <Label>X-Axis</Label>
        <Select
          value={config.xAxis}
          onValueChange={value => setConfig({ ...config, xAxis: value as keyof CustomerOrder })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select X-axis data" />
          </SelectTrigger>
          <SelectContent>
            {AXIS_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Y-Axis</Label>
        <Select
          value={config.yAxis}
          onValueChange={value => setConfig({ ...config, yAxis: value as keyof CustomerOrder })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Y-axis data" />
          </SelectTrigger>
          <SelectContent>
            {AXIS_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Chart Color</Label>
        <div className="flex gap-2">
            {COLORS.map(color => (
                <button
                    key={color}
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: color, border: config.color === color ? '2px solid black' : 'none' }}
                    onClick={() => setConfig({ ...config, color })}
                />
            ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{isCreating ? 'Add Widget' : 'Save Changes'}</Button>
      </div>
    </div>
  );
}
