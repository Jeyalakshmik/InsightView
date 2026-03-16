'use client';
import { useState } from 'react';
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
import type { DashboardWidget, PieChartConfig, CustomerOrder } from '@/lib/types';

interface PieChartConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: PieChartConfig) => void;
  onClose: () => void;
}

const DATA_KEY_OPTIONS: (keyof CustomerOrder)[] = [
  'product',
  'status',
  'createdBy',
  'country',
];

export function PieChartConfigurator({ widget, onSave, onClose }: PieChartConfiguratorProps) {
  const [config, setConfig] = useState(widget.config as PieChartConfig);

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
        <Label>Chart Data Field</Label>
        <Select
          value={config.dataKey}
          onValueChange={value => setConfig({ ...config, dataKey: value as keyof CustomerOrder })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a data field" />
          </SelectTrigger>
          <SelectContent>
            {DATA_KEY_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>{isCreating ? 'Add Widget' : 'Save Changes'}</Button>
      </div>
    </div>
  );
}
