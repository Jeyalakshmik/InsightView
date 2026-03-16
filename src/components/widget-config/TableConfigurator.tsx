'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { DashboardWidget, TableConfig, CustomerOrder } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface TableConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: TableConfig) => void;
  onClose: () => void;
}

const COLUMN_OPTIONS: (keyof CustomerOrder)[] = [
  'id', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'product', 'quantity', 'unitPrice', 'totalAmount', 'status', 'createdBy', 'orderDate'
];

export function TableConfigurator({ widget, onSave, onClose }: TableConfiguratorProps) {
  const [config, setConfig] = useState(widget.config as TableConfig);

  const handleColumnChange = (column: keyof CustomerOrder) => {
    const currentColumns = config.columns || [];
    const newColumns = currentColumns.includes(column)
      ? currentColumns.filter(c => c !== column)
      : [...currentColumns, column];
    setConfig({ ...config, columns: newColumns });
  };

  const handleSave = () => {
    onSave(widget.id, config);
    onClose();
  };

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
        <Label>Columns</Label>
        <ScrollArea className="h-48 rounded-md border p-2">
            <div className="space-y-2">
                {COLUMN_OPTIONS.map(option => (
                <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                    id={`col-${option}`}
                    checked={config.columns?.includes(option)}
                    onCheckedChange={() => handleColumnChange(option)}
                    />
                    <Label htmlFor={`col-${option}`} className="font-normal">{option}</Label>
                </div>
                ))}
            </div>
        </ScrollArea>
      </div>
      <div>
        <Label>Rows per page</Label>
        <RadioGroup 
            value={String(config.rowsPerPage || 5)} 
            onValueChange={value => setConfig({ ...config, rowsPerPage: parseInt(value, 10) as 5 | 10 | 15 })}
            className="flex gap-4"
        >
            {[5, 10, 15].map(val => (
                <div key={val} className="flex items-center space-x-2">
                    <RadioGroupItem value={String(val)} id={`rows-${val}`} />
                    <Label htmlFor={`rows-${val}`} className="font-normal">{val}</Label>
                </div>
            ))}
        </RadioGroup>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
