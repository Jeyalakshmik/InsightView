'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/orders/OrderTable';
import { OrderForm } from '@/components/orders/OrderForm';
import { PlusCircle, Search, LayoutDashboard, Table as TableIcon } from 'lucide-react';
import type { CustomerOrder } from '@/lib/types';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/DataContext';

export default function OrdersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<CustomerOrder | null>(null);
  const { orders } = useData();

  const handleCreateNew = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order: CustomerOrder) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Customer Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders and details</p>
      </header>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Link>
            </Button>
            <Button variant="secondary" size="sm">
                <TableIcon className="mr-2 h-4 w-4" />Table
            </Button>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search" className="pl-8" />
            </div>
            <Button onClick={handleCreateNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Order
            </Button>
        </div>
      </div>

      <main className="flex-1 flex flex-col">
        {orders && orders.length > 0 ? (
          <OrderTable onEdit={handleEdit} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
                <TableIcon className="mx-auto h-16 w-16 text-muted-foreground/50" />
                <h2 className="mt-4 text-xl font-semibold">No Orders Yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Click Create Order and enter your order information
                </p>
                <Button variant="default" className="mt-6" onClick={handleCreateNew}>
                    Create order
                </Button>
            </div>
          </div>
        )}
      </main>
      <OrderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        order={editingOrder}
      />
    </div>
  );
}
