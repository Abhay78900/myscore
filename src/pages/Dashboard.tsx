import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  RefreshCw,
  User,
  TrendingUp,
  Clock,
  FileText,
  Loader2,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Eye,
  Download,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CreditScoreGauge from '@/components/credit/CreditScoreGauge';
import ScoreHistoryChart from '@/components/dashboard/ScoreHistoryChart';
import { getCurrentUser, mockCreditReports, setCurrentUserRole } from '@/data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState(mockCreditReports.slice(0, 5));
  const [latestReport, setLatestReport] = useState(mockCreditReports[0]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCurrentUserRole('USER');
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const user = getCurrentUser();

  const handleViewReport = (reportId: string) => {
    navigate(createPageUrl('CreditReport') + `?reportId=${reportId}`);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getScoreChange = () => {
    if (reports.length < 2) return null;
    return (reports[0].average_score || 0) - (reports[1].average_score || 0);
  };

  const scoreChange = getScoreChange();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-4 md:px-8 border-b border-border bg-card sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">CreditCheck</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:block">
              Welcome, {user?.full_name || 'User'}
            </span>
            <Button variant="ghost" onClick={handleLogout} className="gap-2 text-muted-foreground">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              Your Credit Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your credit health and track your progress over time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-border overflow-hidden shadow-card">
                  <div className="bg-gradient-navy p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{latestReport.full_name}</p>
                          <p className="text-white/70 text-sm font-mono">{latestReport.pan_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex justify-center">
                      <CreditScoreGauge score={latestReport.average_score} size={200} />
                    </div>
                    
                    {scoreChange !== null && (
                      <div className={`mt-4 flex items-center justify-center gap-2 ${
                        scoreChange >= 0 ? 'text-credit-excellent' : 'text-credit-poor'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${scoreChange < 0 ? 'rotate-180' : ''}`} />
                        <span className="font-medium">
                          {scoreChange >= 0 ? '+' : ''}{scoreChange} points since last check
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-6 flex gap-3">
                      <Button 
                        onClick={() => handleViewReport(latestReport.id)}
                        className="flex-1"
                      >
                        View Full Report
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(createPageUrl('CheckScore'))}
                        className="gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <Card className="border-border shadow-card">
                  <CardContent className="pt-6 text-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {latestReport.active_loans?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Active Loans</p>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-card">
                  <CardContent className="pt-6 text-center">
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-5 h-5 text-accent" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {latestReport.credit_utilization || 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Credit Used</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Last Checked */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-border shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                        <Clock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Checked</p>
                        <p className="font-semibold text-foreground">
                          {format(new Date(latestReport.created_date), 'dd MMM yyyy, HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Risk Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className={`border ${latestReport.is_high_risk ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      {latestReport.is_high_risk ? (
                        <>
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                          <div>
                            <p className="font-semibold text-red-800">High Risk Profile</p>
                            <p className="text-sm text-red-600">
                              {latestReport.risk_flags?.length || 0} risk factors detected
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          <div>
                            <p className="font-semibold text-emerald-800">Healthy Profile</p>
                            <p className="text-sm text-emerald-600">No major risk flags</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score History Chart */}
              <ScoreHistoryChart reports={reports} />

              {/* Recent Reports */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Reports</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-2">
                      View All <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reports.slice(0, 5).map((report, index) => (
                        <motion.div
                          key={report.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{report.full_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(report.created_date), 'dd MMM yyyy')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`text-lg font-bold ${
                                report.average_score >= 750 ? 'text-credit-excellent' :
                                report.average_score >= 650 ? 'text-credit-good' :
                                report.average_score >= 550 ? 'text-credit-average' : 'text-credit-poor'
                              }`}>
                                {report.average_score}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {report.score_category}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewReport(report.id)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
