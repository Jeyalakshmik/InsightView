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
import { useToast } from '@/hooks/use-toast';

interface ClearDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClearDataDialog({ isOpen, onClose }: ClearDataDialogProps) {
  const { clearAllOrders } = useData();
  const { toast } = useToast();

  const handleClear = () => {
    clearAllOrders();
    toast({ title: "All Data Cleared", description: "All order data has been removed.", variant: "destructive" });
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all customer order data from your local browser storage.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClear}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
