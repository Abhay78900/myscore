import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Home, 
  Car, 
  CreditCard, 
  GraduationCap, 
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  IndianRupee,
  Calendar,
  TrendingDown
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

interface LoanCardProps {
  loan: Loan;
  index: number;
}

const LoanCard = ({ loan, index }: LoanCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = loanIcons[loan.loan_type || ''] || CreditCard;
  
  const isActive = loan.status === 'Active' || !loan.status;
  const hasOverdue = (loan.overdue_amount || 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 overflow-hidden"
    >
      <div 
        className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-xl",
              isActive ? "bg-teal-50" : "bg-slate-100"
            )}>
              <Icon className={cn(
                "w-5 h-5",
                isActive ? "text-teal-600" : "text-slate-500"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{loan.loan_type}</h3>
              <p className="text-sm text-slate-500">{loan.lender}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-800">{formatCurrency(loan.current_balance)}</p>
              <p className="text-sm text-slate-500">Outstanding</p>
            </div>
            
            <div className="flex items-center gap-2">
              {hasOverdue && (
                <Badge className="bg-red-100 text-red-700">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Overdue
                </Badge>
              )}
              {isActive ? (
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              ) : (
                <Badge className="bg-slate-100 text-slate-600">Closed</Badge>
              )}
              {expanded ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100"
          >
            <div className="p-4 bg-slate-50 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Sanctioned Amount</p>
                <p className="font-semibold text-slate-700">{formatCurrency(loan.sanctioned_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">EMI Amount</p>
                <p className="font-semibold text-slate-700">{formatCurrency(loan.emi_amount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Tenure</p>
                <p className="font-semibold text-slate-700">{loan.tenure_months} months</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Interest Rate</p>
                <p className="font-semibold text-slate-700">{loan.interest_rate || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Start Date</p>
                <p className="font-semibold text-slate-700">
                  {loan.start_date ? format(new Date(loan.start_date), 'dd MMM yyyy') : 'N/A'}
                </p>
              </div>
              {hasOverdue && (
                <div>
                  <p className="text-xs text-red-500 mb-1">Overdue Amount</p>
                  <p className="font-semibold text-red-600">{formatCurrency(loan.overdue_amount)}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface CreditCardType {
  id?: string;
  bank?: string;
  credit_limit?: number;
  current_balance?: number;
  available_limit?: number;
  utilization?: number;
  status?: string;
}

interface CreditCardItemProps {
  card: CreditCardType;
  index: number;
}

const CreditCardItem = ({ card, index }: CreditCardItemProps) => {
  const utilization = card.utilization || 
    (card.credit_limit && card.current_balance 
      ? Math.round((card.current_balance / card.credit_limit) * 100) 
      : 0);
  
  const utilizationStatus = utilization <= 30 ? 'good' : utilization <= 50 ? 'moderate' : 'high';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl border border-slate-200 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{card.bank}</h3>
            <p className="text-sm text-slate-500">Credit Card</p>
          </div>
        </div>
        <Badge className={cn(
          card.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
        )}>
          {card.status || 'Active'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-500 mb-1">Credit Limit</p>
          <p className="font-semibold text-slate-700">{formatCurrency(card.credit_limit)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Current Balance</p>
          <p className="font-semibold text-slate-700">{formatCurrency(card.current_balance)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Available</p>
          <p className="font-semibold text-emerald-600">{formatCurrency(card.available_limit)}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">Credit Utilization</span>
          <span className={cn(
            "text-sm font-semibold",
            utilizationStatus === 'good' ? "text-emerald-600" :
            utilizationStatus === 'moderate' ? "text-amber-600" : "text-red-600"
          )}>
            {utilization}%
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(utilization, 100)}%` }}
            className={cn(
              "h-full rounded-full",
              utilizationStatus === 'good' ? "bg-emerald-500" :
              utilizationStatus === 'moderate' ? "bg-amber-500" : "bg-red-500"
            )}
          />
        </div>
      </div>
    </motion.div>
  );
};

interface AccountsSectionProps {
  report: {
    active_loans?: Loan[];
    closed_loans?: Loan[];
    credit_cards?: CreditCardType[];
  };
}

export default function AccountsSection({ report }: AccountsSectionProps) {
  const activeLoans = report.active_loans || [];
  const closedLoans = report.closed_loans || [];
  const creditCards = report.credit_cards || [];

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-6">
        <TabsTrigger value="active" className="gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Active Loans ({activeLoans.length})
        </TabsTrigger>
        <TabsTrigger value="cards" className="gap-2">
          <CreditCard className="w-4 h-4" />
          Credit Cards ({creditCards.length})
        </TabsTrigger>
        <TabsTrigger value="closed" className="gap-2">
          <Clock className="w-4 h-4" />
          Closed ({closedLoans.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4">
        {activeLoans.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No active loans</p>
          </div>
        ) : (
          activeLoans.map((loan, index) => (
            <LoanCard key={loan.id || index} loan={loan} index={index} />
          ))
        )}
      </TabsContent>

      <TabsContent value="cards" className="grid md:grid-cols-2 gap-4">
        {creditCards.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl md:col-span-2">
            <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No credit cards found</p>
          </div>
        ) : (
          creditCards.map((card, index) => (
            <CreditCardItem key={card.id || index} card={card} index={index} />
          ))
        )}
      </TabsContent>

      <TabsContent value="closed" className="space-y-4">
        {closedLoans.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No closed accounts</p>
          </div>
        ) : (
          closedLoans.map((loan, index) => (
            <LoanCard key={loan.id || index} loan={{ ...loan, status: 'Closed' }} index={index} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
}
