import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Download,
  Save,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Clock
} from 'lucide-react';
import CreditScoreGauge from '@/components/credit/CreditScoreGauge';
import LoanDetails from '@/components/credit/LoanDetails';
import RepaymentHistory from '@/components/credit/RepaymentHistory';
import RiskFlags from '@/components/credit/RiskFlags';

interface Report {
  id: string;
  full_name?: string;
  pan_number?: string;
  mobile?: string;
  user_email?: string;
  date_of_birth?: string;
  address?: string;
  credit_score?: number;
  report_generated_at?: string;
  created_date: string;
  credit_accounts?: number;
  credit_utilization?: number;
  enquiry_count?: number;
  risk_flags?: string[];
  is_high_risk?: boolean;
  active_loans?: any[];
  repayment_history?: any[];
  admin_notes?: string;
}

interface ReportDetailModalProps {
  report: Report | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes?: (reportId: string, notes: string) => Promise<void>;
  onDownload?: (report: Report) => void;
}

export default function ReportDetailModal({ 
  report, 
  isOpen, 
  onClose, 
  onSaveNotes,
  onDownload 
}: ReportDetailModalProps) {
  const [notes, setNotes] = useState(report?.admin_notes || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!report) return null;

  const handleSaveNotes = async () => {
    if (!onSaveNotes) return;
    setIsSaving(true);
    await onSaveNotes(report.id, notes);
    setIsSaving(false);
  };

  const getScoreCategory = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-emerald-600' };
    if (score >= 650) return { label: 'Good', color: 'text-teal-600' };
    if (score >= 500) return { label: 'Average', color: 'text-amber-600' };
    return { label: 'Poor', color: 'text-red-600' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Credit Report Details</span>
            <Button onClick={() => onDownload?.(report)} variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" /> Download PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info & Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Info */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" /> Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{report.full_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="font-mono text-slate-600">{report.pan_number}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{report.mobile}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">{report.user_email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600">
                    {report.date_of_birth ? format(new Date(report.date_of_birth), 'dd MMM yyyy') : 'N/A'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                  <span className="text-slate-600 text-sm">{report.address}</span>
                </div>
              </div>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 flex flex-col items-center justify-center">
              <CreditScoreGauge score={report.credit_score || 0} size={200} />
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500">Report Generated</p>
                <p className="font-medium text-slate-700">
                  {format(new Date(report.report_generated_at || report.created_date), 'dd MMM yyyy, HH:mm')}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <Wallet className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{report.credit_accounts || 0}</p>
              <p className="text-sm text-slate-500">Credit Accounts</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-teal-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{report.credit_utilization || 0}%</p>
              <p className="text-sm text-slate-500">Credit Utilization</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{report.enquiry_count || 0}</p>
              <p className="text-sm text-slate-500">Enquiries</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-800">{report.risk_flags?.length || 0}</p>
              <p className="text-sm text-slate-500">Risk Flags</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="loans" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="loans">Loans</TabsTrigger>
              <TabsTrigger value="repayment">Repayment</TabsTrigger>
              <TabsTrigger value="risk">Risk Flags</TabsTrigger>
              <TabsTrigger value="notes">Admin Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="loans" className="mt-4">
              <LoanDetails loans={report.active_loans} />
            </TabsContent>

            <TabsContent value="repayment" className="mt-4">
              <RepaymentHistory history={report.repayment_history} />
            </TabsContent>

            <TabsContent value="risk" className="mt-4">
              <RiskFlags flags={report.risk_flags} isHighRisk={report.is_high_risk} />
            </TabsContent>

            <TabsContent value="notes" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="Add admin notes about this report..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
                <Button 
                  onClick={handleSaveNotes} 
                  disabled={isSaving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
