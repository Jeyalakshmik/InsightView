'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { CustomerOrder } from '@/lib/types';
import { DeleteOrderDialog } from './DeleteOrderDialog';

interface OrderTableProps {
  onEdit: (order: CustomerOrder) => void;
}

const ROWS_PER_PAGE = 10;

export function OrderTable({ onEdit }: OrderTableProps) {
  const { orders } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingOrder, setDeletingOrder] = useState<CustomerOrder | null>(null);

  const totalPages = Math.ceil(orders.length / ROWS_PER_PAGE);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const getCustomerId = (order: CustomerOrder, index: number) => {
    // Creating a customer ID for display, as it's not in the data model.
    return `CUST-${String(index + 1).padStart(4, '0')}`;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.no</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Customer name</TableHead>
              <TableHead>Email Id</TableHead>
              <TableHead>Phone number</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Order date</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order, index) => (
              <TableRow key={order.id}>
                <TableCell>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</TableCell>
                <TableCell>{getCustomerId(order, (currentPage - 1) * ROWS_PER_PAGE + index)}</TableCell>
                <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{`${order.address}, ${order.city}, ${order.state}, ${order.country}`}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(order)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeletingOrder(order)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
      {deletingOrder && (
        <DeleteOrderDialog
          order={deletingOrder}
          onClose={() => setDeletingOrder(null)}
        />
      )}
    </div>
  );
}
