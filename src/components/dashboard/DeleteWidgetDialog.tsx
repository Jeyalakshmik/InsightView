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
import type { DashboardWidget } from '@/lib/types';

interface DeleteWidgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  widget: DashboardWidget;
}

export function DeleteWidgetDialog({
  isOpen,
  onClose,
  onConfirm,
  widget,
}: DeleteWidgetDialogProps) {
  const widgetTitle = (widget.config as any)?.title || 'Untitled widget';

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the "{widgetTitle}" widget?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
