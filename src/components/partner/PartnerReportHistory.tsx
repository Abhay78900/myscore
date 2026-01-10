import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Eye, 
  Clock,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';

interface Transaction {
  id: string;
  status?: string;
  amount?: number;
  transaction_id?: string;
}

interface Report {
  id: string;
  full_name?: string;
  pan_number?: string;
  mobile?: string;
  bureaus_checked?: string[];
  created_date: string;
  transaction_id?: string;
  transaction?: Transaction;
  report_status?: 'LOCKED' | 'UNLOCKED';
  average_score?: number;
  cibil_score?: number;
  experian_score?: number;
  equifax_score?: number;
  crif_score?: number;
}

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; label: string }> = {
  success: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
  pending: { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Processing' },
  failed: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Failed' }
};

interface PartnerReportHistoryProps {
  reports: Report[];
  transactions?: Transaction[];
  onViewReport?: (report: Report) => void;
}

export default function PartnerReportHistory({ reports, transactions = [], onViewReport }: PartnerReportHistoryProps) {
  // Combine reports with transaction data
  const reportHistory = reports.map(report => {
    const txn = transactions.find(t => t.id === report.transaction_id);
    return {
      ...report,
      transaction: txn
    };
  });

  if (reportHistory.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Report History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-slate-500">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p>No reports generated yet</p>
              <p className="text-sm">Use "Check Report for Client" to generate reports</p>
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
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Report History ({reportHistory.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Mobile Card View */}
          <div className="block md:hidden divide-y">
            {reportHistory.map((report) => {
              const status = statusConfig[report.transaction?.status || 'success'];
              const StatusIcon = status.icon;
              
              return (
                <div key={report.id} className="p-4 hover:bg-slate-50">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">{report.full_name}</p>
                      <p className="text-xs text-slate-500">{report.mobile}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewReport?.(report)}
                      className="gap-1 shrink-0"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-mono text-slate-600">{report.pan_number}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-medium text-slate-800">₹{report.transaction?.amount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1 flex-wrap">
                      {report.bureaus_checked?.slice(0, 2).map((bureau, i) => (
                        <span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                          {bureau.replace('TransUnion ', '').replace(' High Mark', '')}
                        </span>
                      ))}
                      {(report.bureaus_checked?.length || 0) > 2 && (
                        <span className="text-xs text-slate-500">+{(report.bureaus_checked?.length || 0) - 2}</span>
                      )}
                    </div>
                    <Badge className={`${status.color} text-xs`}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 hidden lg:table-cell">PAN</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Bureaus</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500 hidden xl:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {reportHistory.map((report) => {
                  const status = statusConfig[report.transaction?.status || 'success'];
                  const StatusIcon = status.icon;
                  
                  return (
                    <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{report.full_name}</p>
                          <p className="text-xs text-slate-500">{report.mobile}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-mono text-slate-600 hidden lg:table-cell">
                        {report.pan_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1 flex-wrap">
                          {report.bureaus_checked?.map((bureau, i) => (
                            <span key={i} className="text-xs bg-slate-100 px-2 py-0.5 rounded">
                              {bureau.replace('TransUnion ', '').replace(' High Mark', '')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-800">
                        ₹{report.transaction?.amount || 0}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500 hidden xl:table-cell">
                        {format(new Date(report.created_date), 'dd MMM, HH:mm')}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={status.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewReport?.(report)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
