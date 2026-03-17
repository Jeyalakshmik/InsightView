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
  quantity: z.number().int().min(1).describe('Quantity of the product ordered.'),
  unitPrice: z.number().min(0).describe('Unit price of the product.'),
  totalAmount: z.number().min(0).describe('Total amount of the order.'),
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
  model: 'googleai/gemini-1.5-flash-latest',
  input: {
    schema: AiOrderTrendSummarizerInputSchema,
  },
  output: {schema: AiOrderTrendSummarizerOutputSchema},
  prompt: `You are an expert data analyst AI. Your task is to provide a concise, insightful summary based on a JSON object of customer orders.

The data you are given has been filtered by: '{{{dateFilter}}}'.

Here is the customer order data:
{{{json orders}}}

## Your Analysis Task:
Based on the provided JSON data, generate a summary covering the following points. If the data is empty or contains no orders, simply state: "No order data is available for the selected period."

- **Key Performance Indicators:** Calculate and mention total revenue, total number of orders, and the average order value.
- **Top Performers:** Identify the best-selling products.
- **Status Overview:** Summarize the distribution of order statuses (e.g., how many are Pending, In Progress, Completed).
- **Anomalies or Interesting Trends:** Point out any unusual patterns, such as a spike in sales for a particular product or a large number of pending orders.
`,
});

const aiOrderTrendSummarizerFlow = ai.defineFlow(
  {
    name: 'aiOrderTrendSummarizerFlow',
    inputSchema: AiOrderTrendSummarizerInputSchema,
    outputSchema: AiOrderTrendSummarizerOutputSchema,
  },
  async input => {
    if (!input.orders || input.orders.length === 0) {
      return { summary: 'No order data is available for the selected period.' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
