import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HistoryItem {
  month?: string;
  status?: string;
  days_late?: number;
}

const getStatusStyle = (status?: string) => {
  if (status === 'On Time') {
    return { bg: 'bg-emerald-500', icon: CheckCircle2, text: 'text-emerald-600' };
  }
  if (status === 'Late') {
    return { bg: 'bg-amber-500', icon: Clock, text: 'text-amber-600' };
  }
  if (status === 'Missed') {
    return { bg: 'bg-red-500', icon: XCircle, text: 'text-red-600' };
  }
  return { bg: 'bg-slate-300', icon: Clock, text: 'text-slate-500' };
};

interface RepaymentHistoryProps {
  history?: HistoryItem[];
}

export default function RepaymentHistory({ history }: RepaymentHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No repayment history available</p>
      </div>
    );
  }

  const onTimeCount = history.filter(h => h.status === 'On Time').length;
  const lateCount = history.filter(h => h.status === 'Late').length;
  const missedCount = history.filter(h => h.status === 'Missed').length;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">{onTimeCount}</div>
          <div className="text-sm text-emerald-700">On Time</div>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{lateCount}</div>
          <div className="text-sm text-amber-700">Late</div>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{missedCount}</div>
          <div className="text-sm text-red-700">Missed</div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
        {history.map((item, index) => {
          const style = getStatusStyle(item.status);
          const StatusIcon = style.icon;
         
          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="group relative"
            >
              <div className={`aspect-square rounded-lg ${style.bg} flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-slate-400 transition-all`}>
                <StatusIcon className="w-4 h-4 text-white" />
              </div>
             
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-slate-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                  <div className="font-semibold">{item.month}</div>
                  <div className={style.text}>{item.status}</div>
                  {item.days_late && item.days_late > 0 && (
                    <div className="text-slate-300">{item.days_late} days late</div>
                  )}
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="border-4 border-transparent border-t-slate-800" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500" />
          <span className="text-slate-600">On Time</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-amber-500" />
          <span className="text-slate-600">Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500" />
          <span className="text-slate-600">Missed</span>
        </div>
      </div>
    </div>
  );
}
