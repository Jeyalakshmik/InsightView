'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import type { DashboardWidget, TableConfig, CustomerOrder } from '@/lib/types';

interface TableConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: TableConfig) => void;
  onClose: () => void;
}

const COLUMN_OPTIONS: (keyof CustomerOrder)[] = [
  'id',
  'firstName',
  'lastName',
  'email',
  'phone',
  'address',
  'city',
  'state',
  'postalCode',
  'country',
  'product',
  'quantity',
  'unitPrice',
  'totalAmount',
  'status',
  'createdBy',
  'orderDate',
];

const tableConfigSchema = z.object({
  title: z.string().min(1, 'Please fill the field'),
  description: z.string().optional(),
  w: z.coerce.number().int().min(1, 'Width must be at least 1'),
  h: z.coerce.number().int().min(1, 'Height must be at least 1'),
  columns: z.array(z.string()).min(1, 'Please select at least one column'),
  rowsPerPage: z.coerce.number(),
});

type TableFormValues = z.infer<typeof tableConfigSchema>;

export function TableConfigurator({
  widget,
  onSave,
  onClose,
}: TableConfiguratorProps) {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableConfigSchema),
    defaultValues: {
      title: (widget.config as TableConfig).title || 'Untitled',
      description: (widget.config as TableConfig).description || '',
      w: widget.w,
      h: widget.h,
      columns: (widget.config as TableConfig).columns || [],
      rowsPerPage: (widget.config as TableConfig).rowsPerPage || 5,
    },
  });

  useEffect(() => {
    form.reset({
      title: (widget.config as TableConfig).title || 'Untitled',
      description: (widget.config as TableConfig).description || '',
      w: widget.w,
      h: widget.h,
      columns: (widget.config as TableConfig).columns || [],
      rowsPerPage: (widget.config as TableConfig).rowsPerPage || 5,
    });
  }, [widget, form]);

  const onSubmit = (values: TableFormValues) => {
    const newConfig: TableConfig = {
      ...values,
      columns: values.columns as (keyof CustomerOrder)[],
      rowsPerPage: values.rowsPerPage as 5 | 10 | 15,
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
                <Input placeholder="New Table" {...field} />
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

        <FormField
          control={form.control}
          name="columns"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Columns *</FormLabel>
                <FormDescription>
                  Select the columns to display in the table.
                </FormDescription>
              </div>
              <ScrollArea className="h-48 rounded-md border p-4">
                {COLUMN_OPTIONS.map(item => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="columns"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={checked => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        value => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rowsPerPage"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Rows per page *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                  className="flex flex-row space-x-2"
                >
                  {[5, 10, 15].map(val => (
                    <FormItem
                      key={val}
                      className="flex items-center space-x-2 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={String(val)} />
                      </FormControl>
                      <FormLabel className="font-normal">{val}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
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
