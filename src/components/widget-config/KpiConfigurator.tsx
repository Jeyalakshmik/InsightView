'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type {
  DashboardWidget,
  KpiConfig,
  CustomerOrder,
  KpiDataFormat,
} from '@/lib/types';

interface KpiConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: KpiConfig) => void;
  onClose: () => void;
}

const METRIC_OPTIONS: (keyof CustomerOrder)[] = [
  'quantity',
  'unitPrice',
  'totalAmount',
];
const AGGREGATION_OPTIONS = ['sum', 'average', 'count'];
const DATAFORMAT_OPTIONS: KpiDataFormat[] = [
  'Number',
  'Currency',
  'Percentage',
];

const kpiConfigSchema = z.object({
  title: z.string().min(1, 'Please fill the field'),
  description: z.string().optional(),
  w: z.coerce.number().int().min(1, 'Width must be at least 1'),
  h: z.coerce.number().int().min(1, 'Height must be at least 1'),
  metric: z.string().min(1, 'Please select a metric'),
  aggregation: z.string().min(1, 'Please select an aggregation'),
  dataFormat: z.string().min(1, 'Please select a format'),
  decimalPrecision: z.coerce.number().int().min(0, 'Cannot be negative'),
});

type KpiFormValues = z.infer<typeof kpiConfigSchema>;

export function KpiConfigurator({
  widget,
  onSave,
  onClose,
}: KpiConfiguratorProps) {
  const form = useForm<KpiFormValues>({
    resolver: zodResolver(kpiConfigSchema),
    defaultValues: {
      title: widget.config.title || '',
      description: (widget.config as KpiConfig).description || '',
      w: widget.w,
      h: widget.h,
      metric: (widget.config as KpiConfig).metric || '',
      aggregation: (widget.config as KpiConfig).aggregation || '',
      dataFormat: (widget.config as KpiConfig).dataFormat || 'Number',
      decimalPrecision: (widget.config as KpiConfig).decimalPrecision || 0,
    },
  });

  useEffect(() => {
    form.reset({
      title: widget.config.title || '',
      description: (widget.config as KpiConfig).description || '',
      w: widget.w,
      h: widget.h,
      metric: (widget.config as KpiConfig).metric || '',
      aggregation: (widget.config as KpiConfig).aggregation || '',
      dataFormat: (widget.config as KpiConfig).dataFormat || 'Number',
      decimalPrecision: (widget.config as KpiConfig).decimalPrecision || 0,
    });
  }, [widget, form]);

  const onSubmit = (values: KpiFormValues) => {
    const newConfig: KpiConfig = {
      ...values,
      metric: values.metric as keyof CustomerOrder,
      aggregation: values.aggregation as 'sum' | 'average' | 'count',
      dataFormat: values.dataFormat as KpiDataFormat,
    };
    onSave(widget.id, newConfig);
    onClose();
  };

  const isCreating = widget.id.startsWith('new-widget-');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Widget title *</FormLabel>
              <FormControl>
                <Input placeholder="Total orders" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Widget type *</FormLabel>
          <FormControl>
            <Input disabled value="KPI" />
          </FormControl>
        </FormItem>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the widget." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Widget size</legend>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="w"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (Columns) *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="h"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (Rows) *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Data setting</legend>
          <FormField
            control={form.control}
            name="metric"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select metric *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a metric" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {METRIC_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="aggregation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Aggregation *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select aggregation" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AGGREGATION_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dataFormat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data format *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DATAFORMAT_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="decimalPrecision"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Decimal Precision *</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isCreating ? 'Add Widget' : 'Save'}</Button>
        </div>
      </form>
    </Form>
  );
}
