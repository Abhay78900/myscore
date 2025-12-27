import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  Lock,
  Unlock,
  FileText
} from 'lucide-react';

interface Report {
  id: string;
  average_score?: number;
  score_category?: string;
  bureaus_checked?: string[];
  created_date: string;
  report_status?: string;
}

const getScoreBadge = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700' };
  if (score >= 650) return { label: 'Good', color: 'bg-teal-100 text-teal-700' };
  if (score >= 500) return { label: 'Average', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Poor', color: 'bg-red-100 text-red-700' };
};

interface ReportHistoryTableProps {
  reports: Report[];
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
  onUnlock?: (report: Report) => void;
}

export default function ReportHistoryTable({ reports, onView, onDownload, onUnlock }: ReportHistoryTableProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No reports found</p>
        <p className="text-sm text-slate-400">Check your credit score to generate your first report</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Date</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => {
            const scoreBadge = getScoreBadge(report.average_score || 0);
            const isLocked = report.report_status === 'LOCKED';
            
            return (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-slate-50"
              >
                <TableCell className="text-slate-600">
                  {format(new Date(report.created_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {isLocked ? (
                    <span className="text-slate-400">Hidden</span>
                  ) : (
                    <span className="font-bold text-slate-800">{report.average_score}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isLocked ? (
                    <Badge className="bg-slate-100 text-slate-500">Hidden</Badge>
                  ) : (
                    <Badge className={scoreBadge.color}>{scoreBadge.label}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {isLocked ? (
                    <Badge className="bg-amber-100 text-amber-700">
                      <Lock className="w-3 h-3 mr-1" />
                      Locked
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <Unlock className="w-3 h-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {isLocked ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onUnlock && onUnlock(report)}
                        className="gap-1 bg-amber-600 hover:bg-amber-700"
                      >
                        <Unlock className="w-4 h-4" />
                        Pay ₹{(report.bureaus_checked?.length || 1) * 99} to Unlock
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(report)}
                          title="View Report"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDownload(report)}
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </motion.tr>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
