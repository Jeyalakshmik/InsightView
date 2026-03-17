'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useData } from '@/context/DataContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { COUNTRIES, PRODUCTS, CREATORS, PRODUCT_PRICES } from '@/lib/data';
import type { CustomerOrder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const orderSchema = z.object({
  firstName: z.string().min(1, 'Please fill the field'),
  lastName: z.string().min(1, 'Please fill the field'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Please fill the field'),
  address: z.string().min(1, 'Please fill the field'),
  city: z.string().min(1, 'Please fill the field'),
  state: z.string().min(1, 'Please fill the field'),
  postalCode: z.string().min(1, 'Please fill the field'),
  country: z.string().min(1, 'Please select a country'),
  product: z.string().min(1, 'Please select a product'),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number(),
  totalAmount: z.number(),
  status: z.enum(['Pending', 'In Progress', 'Completed']),
  createdBy: z.string().min(1, 'Please select a creator'),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
}

export function OrderForm({ isOpen, onClose, order }: OrderFormProps) {
  const { addOrder, updateOrder } = useData();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      quantity: 1,
      status: 'Pending',
    },
  });

  const product = watch('product');
  const quantity = watch('quantity');

  useEffect(() => {
    if (product) {
      const price = PRODUCT_PRICES[product] || 0;
      setValue('unitPrice', price);
      setValue('totalAmount', price * (quantity || 1));
    }
  }, [product, quantity, setValue]);

  useEffect(() => {
    if (order) {
      reset(order);
    } else {
      reset({
        firstName: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', postalCode: '',
        country: '', product: '', quantity: 1, unitPrice: 0, totalAmount: 0, status: 'Pending', createdBy: '',
      });
    }
  }, [order, reset, isOpen]);

  const onSubmit = (data: OrderFormData) => {
    if (order) {
      updateOrder({ ...data, id: order.id, orderDate: order.orderDate });
      toast({ title: "Order Updated", description: "The order has been successfully updated." });
    } else {
      addOrder({
        ...data,
        id: `ord-${Date.now()}`,
        orderDate: new Date().toISOString(),
      });
      toast({ title: "Order Created", description: "A new order has been successfully created." });
    }
    onClose();
  };

  const renderError = (field: keyof OrderFormData) =>
    errors[field] && (
      <p className="text-sm text-destructive">{errors[field]?.message}</p>
    );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? 'Edit Order' : 'Create Order'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ScrollArea className="h-[60vh] p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...register('firstName')} />
                {renderError('firstName')}
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...register('lastName')} />
                {renderError('lastName')}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...register('email')} />
                {renderError('email')}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register('phone')} />
                {renderError('phone')}
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2">
                <Label>Street Address</Label>
                <Input {...register('address')} />
                {renderError('address')}
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...register('city')} />
                {renderError('city')}
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...register('state')} />
                {renderError('state')}
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input {...register('postalCode')} />
                {renderError('postalCode')}
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {renderError('country')}
              </div>
              <div className="col-span-1 md:col-span-2 my-4 border-t" />
              <div className="space-y-2">
                <Label>Product</Label>
                <Controller
                  name="product"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                      <SelectContent>
                        {PRODUCTS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {renderError('product')}
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" {...register('quantity')} min={1} />
                {renderError('quantity')}
              </div>
              <div className="space-y-2">
                <Label>Unit Price</Label>
                <Input {...register('unitPrice')} readOnly disabled />
              </div>
              <div className="space-y-2">
                <Label>Total Amount</Label>
                <Input {...register('totalAmount')} readOnly disabled />
              </div>
               <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label>Created By</Label>
                <Controller
                  name="createdBy"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue placeholder="Select creator" /></SelectTrigger>
                      <SelectContent>
                        {CREATORS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                 {renderError('createdBy')}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
