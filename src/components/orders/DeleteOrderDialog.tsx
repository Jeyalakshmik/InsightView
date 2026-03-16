'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useData } from '@/context/DataContext';
import type { CustomerOrder } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface DeleteOrderDialogProps {
  order: CustomerOrder;
  onClose: () => void;
}

export function DeleteOrderDialog({ order, onClose }: DeleteOrderDialogProps) {
  const { deleteOrder } = useData();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteOrder(order.id);
    toast({ title: "Order Deleted", description: "The order has been successfully deleted.", variant: "destructive" });
    onClose();
  };

  return (
    <AlertDialog open={true} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order for{' '}
            <span className="font-semibold">{`${order.firstName} ${order.lastName}`}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
