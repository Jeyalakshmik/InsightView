'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
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
import { Checkbox } from '@/components/ui/checkbox';
import type {
  DashboardWidget,
  PieChartConfig,
  CustomerOrder,
} from '@/lib/types';

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

const pieChartConfigSchema = z.object({
  title: z.string().min(1, 'Please fill the field'),
  description: z.string().optional(),
  w: z.coerce.number().int().min(1, 'Width must be at least 1'),
  h: z.coerce.number().int().min(1, 'Height must be at least 1'),
  dataKey: z.string().min(1, 'Please select a data field'),
  showLabel: z.boolean().optional(),
});

type PieChartFormValues = z.infer<typeof pieChartConfigSchema>;

export function PieChartConfigurator({
  widget,
  onSave,
  onClose,
}: PieChartConfiguratorProps) {
  const form = useForm<PieChartFormValues>({
    resolver: zodResolver(pieChartConfigSchema),
    defaultValues: {
      title: (widget.config as PieChartConfig).title || 'Untitled',
      description: (widget.config as PieChartConfig).description || '',
      w: widget.w,
      h: widget.h,
      dataKey: (widget.config as PieChartConfig).dataKey || '',
      showLabel: (widget.config as PieChartConfig).showLabel ?? true,
    },
  });

  useEffect(() => {
    form.reset({
      title: (widget.config as PieChartConfig).title || 'Untitled',
      description: (widget.config as PieChartConfig).description || '',
      w: widget.w,
      h: widget.h,
      dataKey: (widget.config as PieChartConfig).dataKey || '',
      showLabel: (widget.config as PieChartConfig).showLabel ?? true,
    });
  }, [widget, form]);

  const onSubmit = (values: PieChartFormValues) => {
    const newConfig: PieChartConfig = {
      ...values,
      dataKey: values.dataKey as keyof CustomerOrder,
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
              <FormLabel>Widget title <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="New Pie Chart" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of the widget."
                  {...field}
                />
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
                  <FormLabel>Width (Columns) <span className="text-destructive">*</span></FormLabel>
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
                  <FormLabel>Height (Rows) <span className="text-destructive">*</span></FormLabel>
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
            name="dataKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chart Data Field <span className="text-destructive">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a data field" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DATA_KEY_OPTIONS.map(option => (
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
        </fieldset>
        
        <FormField
          control={form.control}
          name="showLabel"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Show Labels
                </FormLabel>
                <FormDescription>
                  Display labels on the pie chart slices.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isCreating ? 'Add Widget' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
