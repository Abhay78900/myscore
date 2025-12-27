import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Building2,
  Search,
  Calendar,
  Wallet,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PiggyBank
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subValue?: string;
  color: string;
  delay: number;
}

const StatCard = ({ icon: Icon, label, value, subValue, color, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-xl p-4 border border-slate-100"
  >
    <div className="flex items-start justify-between">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {subValue && (
        <span className="text-xs text-slate-500">{subValue}</span>
      )}
    </div>
    <p className="text-2xl font-bold text-slate-800 mt-3">{value}</p>
    <p className="text-sm text-slate-500">{label}</p>
  </motion.div>
);

interface CreditSummaryProps {
  report: {
    credit_utilization?: number;
    total_accounts?: number;
    active_accounts?: number;
    active_loans?: any[];
    hard_enquiries?: number;
    oldest_account_age_months?: number;
    score_factors?: {
      payment_history?: number;
      credit_utilization?: number;
      credit_age?: number;
      credit_mix?: number;
      new_credit?: number;
    };
  };
}

export default function CreditSummary({ report }: CreditSummaryProps) {
  const utilizationStatus = (report.credit_utilization || 0) <= 30 ? 'good' : 
                           (report.credit_utilization || 0) <= 50 ? 'moderate' : 'high';
  
  const utilizationColor: Record<string, string> = {
    good: 'text-emerald-600 bg-emerald-50',
    moderate: 'text-amber-600 bg-amber-50',
    high: 'text-red-600 bg-red-50'
  };

  const creditAge = Math.floor((report.oldest_account_age_months || 0) / 12);
  const creditMonths = (report.oldest_account_age_months || 0) % 12;

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={CreditCard}
          label="Total Accounts"
          value={report.total_accounts || 0}
          subValue={`${report.active_accounts || 0} Active`}
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={Building2}
          label="Active Loans"
          value={report.active_loans?.length || 0}
          color="bg-purple-500"
          delay={0.1}
        />
        <StatCard
          icon={Search}
          label="Hard Enquiries"
          value={report.hard_enquiries || 0}
          subValue="Last 12 months"
          color="bg-amber-500"
          delay={0.2}
        />
        <StatCard
          icon={Calendar}
          label="Credit Age"
          value={`${creditAge}y ${creditMonths}m`}
          color="bg-teal-500"
          delay={0.3}
        />
      </div>

      {/* Credit Utilization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-5 border border-slate-100"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">Credit Utilization</h3>
          </div>
          <span className={cn("px-3 py-1 rounded-full text-sm font-medium", utilizationColor[utilizationStatus])}>
            {report.credit_utilization || 0}%
          </span>
        </div>
        
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="w-[30%] bg-emerald-100 border-r border-white" />
            <div className="w-[20%] bg-amber-100 border-r border-white" />
            <div className="flex-1 bg-red-100" />
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(report.credit_utilization || 0, 100)}%` }}
            transition={{ duration: 1 }}
            className={cn(
              "absolute h-full rounded-full",
              utilizationStatus === 'good' ? 'bg-emerald-500' :
              utilizationStatus === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
            )}
          />
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>0%</span>
          <span className="text-emerald-600">30% (Ideal)</span>
          <span className="text-amber-600">50%</span>
          <span className="text-red-600">100%</span>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-start gap-2">
            {utilizationStatus === 'good' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            )}
            <p className="text-sm text-slate-600">
              {utilizationStatus === 'good' 
                ? "Great! Your credit utilization is under 30%. This positively impacts your credit score."
                : utilizationStatus === 'moderate'
                ? "Your utilization is moderate. Try to keep it below 30% for better score."
                : "High credit utilization can negatively impact your score. Consider paying down balances."
              }
            </p>
          </div>
        </div>
      </motion.div>

      {/* Score Factors */}
      {report.score_factors && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-5 border border-slate-100"
        >
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Factors Affecting Your Score
          </h3>
          
          <div className="space-y-4">
            {[
              { key: 'payment_history', label: 'Payment History', weight: '35%', icon: Clock },
              { key: 'credit_utilization', label: 'Credit Utilization', weight: '30%', icon: CreditCard },
              { key: 'credit_age', label: 'Credit Age', weight: '15%', icon: Calendar },
              { key: 'credit_mix', label: 'Credit Mix', weight: '10%', icon: PiggyBank },
              { key: 'new_credit', label: 'New Credit', weight: '10%', icon: Search }
            ].map((factor, index) => {
              const value = (report.score_factors as any)?.[factor.key] || 0;
              const Icon = factor.icon;
              const status = value >= 80 ? 'good' : value >= 60 ? 'moderate' : 'poor';
              const statusColor: Record<string, string> = {
                good: 'bg-emerald-500',
                moderate: 'bg-amber-500',
                poor: 'bg-red-500'
              };

              return (
                <div key={factor.key} className="flex items-center gap-4">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Icon className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-slate-700">{factor.label}</span>
                      <span className="text-xs text-slate-400">{factor.weight} impact</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                        className={cn("h-full rounded-full", statusColor[status])}
                      />
                    </div>
                  </div>
                  <span className={cn(
                    "text-sm font-semibold",
                    status === 'good' ? 'text-emerald-600' :
                    status === 'moderate' ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {value}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
