import React, { useState, useCallback } from 'react';
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
import { mockPartners, mockCreditReports, mockWalletTransactions, bureauConfig } from '@/data/mockData';
import { CreditReport, Partner, WalletTransaction, Transaction } from '@/types';
import { toast } from 'sonner';

const PRICE_PER_BUREAU = 99;

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  
  // State management for partner data
  const [partner, setPartner] = useState<Partner>(() => ({ ...mockPartners[0] }));
  const [generatedReports, setGeneratedReports] = useState<CreditReport[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => 
    mockWalletTransactions.filter(t => t.partner_id === mockPartners[0].id)
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  const handleLoadFunds = useCallback(async (amount: number) => {
    const balanceBefore = partner.wallet_balance;
    const balanceAfter = balanceBefore + amount;
    
    // Update partner wallet balance
    setPartner(prev => ({
      ...prev,
      wallet_balance: balanceAfter,
      total_wallet_loaded: prev.total_wallet_loaded + amount
    }));
    
    // Add wallet transaction
    const newTransaction: WalletTransaction = {
      id: `wtxn_${Date.now()}`,
      partner_id: partner.id,
      partner_email: partner.owner_email,
      transaction_type: 'credit',
      amount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: 'Wallet top-up via payment gateway',
      status: 'success',
      created_date: new Date().toISOString()
    };
    
    setWalletTransactions(prev => [newTransaction, ...prev]);
    toast.success(`₹${amount} added to wallet successfully!`);
  }, [partner]);

  const handleGenerateReport = useCallback(async (clientData: { full_name: string; pan_number: string; mobile: string; date_of_birth: string }, bureaus: string[]) => {
    const totalAmount = bureaus.length * PRICE_PER_BUREAU;
    
    // Check wallet balance
    if (partner.wallet_balance < totalAmount) {
      throw new Error('Insufficient wallet balance');
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const balanceBefore = partner.wallet_balance;
    const balanceAfter = balanceBefore - totalAmount;
    
    // Generate scores only for selected bureaus
    const scores: Record<string, number> = {};
    bureaus.forEach(bureauId => {
      scores[bureauId] = 600 + Math.floor(Math.random() * 250);
    });
    
    const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / bureaus.length);
    
    // Create new report
    const newReport: CreditReport = {
      id: `report_${Date.now()}`,
      user_email: `${clientData.pan_number.toLowerCase()}@client.com`,
      full_name: clientData.full_name,
      pan_number: clientData.pan_number,
      mobile: clientData.mobile,
      date_of_birth: clientData.date_of_birth,
      gender: 'Not Specified',
      address: 'Address on file',
      report_status: 'UNLOCKED',
      initiated_by: 'partner',
      initiator_email: partner.owner_email,
      partner_id: partner.id,
      bureaus_checked: bureaus.map(b => bureauConfig[b]?.fullName || b),
      cibil_score: scores.cibil,
      experian_score: scores.experian,
      equifax_score: scores.equifax,
      crif_score: scores.crif,
      average_score: avgScore,
      score_category: avgScore >= 750 ? 'Excellent' : avgScore >= 700 ? 'Very Good' : avgScore >= 650 ? 'Good' : avgScore >= 550 ? 'Average' : 'Poor',
      report_generated_at: new Date().toISOString(),
      created_date: new Date().toISOString(),
      credit_utilization: Math.floor(Math.random() * 60) + 10,
      total_accounts: Math.floor(Math.random() * 5) + 1,
      active_accounts: Math.floor(Math.random() * 3) + 1,
      closed_accounts: Math.floor(Math.random() * 2),
      hard_enquiries: Math.floor(Math.random() * 5) + 1,
      soft_enquiries: Math.floor(Math.random() * 3),
      active_loans: [],
      closed_loans: [],
      credit_cards: [],
      enquiry_details: [],
      oldest_account_age_months: Math.floor(Math.random() * 60) + 12,
      credit_age_years: Math.floor(Math.random() * 5) + 1,
      score_factors: {
        payment_history: 70 + Math.floor(Math.random() * 30),
        credit_utilization: 50 + Math.floor(Math.random() * 50),
        credit_age: 40 + Math.floor(Math.random() * 60),
        credit_mix: 60 + Math.floor(Math.random() * 40),
        new_credit: 50 + Math.floor(Math.random() * 50),
      },
      improvement_tips: [
        'Maintain low credit utilization below 30%',
        'Pay all EMIs and bills on time',
      ],
      is_high_risk: avgScore < 600,
      risk_flags: avgScore < 600 ? ['Low credit score'] : [],
    };
    
    // Create transaction record
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      user_email: newReport.user_email,
      transaction_id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      payment_gateway: 'wallet',
      amount: totalAmount,
      bureaus_purchased: bureaus,
      report_count: bureaus.length,
      status: 'success',
      payment_method: 'Wallet',
      initiated_by: 'partner',
      initiator_email: partner.owner_email,
      partner_id: partner.id,
      created_date: new Date().toISOString(),
      client_name: clientData.full_name,
      client_pan: clientData.pan_number,
      client_mobile: clientData.mobile,
    };
    
    // Create wallet debit transaction
    const walletDebit: WalletTransaction = {
      id: `wtxn_${Date.now()}`,
      partner_id: partner.id,
      partner_email: partner.owner_email,
      transaction_type: 'debit',
      amount: totalAmount,
      balance_before: balanceBefore,
      balance_after: balanceAfter,
      description: `Report generated for ${clientData.full_name} (${bureaus.length} bureau${bureaus.length > 1 ? 's' : ''})`,
      reference_id: newTransaction.transaction_id,
      status: 'success',
      created_date: new Date().toISOString()
    };
    
    // Update all state
    setGeneratedReports(prev => [newReport, ...prev]);
    setTransactions(prev => [newTransaction, ...prev]);
    setWalletTransactions(prev => [walletDebit, ...prev]);
    setPartner(prev => ({
      ...prev,
      wallet_balance: balanceAfter,
      total_sales: prev.total_sales + 1,
      total_revenue: prev.total_revenue + totalAmount,
    }));
    
    // Store report in sessionStorage for admin panel access
    const existingReports = JSON.parse(sessionStorage.getItem('generatedReports') || '[]');
    sessionStorage.setItem('generatedReports', JSON.stringify([newReport, ...existingReports]));
    
    // Store transaction for admin panel
    const existingTxns = JSON.parse(sessionStorage.getItem('allTransactions') || '[]');
    sessionStorage.setItem('allTransactions', JSON.stringify([newTransaction, ...existingTxns]));
    
  }, [partner]);

  // Combine mock reports with generated reports
  const allPartnerReports = [...generatedReports, ...mockCreditReports.filter(r => r.partner_id === partner.id)];

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
            reports={allPartnerReports} 
            transactions={transactions}
            onViewReport={(report) => {
              sessionStorage.setItem('viewReport', JSON.stringify(report));
              navigate(createPageUrl('CreditReport'));
            }}
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
              <WalletTransactionHistory transactions={walletTransactions} />
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
            <StatsCard title="Active Clients" value={allPartnerReports.length} icon={Users} color="teal" delay={0.4} />
          </div>
        </div>

        {/* Reports & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PartnerReportHistory 
            reports={allPartnerReports.slice(0, 5)} 
            transactions={transactions}
            onViewReport={(report) => {
              sessionStorage.setItem('viewReport', JSON.stringify(report));
              navigate(createPageUrl('CreditReport'));
            }}
          />
          <WalletTransactionHistory transactions={walletTransactions} />
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
