'use client';
import { useMemo } from 'react';
import type { CustomerOrder, KpiConfig } from '@/lib/types';

interface KpiCardProps {
  orders: CustomerOrder[];
  config: KpiConfig;
}

export function KpiCard({ orders, config }: KpiCardProps) {
  const value = useMemo(() => {
    if (!config.metric || !config.aggregation) return null;
    if (orders.length === 0) return 0;

    if (config.aggregation === 'count') {
      const uniqueValues = new Set(
        orders.map(o => o[config.metric as keyof CustomerOrder])
      );
      return uniqueValues.size;
    }

    const values = orders
      .map(order => order[config.metric as keyof CustomerOrder])
      .filter(v => typeof v === 'number') as number[];

    if (values.length === 0) return 0;

    switch (config.aggregation) {
      case 'sum':
        return values.reduce((acc, val) => acc + val, 0);
      case 'average':
        return values.reduce((acc, val) => acc + val, 0) / values.length;
      default:
        return null;
    }
  }, [orders, config]);

  const formatValue = (val: number | null) => {
    if (val === null) return 'N/A';

    const { dataFormat, decimalPrecision = 0 } = config;

    if (dataFormat === 'Currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimalPrecision,
        maximumFractionDigits: decimalPrecision,
      }).format(val);
    }

    if (dataFormat === 'Percentage') {
      return `${val.toFixed(decimalPrecision)}%`;
    }

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPrecision,
      maximumFractionDigits: decimalPrecision,
    }).format(val);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl font-bold">{formatValue(value)}</p>
        <p className="text-sm text-muted-foreground capitalize">
          {config.description ||
            (config.aggregation && config.metric
              ? `${config.aggregation} of ${config.metric}`
              : 'Metric')}
        </p>
      </div>
    </div>
  );
}
