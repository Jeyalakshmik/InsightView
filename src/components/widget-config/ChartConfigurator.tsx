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
  'country',
];
const COLORS = ['#2268CC', '#1CBFDB', '#8884d8', '#82ca9d', '#ffc658'];

const chartConfigSchema = z.object({
  title: z.string().min(1, 'Please fill the field'),
  description: z.string().optional(),
  w: z.coerce.number().int().min(1, 'Width must be at least 1'),
  h: z.coerce.number().int().min(1, 'Height must be at least 1'),
  xAxis: z.string().min(1, 'Please select an X-axis'),
  yAxis: z.string().min(1, 'Please select a Y-axis'),
  color: z.string().optional(),
  showLabel: z.boolean().optional(),
});

type ChartFormValues = z.infer<typeof chartConfigSchema>;

export function ChartConfigurator({
  widget,
  onSave,
  onClose,
}: ChartConfiguratorProps) {
  const form = useForm<ChartFormValues>({
    resolver: zodResolver(chartConfigSchema),
    defaultValues: {
      title: (widget.config as ChartConfig).title || 'Untitled',
      description: (widget.config as ChartConfig).description || '',
      w: widget.w,
      h: widget.h,
      xAxis: (widget.config as ChartConfig).xAxis || '',
      yAxis: (widget.config as ChartConfig).yAxis || '',
      color: (widget.config as ChartConfig).color || COLORS[0],
      showLabel: (widget.config as ChartConfig).showLabel ?? true,
    },
  });

  useEffect(() => {
    form.reset({
      title: (widget.config as ChartConfig).title || 'Untitled',
      description: (widget.config as ChartConfig).description || '',
      w: widget.w,
      h: widget.h,
      xAxis: (widget.config as ChartConfig).xAxis || '',
      yAxis: (widget.config as ChartConfig).yAxis || '',
      color: (widget.config as ChartConfig).color || COLORS[0],
      showLabel: (widget.config as ChartConfig).showLabel ?? true,
    });
  }, [widget, form]);

  const onSubmit = (values: ChartFormValues) => {
    const newConfig: ChartConfig = {
      ...values,
      xAxis: values.xAxis as keyof CustomerOrder,
      yAxis: values.yAxis as keyof CustomerOrder,
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
                <Input placeholder="New Chart" {...field} />
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
            name="xAxis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X-Axis <span className="text-destructive">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select X-axis data" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AXIS_OPTIONS.map(option => (
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
            name="yAxis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Y-Axis <span className="text-destructive">*</span></FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y-axis data" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AXIS_OPTIONS.map(option => (
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chart Color</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {COLORS.map(color => (
                    <button
                      type="button"
                      key={color}
                      className="h-8 w-8 rounded-full"
                      style={{
                        backgroundColor: color,
                        border:
                          field.value === color
                            ? '3px solid hsl(var(--ring))'
                            : '1px solid hsl(var(--border))',
                      }}
                      onClick={() => field.onChange(color)}
                    />
                  ))}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
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
                  Display labels on the chart axes.
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
