'use client';
import { useMemo } from 'react';
import type { CustomerOrder, KpiConfig } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardProps {
  orders: CustomerOrder[];
  config: KpiConfig;
}

export function KpiCard({ orders, config }: KpiCardProps) {
  const value = useMemo(() => {
    if (!config.metric || !config.aggregation) return null;
    if (orders.length === 0) return 0;

    const values = orders.map(order => order[config.metric as keyof CustomerOrder]).filter(v => typeof v === 'number') as number[];

    switch (config.aggregation) {
      case 'count':
        return orders.length;
      case 'sum':
        if (values.length === 0) return 0;
        return values.reduce((acc, val) => acc + val, 0);
      case 'average':
        if (values.length === 0) return 0;
        return values.reduce((acc, val) => acc + val, 0) / values.length;
      default:
        return null;
    }
  }, [orders, config]);

  const formatValue = (val: number | null) => {
    if (val === null) return 'N/A';

    const isCurrency = config.metric === 'totalAmount' || config.metric === 'unitPrice';
    
    if (isCurrency) {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    }
    if (config.aggregation !== 'count' && val % 1 !== 0) {
        return val.toFixed(2);
    }
    return val.toLocaleString();
  };


  return (
    <div className="h-full flex items-center justify-center">
        <div className="text-center">
            <p className="text-4xl font-bold">{formatValue(value)}</p>
            <p className="text-sm text-muted-foreground capitalize">
                {config.aggregation && config.metric ? `${config.aggregation} of ${config.metric}` : 'Metric'}
            </p>
        </div>
    </div>
  );
}
