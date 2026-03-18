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
import type { DashboardWidget, KpiConfig, CustomerOrder } from '@/lib/types';

interface KpiConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: KpiConfig) => void;
  onClose: () => void;
}

const METRIC_OPTIONS: (keyof CustomerOrder)[] = ['quantity', 'unitPrice', 'totalAmount'];
const AGGREGATION_OPTIONS = ['sum', 'average', 'count'];

export function KpiConfigurator({ widget, onSave, onClose }: KpiConfiguratorProps) {
  const [config, setConfig] = useState(widget.config as KpiConfig);

  useEffect(() => {
    setConfig(widget.config as KpiConfig);
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
        <Label>Metric</Label>
        <Select
          value={config.metric}
          onValueChange={value => setConfig({ ...config, metric: value as keyof CustomerOrder })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a metric" />
          </SelectTrigger>
          <SelectContent>
            {METRIC_OPTIONS.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Aggregation</Label>
        <Select
          value={config.aggregation}
          onValueChange={value =>
            setConfig({ ...config, aggregation: value as 'sum' | 'average' | 'count' })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aggregation" />
          </SelectTrigger>
          <SelectContent>
            {AGGREGATION_OPTIONS.map(option => (
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
