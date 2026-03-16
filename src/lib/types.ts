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

export type KpiConfig = {
  metric: keyof CustomerOrder | undefined;
  aggregation: 'sum' | 'average' | 'count' | undefined;
  title: string;
};

export type ChartConfig = {
  xAxis: keyof CustomerOrder | undefined;
  yAxis: keyof CustomerOrder | undefined;
  title: string;
  color: string;
};

export type PieChartConfig = {
  dataKey: keyof CustomerOrder | undefined;
  title: string;
};

export type TableConfig = {
  columns: (keyof CustomerOrder)[];
  title: string;
  rowsPerPage: 5 | 10 | 15;
};

export type WidgetConfig = KpiConfig | ChartConfig | PieChartConfig | TableConfig;

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

export type DateFilter = 'All Time' | 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Last 90 Days';
