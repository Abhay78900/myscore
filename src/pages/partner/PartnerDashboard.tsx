import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, Wallet, TrendingUp, IndianRupee, Copy, Check, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PartnerSidebar from '@/components/partner/PartnerSidebar';
import StatsCard from '@/components/admin/StatsCard';
import { mockPartners, mockCreditReports } from '@/data/mockData';
import { useState } from 'react';
import { toast } from 'sonner';

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
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

  const partnerReports = mockCreditReports.filter(r => r.partner_id === partner.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex">
      <PartnerSidebar currentPage="PartnerDashboard" onLogout={handleLogout} partner={partner} />
      
      <main className="flex-1 px-6 py-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
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
                  <Button onClick={copyReferralCode} className="bg-white text-purple-700 hover:bg-purple-50 gap-2">
                    <Copy className="w-4 h-4" /> Copy Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title="Wallet Balance" value={`₹${partner.wallet_balance.toLocaleString()}`} icon={Wallet} color="emerald" delay={0} />
            <StatsCard title="Total Sales" value={partner.total_sales} icon={FileText} color="blue" delay={0.1} />
            <StatsCard title="Revenue Generated" value={`₹${partner.total_revenue.toLocaleString()}`} icon={TrendingUp} color="purple" delay={0.2} />
            <StatsCard title="Commission Earned" value={`₹${partner.total_commission_earned.toLocaleString()}`} icon={IndianRupee} color="amber" delay={0.3} />
          </div>

          {/* Recent Reports */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Client Reports</CardTitle>
              </CardHeader>
              <CardContent>
                {partnerReports.length > 0 ? (
                  <div className="space-y-3">
                    {partnerReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{report.full_name}</p>
                          <p className="text-sm text-muted-foreground">{report.pan_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{report.average_score}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(report.created_date), 'dd MMM yyyy')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No reports generated yet. Start generating client reports!</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
