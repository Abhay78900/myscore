import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Loader2,
  Lock,
} from 'lucide-react';
import UnifiedReportViewer from '@/components/credit/UnifiedReportViewer';
import { mockCreditReports } from '@/data/mockData';
import { CreditReport } from '@/types';
import { getReportById, getAllReports } from '@/utils/reportStorage';

export default function CreditReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState<CreditReport | null>(null);
  const [viewerType, setViewerType] = useState<'user' | 'partner' | 'admin'>('user');

  useEffect(() => {
    const loadReport = () => {
      const reportId = searchParams.get('reportId');
      const viewer = searchParams.get('viewer') as 'user' | 'partner' | 'admin' | null;
      
      if (viewer) {
        setViewerType(viewer);
      }

      // Priority 1: Check for report passed via sessionStorage (from partner/admin click)
      const viewReportData = sessionStorage.getItem('viewReport');
      if (viewReportData) {
        try {
          const parsedReport = JSON.parse(viewReportData) as CreditReport;
          // Validate report is unlocked before showing
          if (parsedReport.report_status === 'UNLOCKED') {
            setReport(parsedReport);
            // Clear after use to prevent stale data
            sessionStorage.removeItem('viewReport');
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse viewReport:', e);
        }
      }

      // Priority 2: Check by reportId in URL from storage
      if (reportId) {
        // First check our centralized storage
        const storedReport = getReportById(reportId);
        if (storedReport && storedReport.report_status === 'UNLOCKED') {
          setReport(storedReport);
          setIsLoading(false);
          return;
        }

        // Fallback to all stored reports
        const allStoredReports = getAllReports();
        const fromStorage = allStoredReports.find(r => r.id === reportId);
        if (fromStorage && fromStorage.report_status === 'UNLOCKED') {
          setReport(fromStorage);
          setIsLoading(false);
          return;
        }

        // Fallback to mock data
        const mockReport = mockCreditReports.find(r => r.id === reportId);
        if (mockReport) {
          setReport(mockReport);
          setIsLoading(false);
          return;
        }
      }

      // Priority 3: Default to first unlocked mock report
      const unlockedMock = mockCreditReports.find(r => r.report_status === 'UNLOCKED');
      if (unlockedMock) {
        setReport(unlockedMock);
      }
      
      setIsLoading(false);
    };

    loadReport();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your credit report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No Report Found</h2>
          <p className="text-muted-foreground mb-6">You haven't checked your credit score yet.</p>
          <Button onClick={() => navigate(createPageUrl('CheckScore'))}>
            Check Your Score Now
          </Button>
        </div>
      </div>
    );
  }

  // CRITICAL: Check lock status from the stored report data
  if (report.report_status === 'LOCKED') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Report Locked</h2>
          <p className="text-muted-foreground mb-6">
            This report has not been paid for. Complete payment to view the full credit report.
          </p>
          <Button onClick={() => navigate(createPageUrl('SelectReports'))} className="w-full">
            Unlock Report
          </Button>
        </div>
      </div>
    );
  }

  // Report is UNLOCKED - show the unified viewer
  return (
    <UnifiedReportViewer 
      report={report} 
      viewerType={viewerType}
      onBack={() => {
        if (viewerType === 'partner') {
          navigate('/partner');
        } else if (viewerType === 'admin') {
          navigate('/admin/reports-repository');
        } else {
          navigate(createPageUrl('Dashboard'));
        }
      }}
    />
  );
}
