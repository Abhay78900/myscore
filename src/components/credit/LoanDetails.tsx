import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Home, 
  Car, 
  Briefcase, 
  GraduationCap, 
  Building2, 
  CreditCard,
  IndianRupee,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const loanIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Home Loan': Home,
  'Car Loan': Car,
  'Personal Loan': Briefcase,
  'Education Loan': GraduationCap,
  'Business Loan': Building2,
  'Credit Card': CreditCard,
  'Consumer Loan': Briefcase,
  'Two Wheeler Loan': Car,
  'Gold Loan': IndianRupee,
};

const formatCurrency = (amount: number | undefined | null) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

interface Loan {
  id?: string;
  loan_type?: string;
  lender?: string;
  sanctioned_amount?: number;
  current_balance?: number;
  emi_amount?: number;
  tenure_months?: number;
  start_date?: string;
  status?: string;
  overdue_amount?: number;
  interest_rate?: string;
}

interface LoanDetailsProps {
  loans?: Loan[];
}

export default function LoanDetails({ loans }: LoanDetailsProps) {
  if (!loans || loans.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No loan details available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loans.map((loan, index) => {
        const Icon = loanIcons[loan.loan_type || ''] || CreditCard;
        const hasOverdue = (loan.overdue_amount || 0) > 0;
        
        return (
          <motion.div
            key={loan.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-50 rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{loan.loan_type}</h4>
                  <p className="text-sm text-slate-500">{loan.lender}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasOverdue && (
                  <Badge className="bg-red-100 text-red-700">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Overdue
                  </Badge>
                )}
                <Badge className={cn(
                  loan.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"
                )}>
                  {loan.status || 'Active'}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                  <IndianRupee className="w-3 h-3" />
                  Sanctioned
                </div>
                <p className="font-semibold text-slate-700">{formatCurrency(loan.sanctioned_amount)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                  <IndianRupee className="w-3 h-3" />
                  Outstanding
                </div>
                <p className="font-semibold text-slate-700">{formatCurrency(loan.current_balance)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                  <Calendar className="w-3 h-3" />
                  EMI Amount
                </div>
                <p className="font-semibold text-slate-700">{formatCurrency(loan.emi_amount)}</p>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-1">
                  <Clock className="w-3 h-3" />
                  Tenure
                </div>
                <p className="font-semibold text-slate-700">{loan.tenure_months} months</p>
              </div>
            </div>

            {hasOverdue && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Overdue Amount: {formatCurrency(loan.overdue_amount)}</span>
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
