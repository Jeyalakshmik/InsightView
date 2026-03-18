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
  const { 
      columns = DEFAULT_COLUMNS,
      rowsPerPage = 5,
      sort,
      applyFilters,
      filters,
      fontSize = 14,
      headerBackgroundColor
  } = config;

  const processedOrders = useMemo(() => {
    let processed = [...orders];

    if (applyFilters && filters && filters.length > 0) {
      processed = processed.filter(order => {
        return filters.every(filter => {
          if (!filter.attribute || !filter.operator) return true;

          const orderValue = order[filter.attribute];
          const filterValue = filter.value;
          
          if (orderValue === undefined || orderValue === null) return false;

          const valA = typeof orderValue === 'string' ? orderValue.toLowerCase() : orderValue;
          const valB = typeof filterValue === 'string' ? filterValue.toLowerCase() : filterValue;

          switch (filter.operator) {
            case '=': return valA == valB;
            case '!=': return valA != valB;
            case '>': return valA > valB;
            case '>=': return valA >= valB;
            case '<': return valA < valB;
            case '<=': return valA <= valB;
            case 'contains':
              return typeof valA === 'string' && typeof valB === 'string' ? valA.includes(valB) : false;
            default:
              return true;
          }
        });
      });
    }

    if (sort) {
      const [sortBy, sortDirection] = sort.split('-') as [keyof CustomerOrder, 'asc' | 'desc'];
      if (sortBy && sortDirection) {
        processed.sort((a, b) => {
          const valA = a[sortBy];
          const valB = b[sortBy];

          if (valA === null || valA === undefined) return 1;
          if (valB === null || valB === undefined) return -1;
          
          let comparison = 0;
          if (typeof valA === 'string' && typeof valB === 'string') {
            comparison = valA.localeCompare(valB);
          } else if (valA > valB) {
            comparison = 1;
          } else if (valA < valB) {
            comparison = -1;
          }

          return sortDirection === 'asc' ? comparison : -comparison;
        });
      }
    }

    return processed;
  }, [orders, applyFilters, filters, sort]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return processedOrders.slice(startIndex, startIndex + rowsPerPage);
  }, [processedOrders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(processedOrders.length / rowsPerPage);

  const formatHeader = (key: string) => {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  const headerStyle = {
    backgroundColor: headerBackgroundColor,
    fontSize: `${fontSize}px`,
  };
  const cellStyle = {
    fontSize: `${fontSize}px`,
  };

  return (
    <div className="h-full flex flex-col">
    <ScrollArea className="flex-1">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map(key => (
              <TableHead key={key} style={headerStyle}>{formatHeader(key)}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedOrders.map(order => (
            <TableRow key={order.id}>
              {columns.map(key => (
                <TableCell key={key} style={cellStyle}>{String(order[key])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
    { totalPages > 1 &&
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
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
    }
    </div>
  );
}
