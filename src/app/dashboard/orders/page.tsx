'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrderTable } from '@/components/orders/OrderTable';
import { OrderForm } from '@/components/orders/OrderForm';
import { PlusCircle } from 'lucide-react';
import type { CustomerOrder } from '@/lib/types';

export default function OrdersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<CustomerOrder | null>(null);

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
    <div className="flex h-full flex-col">
      <header className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customer Orders</h1>
          <Button onClick={handleCreateNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <OrderTable onEdit={handleEdit} />
      </main>
      <OrderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        order={editingOrder}
      />
    </div>
  );
}
