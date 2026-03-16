'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from 'react';
import type { CustomerOrder } from '@/lib/types';
import { INITIAL_ORDERS } from '@/lib/data';

interface DataContextType {
  orders: CustomerOrder[];
  addOrder: (order: CustomerOrder) => void;
  updateOrder: (order: CustomerOrder) => void;
  deleteOrder: (orderId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedOrders = localStorage.getItem('customerOrders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('customerOrders', JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  const addOrder = (order: CustomerOrder) => {
    setOrders(prevOrders => [order, ...prevOrders]);
  };

  const updateOrder = (updatedOrder: CustomerOrder) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const value = { orders, addOrder, updateOrder, deleteOrder };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
