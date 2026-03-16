'use client';
import { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import type { CustomerOrder, TableConfig } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';

interface TableWidgetProps {
  orders: CustomerOrder[];
  config: TableConfig;
}

const DEFAULT_COLUMNS: (keyof CustomerOrder)[] = ['id', 'firstName', 'product', 'totalAmount', 'status'];

export function TableWidget({ orders, config }: TableWidgetProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { columns = DEFAULT_COLUMNS, rowsPerPage = 5 } = config;

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return orders.slice(startIndex, startIndex + rowsPerPage);
  }, [orders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const formatHeader = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  return (
    <div className="h-full flex flex-col">
    <ScrollArea className="flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(key => (
              <TableHead key={key}>{formatHeader(key)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map(order => (
            <TableRow key={order.id}>
              {columns.map(key => (
                <TableCell key={key}>{String(order[key])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
    <div className="flex items-center justify-end space-x-2 py-4 mt-auto">
        <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
