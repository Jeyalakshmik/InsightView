'use client';
import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MultiSelectOption } from '@/components/ui/MultiSelect';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { DashboardWidget, TableConfig, CustomerOrder, TableFilterOperator } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface TableConfiguratorProps {
  widget: DashboardWidget;
  onSave: (widgetId: string, newConfig: TableConfig) => void;
  onClose: () => void;
}

const COLUMN_OPTIONS: MultiSelectOption[] = [
    { value: 'id', label: 'Customer ID' },
    { value: 'firstName', label: 'First Name' },
    { value: 'lastName', label: 'Last Name' },
    { value: 'email', label: 'Email' },
    { value: 'address', label: 'Address' },
    { value: 'orderDate', label: 'Order Date' },
    { value: 'product', label: 'Product' },
    { value: 'createdBy', label: 'Created By' },
    { value: 'status', label: 'Status' },
    { value: 'totalAmount', label: 'Total Amount' },
    { value: 'unitPrice', label: 'Unit Price' },
    { value: 'quantity', label: 'Quantity' },
];

const FILTER_ATTRIBUTE_OPTIONS: (keyof CustomerOrder)[] = ['product', 'quantity', 'status'];
const FILTER_OPERATOR_OPTIONS: TableFilterOperator[] = ['=', '!=', '>', '>=', '<', '<=', 'contains'];

const tableConfigSchema = z.object({
  title: z.string().min(1, 'Please fill the field'),
  description: z.string().optional(),
  w: z.coerce.number().int().min(1, 'Width must be at least 1'),
  h: z.coerce.number().int().min(1, 'Height must be at least 1'),
  columns: z.array(z.string()).min(1, 'Please select at least one column'),
  rowsPerPage: z.coerce.number(),
  sortBy: z.string().optional(),
  sortDirection: z.string().optional(),
  applyFilters: z.boolean().optional(),
  filters: z.array(z.object({
    attribute: z.string().min(1, "Required"),
    operator: z.string().min(1, "Required"),
    value: z.union([z.string(), z.number()]),
  })).optional(),
  fontSize: z.coerce.number().int().min(12).max(20).optional(),
  headerBackgroundColor: z.string().optional(),
});

type TableFormValues = z.infer<typeof tableConfigSchema>;

export function TableConfigurator({
  widget,
  onSave,
  onClose,
}: TableConfiguratorProps) {
  const config = widget.config as TableConfig;

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableConfigSchema),
    defaultValues: {
      title: config.title || 'Untitled',
      description: config.description || '',
      w: widget.w,
      h: widget.h,
      columns: config.columns || [],
      rowsPerPage: config.rowsPerPage || 5,
      sortBy: config.sortBy,
      sortDirection: config.sortDirection,
      applyFilters: config.applyFilters || false,
      filters: config.filters || [],
      fontSize: config.fontSize || 14,
      headerBackgroundColor: config.headerBackgroundColor || '#D8D8D8',
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "filters",
  });

  const watchApplyFilters = form.watch('applyFilters');
  const watchColumns = form.watch('columns');

  useEffect(() => {
    const config = widget.config as TableConfig;
    form.reset({
      title: config.title || 'Untitled',
      description: config.description || '',
      w: widget.w,
      h: widget.h,
      columns: config.columns || [],
      rowsPerPage: config.rowsPerPage || 5,
      sortBy: config.sortBy,
      sortDirection: config.sortDirection,
      applyFilters: config.applyFilters || false,
      filters: config.filters || [],
      fontSize: config.fontSize || 14,
      headerBackgroundColor: config.headerBackgroundColor || '#D8D8D8',
    });
  }, [widget, form]);

  const onSubmit = (values: TableFormValues) => {
    const newConfig: TableConfig = {
      ...values,
      columns: values.columns as (keyof CustomerOrder)[],
      rowsPerPage: values.rowsPerPage as 5 | 10 | 15,
      filters: values.filters as any,
      sortBy: values.sortBy as keyof CustomerOrder,
      sortDirection: values.sortDirection as 'asc' | 'desc',
    };
    onSave(widget.id, newConfig);
    onClose();
  };

  const isCreating = widget.id.startsWith('new-widget-');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-full flex flex-col">
        <Tabs defaultValue="data" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data" className="data-[state=active]:bg-primary/80">Data</TabsTrigger>
            <TabsTrigger value="styling" className="data-[state=active]:bg-primary/80">Styling</TabsTrigger>
          </TabsList>
          <ScrollArea className="flex-1">
            <div className="pr-6">
              <TabsContent value="data" className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Widget title <span className="text-destructive">*</span></FormLabel>
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
                          <Textarea placeholder="A brief description of the widget." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">Widget size</legend>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField control={form.control} name="w" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Width (Columns) <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField control={form.control} name="h" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (Rows) <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="space-y-4">
                    <legend className="text-base font-medium">Data setting</legend>
                    <FormField
                      control={form.control}
                      name="columns"
                      render={() => (
                        <FormItem>
                          <FormLabel>Choose columns <span className="text-destructive">*</span></FormLabel>
                           <ScrollArea className="h-40 rounded-md border p-4">
                            {COLUMN_OPTIONS.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="columns"
                                render={({ field }) => {
                                  return (
                                    <FormItem key={option.value} className="flex flex-row items-center space-x-3 space-y-0 mb-2">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            const newColumns = checked
                                              ? [...field.value, option.value]
                                              : field.value?.filter(
                                                  (value) => value !== option.value
                                                );
                                            field.onChange(newColumns);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </ScrollArea>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="sortBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sort by</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select column" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {watchColumns.map(c => {
                                                const columnLabel = (
                                                    COLUMN_OPTIONS.find(o => o.value === c) || {
                                                        label: c,
                                                    }
                                                ).label;
                                                return (
                                                    <SelectItem key={c} value={c}>
                                                        {columnLabel}
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sortDirection"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>&nbsp;</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Direction" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="asc">Ascending</SelectItem>
                                            <SelectItem value="desc">Descending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField control={form.control} name="rowsPerPage" render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Pagination <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={String(field.value)} className="flex flex-row space-x-2">
                                    {[5, 10, 15].map(val => (
                                        <FormItem key={val} className="flex items-center space-x-2 space-y-0">
                                            <FormControl><RadioGroupItem value={String(val)} /></FormControl>
                                            <FormLabel className="font-normal">{val}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="applyFilters" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <FormLabel className="font-normal">Apply filter</FormLabel>
                        </FormItem>
                    )} />
                    {watchApplyFilters && (
                        <div className="space-y-4 rounded-md border p-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2">
                                    <FormField control={form.control} name={`filters.${index}.attribute`} render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Attribute</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Attribute" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {FILTER_ATTRIBUTE_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}/>
                                    <FormField control={form.control} name={`filters.${index}.operator`} render={({ field }) => (
                                        <FormItem className="w-24">
                                            <FormLabel>Operator</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Op" /></SelectTrigger></FormControl>
                                                <SelectContent>
                                                    {FILTER_OPERATOR_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}/>
                                     <FormField control={form.control} name={`filters.${index}.value`} render={({ field }) => (
                                        <FormItem  className="flex-1">
                                            <FormLabel>Value</FormLabel>
                                            <FormControl><Input placeholder="Value" {...field} /></FormControl>
                                        </FormItem>
                                     )} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" size="sm" variant="outline" onClick={() => append({ attribute: 'product', operator: '=', value: '' })}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Filter
                            </Button>
                        </div>
                    )}
                  </fieldset>
              </TabsContent>
              <TabsContent value="styling" className="mt-4 space-y-4">
                <FormField control={form.control} name="fontSize" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font size (px)</FormLabel>
                      <FormControl><Input type="number" min={12} max={20} {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField control={form.control} name="headerBackgroundColor" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Header background</FormLabel>
                      <FormControl><Input type="color" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
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
