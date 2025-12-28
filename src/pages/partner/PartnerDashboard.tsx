import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, Wallet, TrendingUp, IndianRupee, Copy, Check, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import StatsCard from '@/components/admin/StatsCard';
import WalletCard from '@/components/partner/WalletCard';
import GenerateReportDialog from '@/components/partner/GenerateReportDialog';
import PartnerReportHistory from '@/components/partner/PartnerReportHistory';
import WalletTransactionHistory from '@/components/partner/WalletTransactionHistory';
import { mockPartners, mockCreditReports, mockWalletTransactions } from '@/data/mockData';
import { toast } from 'sonner';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const partner = mockPartners[0];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(partner.franchise_id);
    setCopied(true);
    toast.success('Referral code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadFunds = async (amount: number) => {
    toast.success(`₹${amount} added to wallet successfully!`);
  };

  const handleGenerateReport = async (clientData: any, bureaus: string[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Credit report generated successfully!');
  };

  const partnerReports = mockCreditReports.filter(r => r.partner_id === partner.id);
  const partnerTransactions = mockWalletTransactions.filter(t => t.partner_id === partner.id);

  // Determine which content to show based on route
  const currentPath = location.pathname;
  const isReportsPage = currentPath.includes('/partner/reports');
  const isClientsPage = currentPath.includes('/partner/clients');
  const isWalletPage = currentPath.includes('/partner/wallet');
  const isMarketingPage = currentPath.includes('/partner/marketing');

  const renderContent = () => {
    if (isReportsPage) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Reports History</h1>
              <p className="text-muted-foreground">View all generated credit reports</p>
            </div>
            <Button onClick={() => setShowGenerateDialog(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Generate New Report
            </Button>
          </div>
          <PartnerReportHistory 
            reports={partnerReports} 
            transactions={partnerTransactions}
            onViewReport={(report) => navigate(createPageUrl('CreditReport'))}
          />
        </div>
      );
    }

    if (isClientsPage) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">My Clients</h1>
              <p className="text-muted-foreground">Manage your client base</p>
            </div>
            <Button onClick={() => setShowGenerateDialog(true)} className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" /> Add New Client
            </Button>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Client Management Coming Soon</h3>
              <p className="text-muted-foreground">You can generate reports for clients using the button above.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isWalletPage) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Wallet Management</h1>
            <p className="text-muted-foreground">Load funds and view transaction history</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <WalletCard partner={partner} onLoadFunds={handleLoadFunds} />
            </div>
            <div className="lg:col-span-2">
              <WalletTransactionHistory transactions={partnerTransactions} />
            </div>
          </div>
        </div>
      );
    }

    if (isMarketingPage) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Marketing & Referrals</h1>
            <p className="text-muted-foreground">Grow your business with referral codes</p>
          </div>
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Marketing Tools Coming Soon</h3>
              <p className="text-muted-foreground">Share your referral code: <strong>{partner.franchise_id}</strong></p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default dashboard view
    return (
      <>
        {/* Referral Code Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-purple-200 text-sm mb-1">Your Franchise ID / Referral Code</p>
                  <div className="flex items-center gap-3">
                    <code className="text-3xl font-bold tracking-wider">{partner.franchise_id}</code>
                    <Button variant="ghost" size="icon" onClick={copyReferralCode} className="text-white hover:bg-white/20">
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setShowGenerateDialog(true)} className="bg-white text-purple-700 hover:bg-purple-50 gap-2">
                    <FileText className="w-4 h-4" /> Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Wallet & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <WalletCard partner={partner} onLoadFunds={handleLoadFunds} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            <StatsCard title="Total Sales" value={partner.total_sales} icon={FileText} color="blue" delay={0.1} />
            <StatsCard title="Revenue Generated" value={`₹${partner.total_revenue.toLocaleString()}`} icon={TrendingUp} color="purple" delay={0.2} />
            <StatsCard title="Commission Earned" value={`₹${partner.total_commission_earned.toLocaleString()}`} icon={IndianRupee} color="amber" delay={0.3} />
            <StatsCard title="Active Clients" value={partnerReports.length} icon={Users} color="teal" delay={0.4} />
          </div>
        </div>

        {/* Reports & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PartnerReportHistory 
            reports={partnerReports.slice(0, 5)} 
            transactions={partnerTransactions}
            onViewReport={(report) => navigate(createPageUrl('CreditReport'))}
          />
          <WalletTransactionHistory transactions={partnerTransactions} />
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <PartnerSidebar currentPage="PartnerDashboard" onLogout={handleLogout} partner={partner} />
      
      <main className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {!isReportsPage && !isClientsPage && !isWalletPage && !isMarketingPage && (
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold text-foreground">Partner Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {partner.name}</p>
            </div>
          )}
          {renderContent()}
        </div>
      </main>

      <GenerateReportDialog
        isOpen={showGenerateDialog}
        onClose={() => setShowGenerateDialog(false)}
        onGenerate={handleGenerateReport}
        walletBalance={partner.wallet_balance}
      />
    </div>
  );
}
