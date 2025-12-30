import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  ArrowLeft,
  Download,
  Lock,
  User,
  Building2,
  Shield,
} from 'lucide-react';
import BureauReportView from '@/components/credit/BureauReportView';
import { CreditReport } from '@/types';
import { bureauConfig } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface UnifiedReportViewerProps {
  report: CreditReport;
  viewerType: 'user' | 'partner' | 'admin';
  onBack?: () => void;
}

export default function UnifiedReportViewer({ report, viewerType, onBack }: UnifiedReportViewerProps) {
  const navigate = useNavigate();

  const getScoreForBureau = (bureau: string): number => {
    switch (bureau) {
      case 'cibil': return report?.cibil_score || 0;
      case 'experian': return report?.experian_score || 0;
      case 'equifax': return report?.equifax_score || 0;
      case 'crif': return report?.crif_score || 0;
      default: return 0;
    }
  };
  
  // Determine first available bureau
  const getFirstAvailableBureau = (): string => {
    const bureaus = ['cibil', 'experian', 'equifax', 'crif'];
    for (const bureau of bureaus) {
      const score = getScoreForBureau(bureau);
      if (score && score > 0) return bureau;
    }
    return 'cibil';
  };
  
  const [selectedBureau, setSelectedBureau] = React.useState(getFirstAvailableBureau);

  const handleDownload = (bureau: string) => {
    const content = `Credit Report - ${report.full_name}\nBureau: ${bureauConfig[bureau]?.fullName || bureau}\nScore: ${getScoreForBureau(bureau)}\nGenerated: ${new Date().toDateString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${bureauConfig[bureau]?.name || bureau}_Report_${report.pan_number}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Get available bureaus (only those with scores > 0)
  const availableBureaus = Object.entries(bureauConfig).filter(([key]) => {
    const score = getScoreForBureau(key);
    return score && score > 0;
  });

  const getViewerLabel = () => {
    switch (viewerType) {
      case 'admin': return { icon: Shield, label: 'Admin View', color: 'bg-red-100 text-red-700' };
      case 'partner': return { icon: Building2, label: 'Partner View', color: 'bg-purple-100 text-purple-700' };
      default: return { icon: User, label: 'User View', color: 'bg-blue-100 text-blue-700' };
    }
  };

  const viewerInfo = getViewerLabel();
  const ViewerIcon = viewerInfo.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-bold text-foreground">Credit Report</h1>
                    <Badge className={viewerInfo.color}>
                      <ViewerIcon className="w-3 h-3 mr-1" />
                      {viewerInfo.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {report.full_name} • {report.pan_number}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <Lock className="w-3 h-3 mr-1" />
                UNLOCKED
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload(selectedBureau)} 
                className="gap-2"
              >
                <Download className="w-4 h-4" /> Download {bureauConfig[selectedBureau]?.name || selectedBureau}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Report Metadata */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <span>Report ID: <strong className="text-foreground font-mono">{report.id}</strong></span>
          <span>Generated: <strong className="text-foreground">{format(new Date(report.report_generated_at || report.created_date), 'dd MMM yyyy, HH:mm')}</strong></span>
          <span>Initiated by: <strong className="text-foreground capitalize">{report.initiated_by}</strong></span>
          {report.partner_id && <span>Partner: <strong className="text-foreground">{report.partner_id}</strong></span>}
        </div>
      </div>

      {/* Bureau Tabs */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <Tabs value={selectedBureau} onValueChange={setSelectedBureau}>
          <TabsList className={`grid mb-6 bg-card border border-border`} style={{ gridTemplateColumns: `repeat(${availableBureaus.length}, 1fr)` }}>
            {availableBureaus.map(([key, config]) => {
              const score = getScoreForBureau(key);
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span>{config.logo}</span>
                  <span className="hidden sm:inline">{config.name}</span>
                  <span className="font-bold">{score}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {availableBureaus.map(([bureau]) => (
            <TabsContent key={bureau} value={bureau}>
              <BureauReportView 
                report={report}
                bureauName={bureauConfig[bureau]?.fullName || bureau}
                score={getScoreForBureau(bureau)}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
