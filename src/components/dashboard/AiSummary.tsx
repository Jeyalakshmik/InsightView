'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import type { CustomerOrder, DateFilter } from '@/lib/types';
import { summarizeOrderTrends } from '@/ai/flows/ai-order-trend-summarizer';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface AiSummaryProps {
  filteredOrders: CustomerOrder[];
  dateFilter: DateFilter;
}

export function AiSummary({ filteredOrders, dateFilter }: AiSummaryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setIsOpen(true);
    setIsLoading(true);
    setError('');
    setSummary('');

    try {
      const result = await summarizeOrderTrends({
        orders: filteredOrders,
        dateFilter: dateFilter,
      });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleGenerateSummary}>
        <Sparkles className="mr-2 h-4 w-4" />
        Get AI Summary
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-primary" />
              AI Order Trend Summary
            </DialogTitle>
            <DialogDescription>
              An AI-generated analysis of the current order data for "{dateFilter}".
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Analyzing data...</span>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {summary && <p className="whitespace-pre-wrap">{summary}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
