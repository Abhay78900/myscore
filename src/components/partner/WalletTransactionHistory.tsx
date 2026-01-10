import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight,
  Clock
} from 'lucide-react';

interface Transaction {
  id: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  description?: string;
  created_date: string;
  balance_after?: number;
}

interface WalletTransactionHistoryProps {
  transactions: Transaction[];
}

export default function WalletTransactionHistory({ transactions }: WalletTransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Wallet Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>No wallet transactions yet</p>
              <p className="text-sm">Load funds to get started</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            Wallet Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="space-y-2 md:space-y-3">
            {transactions.slice(0, 10).map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 ${
                    txn.transaction_type === 'credit' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {txn.transaction_type === 'credit' 
                      ? <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5" />
                      : <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 text-xs md:text-sm truncate">
                      {txn.description || (txn.transaction_type === 'credit' ? 'Wallet Top-up' : 'Report Purchase')}
                    </p>
                    <div className="flex items-center gap-1 md:gap-2 text-xs text-slate-500">
                      <Clock className="w-3 h-3 hidden sm:block" />
                      <span className="truncate">{format(new Date(txn.created_date), 'dd MMM, HH:mm')}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className={`font-semibold text-sm md:text-base ${
                    txn.transaction_type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {txn.transaction_type === 'credit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Bal: ₹{txn.balance_after?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
