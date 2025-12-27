import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Search,
  Building2,
  AlertTriangle,
  Info,
  TrendingDown
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const formatCurrency = (amount: number | undefined | null) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

interface Enquiry {
  institution?: string;
  purpose?: string;
  amount?: number;
  date?: string;
}

interface EnquiriesSectionProps {
  report: {
    enquiry_details?: Enquiry[];
    hard_enquiries?: number;
    soft_enquiries?: number;
  };
}

export default function EnquiriesSection({ report }: EnquiriesSectionProps) {
  const enquiries = report.enquiry_details || [];
  const hardEnquiries = report.hard_enquiries || 0;
  const softEnquiries = report.soft_enquiries || 0;
 
  const enquiryImpact = hardEnquiries <= 2 ? 'low' : hardEnquiries <= 5 ? 'moderate' : 'high';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "bg-white rounded-xl p-5 border",
            enquiryImpact === 'high' ? "border-red-200" : "border-slate-100"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Search className="w-5 h-5 text-amber-600" />
            </div>
            {enquiryImpact === 'high' && (
              <Badge className="bg-red-100 text-red-700">High Impact</Badge>
            )}
          </div>
          <p className="text-3xl font-bold text-slate-800">{hardEnquiries}</p>
          <p className="text-sm text-slate-500">Hard Enquiries</p>
          <p className="text-xs text-slate-400 mt-1">Last 12 months</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-5 border border-slate-100"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <Badge className="bg-blue-100 text-blue-700">No Impact</Badge>
          </div>
          <p className="text-3xl font-bold text-slate-800">{softEnquiries}</p>
          <p className="text-sm text-slate-500">Soft Enquiries</p>
          <p className="text-xs text-slate-400 mt-1">Self checks & promotions</p>
        </motion.div>
      </div>

      {/* Impact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "rounded-xl p-4 flex items-start gap-3",
          enquiryImpact === 'high'
            ? "bg-red-50 border border-red-200"
            : enquiryImpact === 'moderate'
            ? "bg-amber-50 border border-amber-200"
            : "bg-emerald-50 border border-emerald-200"
        )}
      >
        {enquiryImpact === 'high' ? (
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
        ) : (
          <Info className={cn(
            "w-5 h-5 flex-shrink-0",
            enquiryImpact === 'moderate' ? "text-amber-500" : "text-emerald-500"
          )} />
        )}
        <div>
          <p className={cn(
            "font-medium",
            enquiryImpact === 'high' ? "text-red-800" :
            enquiryImpact === 'moderate' ? "text-amber-800" : "text-emerald-800"
          )}>
            {enquiryImpact === 'high'
              ? "Too many credit enquiries detected"
              : enquiryImpact === 'moderate'
              ? "Moderate number of enquiries"
              : "Enquiry count is healthy"
            }
          </p>
          <p className={cn(
            "text-sm mt-1",
            enquiryImpact === 'high' ? "text-red-600" :
            enquiryImpact === 'moderate' ? "text-amber-600" : "text-emerald-600"
          )}>
            {enquiryImpact === 'high'
              ? "Multiple loan applications in a short time can significantly lower your score. Lenders may view this as credit hungry behavior."
              : enquiryImpact === 'moderate'
              ? "Consider spacing out your credit applications. Each hard enquiry stays on your report for 2 years."
              : "You're managing credit applications well. Keep maintaining this healthy pattern."
            }
          </p>
        </div>
      </motion.div>

      {/* Enquiry List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl border border-slate-100 overflow-hidden"
      >
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Enquiry Details</h3>
        </div>
       
        {enquiries.length === 0 ? (
          <div className="p-8 text-center">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500">No enquiry details available</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {enquiries.map((enquiry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 flex items-center justify-between hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Building2 className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{enquiry.institution}</p>
                    <p className="text-sm text-slate-500">{enquiry.purpose}</p>
                  </div>
                </div>
                <div className="text-right">
                  {enquiry.amount && (
                    <p className="font-semibold text-slate-800">{formatCurrency(enquiry.amount)}</p>
                  )}
                  <p className="text-sm text-slate-400">
                    {enquiry.date ? format(new Date(enquiry.date), 'dd MMM yyyy') : '-'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-50 rounded-xl p-5"
      >
        <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-teal-600" />
          How to Minimize Enquiry Impact
        </h4>
        <ul className="space-y-2 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">•</span>
            Apply for credit only when necessary
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">•</span>
            Research and compare offers before applying
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">•</span>
            Check your eligibility using soft enquiry tools
          </li>
          <li className="flex items-start gap-2">
            <span className="text-teal-500 mt-0.5">•</span>
            Space out loan applications by at least 3-6 months
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
