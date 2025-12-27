import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Info
} from 'lucide-react';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentRecord {
  month?: string;
  year?: number;
  status?: string;
  dpd?: number;
}

const getStatusConfig = (status?: string, dpd?: number) => {
  if (status === 'On Time' || dpd === 0) {
    return { color: 'bg-emerald-500', icon: CheckCircle2, label: 'On Time' };
  }
  if (dpd && dpd > 90) {
    return { color: 'bg-red-600', icon: XCircle, label: `${dpd} DPD` };
  }
  if (dpd && dpd > 30) {
    return { color: 'bg-red-400', icon: AlertTriangle, label: `${dpd} DPD` };
  }
  if (status === 'Late' || (dpd && dpd > 0)) {
    return { color: 'bg-amber-500', icon: Clock, label: `${dpd || 'Late'} DPD` };
  }
  if (status === 'Missed') {
    return { color: 'bg-red-500', icon: XCircle, label: 'Missed' };
  }
  return { color: 'bg-slate-200', icon: null, label: 'No Data' };
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface PaymentHistoryGridProps {
  report: {
    payment_history?: PaymentRecord[];
  };
}

export default function PaymentHistoryGrid({ report }: PaymentHistoryGridProps) {
  const paymentHistory = report.payment_history || [];
 
  // Calculate stats
  const totalPayments = paymentHistory.length;
  const onTimePayments = paymentHistory.filter(p => p.status === 'On Time' || p.dpd === 0).length;
  const latePayments = paymentHistory.filter(p => p.status === 'Late' || (p.dpd && p.dpd > 0 && p.dpd <= 30)).length;
  const missedPayments = paymentHistory.filter(p => p.status === 'Missed' || (p.dpd && p.dpd > 30)).length;
  const onTimePercentage = totalPayments > 0 ? Math.round((onTimePayments / totalPayments) * 100) : 0;

  // Group by year
  const historyByYear: Record<string, (PaymentRecord | null)[]> = {};
  paymentHistory.forEach(item => {
    const year = item.year || new Date().getFullYear();
    if (!historyByYear[year]) {
      historyByYear[year] = Array(12).fill(null);
    }
    const monthIndex = months.indexOf(item.month?.substring(0, 3) || '');
    if (monthIndex !== -1) {
      historyByYear[year][monthIndex] = item;
    }
  });

  const years = Object.keys(historyByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white"
        >
          <p className="text-3xl font-bold">{onTimePercentage}%</p>
          <p className="text-sm text-emerald-100">On-Time Rate</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-slate-100"
        >
          <p className="text-3xl font-bold text-emerald-600">{onTimePayments}</p>
          <p className="text-sm text-slate-500">On Time</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-4 border border-slate-100"
        >
          <p className="text-3xl font-bold text-amber-600">{latePayments}</p>
          <p className="text-sm text-slate-500">Late (1-30 DPD)</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-4 border border-slate-100"
        >
          <p className="text-3xl font-bold text-red-600">{missedPayments}</p>
          <p className="text-sm text-slate-500">Missed (30+ DPD)</p>
        </motion.div>
      </div>

      {/* Payment Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl border border-slate-100 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Payment History Grid</h3>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Info className="w-3 h-3" />
            <span>DPD = Days Past Due</span>
          </div>
        </div>

        <div className="p-4 overflow-x-auto">
          {/* Header */}
          <div className="flex items-center mb-2">
            <div className="w-16 text-sm font-medium text-slate-500">Year</div>
            {months.map(month => (
              <div key={month} className="flex-1 text-center text-xs text-slate-400 min-w-[40px]">
                {month}
              </div>
            ))}
          </div>

          {/* Years */}
          {years.map((year, yearIndex) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + yearIndex * 0.1 }}
              className="flex items-center mb-2"
            >
              <div className="w-16 text-sm font-semibold text-slate-700">{year}</div>
              {historyByYear[year].map((item, monthIndex) => {
                const config = item ? getStatusConfig(item.status, item.dpd) : { color: 'bg-slate-100', label: 'No Data', icon: null };
               
                return (
                  <div key={monthIndex} className="flex-1 flex justify-center min-w-[40px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6 + monthIndex * 0.03 }}
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer",
                              "hover:ring-2 hover:ring-offset-1 hover:ring-slate-300 transition-all",
                              config.color
                            )}
                          >
                            {config.icon && (
                              <config.icon className="w-4 h-4 text-white" />
                            )}
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-center">
                            <p className="font-medium">{months[monthIndex]} {year}</p>
                            <p className="text-xs text-slate-400">{config.label}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded" />
              <span className="text-slate-600">On Time (0 DPD)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded" />
              <span className="text-slate-600">1-30 DPD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-400 rounded" />
              <span className="text-slate-600">31-90 DPD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600 rounded" />
              <span className="text-slate-600">90+ DPD</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-slate-200 rounded" />
              <span className="text-slate-600">No Data</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={cn(
          "rounded-xl p-5",
          onTimePercentage >= 95 ? "bg-emerald-50 border border-emerald-200" :
          onTimePercentage >= 80 ? "bg-amber-50 border border-amber-200" :
          "bg-red-50 border border-red-200"
        )}
      >
        <div className="flex items-start gap-3">
          {onTimePercentage >= 95 ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className={cn(
              "w-6 h-6 flex-shrink-0",
              onTimePercentage >= 80 ? "text-amber-500" : "text-red-500"
            )} />
          )}
          <div>
            <p className={cn(
              "font-semibold",
              onTimePercentage >= 95 ? "text-emerald-800" :
              onTimePercentage >= 80 ? "text-amber-800" : "text-red-800"
            )}>
              {onTimePercentage >= 95
                ? "Excellent Payment History!"
                : onTimePercentage >= 80
                ? "Good Payment History with Room for Improvement"
                : "Payment History Needs Attention"
              }
            </p>
            <p className={cn(
              "text-sm mt-1",
              onTimePercentage >= 95 ? "text-emerald-600" :
              onTimePercentage >= 80 ? "text-amber-600" : "text-red-600"
            )}>
              Payment history contributes 35% to your credit score - the highest weightage among all factors.
              {onTimePercentage < 95 && " Setting up auto-pay can help you avoid late payments."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
