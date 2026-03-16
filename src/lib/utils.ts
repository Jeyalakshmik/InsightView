import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { CustomerOrder, DateFilter } from "./types";
import { subDays } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function filterOrdersByDate(orders: CustomerOrder[], filter: DateFilter): CustomerOrder[] {
  const now = new Date();
  switch (filter) {
    case 'Today':
      const today = now.toDateString();
      return orders.filter(order => new Date(order.orderDate).toDateString() === today);
    case 'Last 7 Days':
      const sevenDaysAgo = subDays(now, 7);
      return orders.filter(order => new Date(order.orderDate) >= sevenDaysAgo);
    case 'Last 30 Days':
      const thirtyDaysAgo = subDays(now, 30);
      return orders.filter(order => new Date(order.orderDate) >= thirtyDaysAgo);
    case 'Last 90 Days':
        const ninetyDaysAgo = subDays(now, 90);
        return orders.filter(order => new Date(order.orderDate) >= ninetyDaysAgo);
    case 'All Time':
    default:
      return orders;
  }
}
