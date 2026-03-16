'use server';
/**
 * @fileOverview An AI agent that summarizes customer order data trends.
 *
 * - summarizeOrderTrends - A function that generates a summary of customer order data trends.
 * - AiOrderTrendSummarizerInput - The input type for the summarizeOrderTrends function.
 * - AiOrderTrendSummarizerOutput - The return type for the summarizeOrderTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerOrderSchema = z.object({
  id: z.string().describe('Unique identifier for the order.').optional(),
  firstName: z.string().describe('First name of the customer.'),
  lastName: z.string().describe('Last name of the customer.'),
  email: z.string().email().describe('Email address of the customer.'),
  phone: z.string().describe('Phone number of the customer.'),
  address: z.string().describe('Street address of the customer.'),
  city: z.string().describe('City of the customer.'),
  state: z.string().describe('State of the customer.'),
  postalCode: z.string().describe('Postal code of the customer.'),
  country: z.string().describe('Country of the customer.'),
  product: z.string().describe('Name of the product ordered.'),
  quantity: z.number().int().positive().describe('Quantity of the product ordered.'),
  unitPrice: z.number().positive().describe('Unit price of the product.'),
  totalAmount: z.number().positive().describe('Total amount of the order.'),
  status: z.enum(['Pending', 'In Progress', 'Completed']).describe('Current status of the order.'),
  createdBy: z.string().describe('The user who created this order record.'),
  orderDate: z.string().datetime().describe('Date and time when the order was placed (ISO 8601 format).').optional(),
});

const AiOrderTrendSummarizerInputSchema = z.object({
  orders: z.array(CustomerOrderSchema).describe('An array of customer order data.'),
  dateFilter: z.enum(['All Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'Last 90 Days']).describe('The active date filter applied to the dashboard data.'),
});
export type AiOrderTrendSummarizerInput = z.infer<typeof AiOrderTrendSummarizerInputSchema>;

const AiOrderTrendSummarizerOutputSchema = z.object({
  summary: z.string().describe('A concise summary of key trends, anomalies, and insights from the customer order data.'),
});
export type AiOrderTrendSummarizerOutput = z.infer<typeof AiOrderTrendSummarizerOutputSchema>;

export async function summarizeOrderTrends(input: AiOrderTrendSummarizerInput): Promise<AiOrderTrendSummarizerOutput> {
  return aiOrderTrendSummarizerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiOrderTrendSummarizerPrompt',
  input: {schema: AiOrderTrendSummarizerInputSchema},
  output: {schema: AiOrderTrendSummarizerOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing customer order data and identifying key trends and anomalies.
You will be provided with a JSON array of customer orders and the date filter currently applied to the dashboard.

Analyze the provided customer order data and generate a concise summary of key trends, anomalies, or important insights.
Focus on aspects like:
- Overall sales performance (e.g., total revenue, average order value).
- Popular products or services.
- Customer behavior patterns (e.g., geographical distribution, order frequency).
- Any unusual spikes or drops in orders, quantities, or total amounts.
- Trends related to order status (e.g., many pending orders, rapid completion rates).
- Insights related to who created the orders (e.g., most productive order creator).
- The impact of the applied date filter ({{{dateFilter}}}) on the observed trends.

Present the summary in a clear, easy-to-understand format. If there are no orders, state that no data is available for analysis.

Customer Order Data (filtered by "{{{dateFilter}}}"):
{{{orders}}}
`,
});

const aiOrderTrendSummarizerFlow = ai.defineFlow(
  {
    name: 'aiOrderTrendSummarizerFlow',
    inputSchema: AiOrderTrendSummarizerInputSchema,
    outputSchema: AiOrderTrendSummarizerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
