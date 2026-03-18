export type CustomerOrder = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  product: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdBy: string;
  orderDate: string;
};

export type WidgetType =
  | 'kpi'
  | 'table'
  | 'bar'
  | 'line'
  | 'pie'
  | 'area'
  | 'scatter';

export type KpiDataFormat = 'Number' | 'Currency' | 'Percentage';

export interface BaseWidgetConfig {
  title: string;
  description?: string;
  w?: number;
  h?: number;
}

export interface KpiConfig extends BaseWidgetConfig {
  metric: keyof CustomerOrder | undefined;
  aggregation: 'sum' | 'average' | 'count' | undefined;
  dataFormat: KpiDataFormat | undefined;
  decimalPrecision?: number;
}

export interface ChartConfig extends BaseWidgetConfig {
  xAxis: keyof CustomerOrder | undefined;
  yAxis: keyof CustomerOrder | undefined;
  color?: string;
}

export interface PieChartConfig extends BaseWidgetConfig {
  dataKey: keyof CustomerOrder | undefined;
}

export type TableFilterOperator = '=' | '!=' | '>' | '>=' | '<' | '<=' | 'contains';

export interface TableFilter {
  attribute: keyof CustomerOrder;
  operator: TableFilterOperator;
  value: string | number;
}

export interface TableConfig extends BaseWidgetConfig {
  columns: (keyof CustomerOrder)[];
  rowsPerPage: 5 | 10 | 15;
  sortBy?: keyof CustomerOrder;
  sortDirection?: 'asc' | 'desc';
  applyFilters?: boolean;
  filters?: TableFilter[];
  fontSize?: number;
  headerBackgroundColor?: string;
}


export type WidgetConfig =
  | KpiConfig
  | ChartConfig
  | PieChartConfig
  | TableConfig;

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  config: WidgetConfig;
}

export type DashboardLayout = {
  widgets: DashboardWidget[];
};

export type DateFilter =
  | 'All Time'
  | 'Today'
  | 'Last 7 Days'
  | 'Last 30 Days'
  | 'Last 90 Days';
