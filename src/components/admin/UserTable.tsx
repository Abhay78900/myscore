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
  MoreHorizontal,
  User,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Report {
  id: string;
  full_name?: string;
  user_email?: string;
  pan_number?: string;
  mobile?: string;
  credit_score?: number;
  average_score?: number;
  cibil_score?: number;
  experian_score?: number;
  equifax_score?: number;
  crif_score?: number;
  view_count?: number;
  last_viewed_at?: string;
  created_date: string;
  is_high_risk?: boolean;
  report_status?: 'LOCKED' | 'UNLOCKED';
  initiated_by?: 'user' | 'partner';
  partner_id?: string;
  bureaus_checked?: string[];
  score_category?: string;
  report_generated_at?: string;
  initiator_email?: string;
}

const getScoreBadge = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700' };
  if (score >= 650) return { label: 'Good', color: 'bg-teal-100 text-teal-700' };
  if (score >= 500) return { label: 'Average', color: 'bg-amber-100 text-amber-700' };
  return { label: 'Poor', color: 'bg-red-100 text-red-700' };
};

interface UserTableProps {
  reports: Report[];
  onViewReport?: (report: any) => void;
  onDownload?: (report: Report) => void;
}

export default function UserTable({ reports, onViewReport, onDownload }: UserTableProps) {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No reports found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Mobile Card View */}
      <div className="block md:hidden divide-y">
        {reports.map((report, index) => {
          const displayScore = report.average_score || report.credit_score || report.cibil_score || 0;
          const scoreBadge = getScoreBadge(displayScore);
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate">{report.full_name}</p>
                    <p className="text-sm text-slate-500 truncate">{report.user_email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewReport?.(report)}>
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownload?.(report)}>
                      <Download className="w-4 h-4 mr-2" /> Download Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-slate-500">PAN:</span>{' '}
                  <span className="font-mono">{report.pan_number}</span>
                </div>
                <div>
                  <span className="text-slate-500">Mobile:</span>{' '}
                  <span>{report.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Score:</span>
                  <span className="font-bold">{displayScore}</span>
                  <Badge className={`${scoreBadge.color} text-xs`}>{scoreBadge.label}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Risk:</span>
                  {report.is_high_risk ? (
                    <Badge className="bg-red-100 text-red-700 text-xs gap-1">
                      <AlertTriangle className="w-3 h-3" /> High
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">Low</Badge>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>User</TableHead>
              <TableHead className="hidden lg:table-cell">PAN</TableHead>
              <TableHead className="hidden lg:table-cell">Mobile</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="hidden xl:table-cell">Views</TableHead>
              <TableHead className="hidden xl:table-cell">Last Viewed</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report, index) => {
              const displayScore = report.average_score || report.credit_score || report.cibil_score || 0;
              const scoreBadge = getScoreBadge(displayScore);
              
              return (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">{report.full_name}</p>
                        <p className="text-sm text-slate-500 truncate">{report.user_email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm hidden lg:table-cell">{report.pan_number}</TableCell>
                  <TableCell className="hidden lg:table-cell">{report.mobile}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{displayScore}</span>
                      <Badge className={scoreBadge.color}>{scoreBadge.label}</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <span className="text-slate-600">{report.view_count || 1}</span>
                  </TableCell>
                  <TableCell className="text-slate-500 text-sm hidden xl:table-cell">
                    {report.last_viewed_at 
                      ? format(new Date(report.last_viewed_at), 'MMM d, yyyy HH:mm')
                      : format(new Date(report.created_date), 'MMM d, yyyy HH:mm')
                    }
                  </TableCell>
                  <TableCell>
                    {report.is_high_risk ? (
                      <Badge className="bg-red-100 text-red-700 gap-1">
                        <AlertTriangle className="w-3 h-3" /> High
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-100 text-emerald-700">Low</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewReport?.(report)}>
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownload?.(report)}>
                          <Download className="w-4 h-4 mr-2" /> Download Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
