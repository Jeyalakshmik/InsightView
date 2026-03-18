'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CustomerOrder } from '@/lib/types';
import { useMemo } from 'react';

interface PendingOrdersProps {
  orders: CustomerOrder[];
}

export function PendingOrders({ orders }: PendingOrdersProps) {
  const pendingOrders = useMemo(
    () => orders.filter(order => order.status === 'Pending'),
    [orders]
  );

  if (pendingOrders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Orders</CardTitle>
          <CardDescription>
            No pending orders at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            When new orders that are pending appear, they will be listed here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Orders</CardTitle>
        <CardDescription>
          A list of orders that are currently pending.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Total amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(order.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
