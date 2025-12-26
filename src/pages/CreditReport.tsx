import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  ArrowLeft,
  Download,
  RefreshCw,
  Loader2,
  Lock,
} from 'lucide-react';
import BureauReportView from '@/components/credit/BureauReportView';
import { mockCreditReports, bureauConfig } from '@/data/mockData';

export default function CreditReport() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [report, setReport] = useState(mockCreditReports[0]);
  const [selectedBureau, setSelectedBureau] = useState('cibil');

  useEffect(() => {
    const reportId = searchParams.get('reportId');
    if (reportId) {
      const found = mockCreditReports.find(r => r.id === reportId);
      if (found) setReport(found);
    }
    
    setTimeout(() => setIsLoading(false), 500);
  }, [searchParams]);

  useEffect(() => {
    if (report) {
      const bureaus = ['cibil', 'experian', 'equifax', 'crif'];
      for (const bureau of bureaus) {
        const score = getScoreForBureau(bureau);
        if (score && score > 0) {
          setSelectedBureau(bureau);
          break;
        }
      }
    }
  }, [report]);

  const getScoreForBureau = (bureau: string): number => {
    switch (bureau) {
      case 'cibil': return report?.cibil_score || 0;
      case 'experian': return report?.experian_score || 0;
      case 'equifax': return report?.equifax_score || 0;
      case 'crif': return report?.crif_score || 0;
      default: return 0;
    }
  };

  const handleDownload = (bureau: string) => {
    const content = `Credit Report - ${report.full_name}\nBureau: ${bureauConfig[bureau].fullName}\nScore: ${getScoreForBureau(bureau)}\nGenerated: ${new Date().toDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bureauConfig[bureau].name}_Report_${report.pan_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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

  if (report.report_status === 'LOCKED') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl shadow-card border border-border p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-2">Report Locked</h2>
          <p className="text-muted-foreground mb-6">
            Complete payment to view your full credit report.
          </p>
          <Button onClick={() => navigate(createPageUrl('SelectReports'))} className="w-full">
            Unlock Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl('Dashboard'))}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-display font-bold text-foreground">Credit Report</h1>
                  <p className="text-xs text-muted-foreground">Individual Bureau Reports</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload(selectedBureau)} 
                className="gap-2"
              >
                <Download className="w-4 h-4" /> Download {bureauConfig[selectedBureau].name}
              </Button>
              <Button 
                size="sm" 
                onClick={() => navigate(createPageUrl('CheckScore'))} 
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Bureau Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={selectedBureau} onValueChange={setSelectedBureau}>
          <TabsList className="grid grid-cols-4 mb-6 bg-card border border-border">
            {Object.entries(bureauConfig).map(([key, config]) => {
              const score = getScoreForBureau(key);
              const hasPurchased = score && score > 0;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  disabled={!hasPurchased}
                  className={`flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${!hasPurchased ? 'opacity-50' : ''}`}
                >
                  <span>{config.logo}</span>
                  <span className="hidden sm:inline">{config.name}</span>
                  <span className="font-bold">{hasPurchased ? score : 'N/A'}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(bureauConfig).map((bureau) => (
            <TabsContent key={bureau} value={bureau}>
              <BureauReportView 
                report={report}
                bureauName={bureauConfig[bureau].fullName}
                score={getScoreForBureau(bureau)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
