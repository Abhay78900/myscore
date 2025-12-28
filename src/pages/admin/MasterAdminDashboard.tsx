import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Users, FileText, TrendingUp, IndianRupee, Building2, Settings, Wrench, CreditCard, UserCog, Search, Plus, Minus, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MasterAdminSidebar from '@/components/admin/MasterAdminSidebar';
import StatsCard from '@/components/admin/StatsCard';
import UserTable from '@/components/admin/UserTable';
import ReportDetailModal from '@/components/admin/ReportDetailModal';
import { mockCreditReports, mockTransactions, mockPartners, mockUsers, mockScoreRepairRequests, mockWalletTransactions } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';

export default function MasterAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  const totalRevenue = mockTransactions.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalReports = mockCreditReports.length;
  const totalUsers = mockUsers.length;
  const activePartners = mockPartners.filter(p => p.status === 'active').length;

  // Generate chart data
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM d'),
    revenue: Math.floor(Math.random() * 5000) + 1000,
    reports: Math.floor(Math.random() * 20) + 5,
  }));

  // Determine which content to show based on route
  const currentPath = location.pathname;
  
  const renderContent = () => {
    // Analytics page
    if (currentPath.includes('/admin/analytics')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Analytics Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} color="emerald" trend="up" trendValue="+12%" delay={0} />
            <StatsCard title="Total Reports" value={totalReports} icon={FileText} color="blue" trend="up" trendValue="+8%" delay={0.1} />
            <StatsCard title="Active Users" value={totalUsers} icon={Users} color="purple" trend="up" trendValue="+5%" delay={0.2} />
            <StatsCard title="Conversion Rate" value="24.5%" icon={TrendingUp} color="teal" trend="up" trendValue="+2%" delay={0.3} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Reports Generated</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reports" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Users/User Role Management page
    if (currentPath.includes('/admin/users') || currentPath.includes('/admin/user-roles')) {
      const filteredReports = mockCreditReports.filter(r => 
        r.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.pan_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-foreground">
              {currentPath.includes('/admin/user-roles') ? 'User Role Management' : 'All Users'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
              </div>
            </div>
          </div>
          <UserTable reports={filteredReports} onViewReport={setSelectedReport} onDownload={() => {}} />
        </div>
      );
    }

    // Partners page
    if (currentPath.includes('/admin/partners')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Partners & Franchises</h1>
          <div className="grid gap-4">
            {mockPartners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">{partner.franchise_id} • {partner.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-semibold">₹{partner.wallet_balance.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Wallet Balance</p>
                    </div>
                    <Badge className={partner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                      {partner.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Partner Wallets page with admin controls
    if (currentPath.includes('/admin/partner-wallets')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Partner Wallet Management</h1>
          <div className="grid gap-4">
            {mockPartners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground">{partner.franchise_id} • {partner.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-semibold text-emerald-600">₹{partner.wallet_balance.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Current Balance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">₹{partner.total_wallet_loaded.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Total Loaded</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                        <Plus className="w-3 h-3" /> Add
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50">
                        <Minus className="w-3 h-3" /> Deduct
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Transactions page
    if (currentPath.includes('/admin/transactions')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">All Transactions</h1>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Transaction ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockTransactions.slice(0, 20).map((txn) => (
                      <tr key={txn.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-mono">{txn.transaction_id.slice(0, 12)}...</td>
                        <td className="px-4 py-3 text-sm">{txn.user_email}</td>
                        <td className="px-4 py-3 text-sm font-semibold">₹{txn.amount}</td>
                        <td className="px-4 py-3 text-sm capitalize">{txn.initiated_by}</td>
                        <td className="px-4 py-3">
                          <Badge className={txn.status === 'success' ? 'bg-emerald-100 text-emerald-700' : txn.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}>
                            {txn.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{format(new Date(txn.created_date), 'dd MMM yyyy')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Reports Repository page
    if (currentPath.includes('/admin/reports-repository')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Reports Repository</h1>
          <UserTable reports={mockCreditReports} onViewReport={setSelectedReport} onDownload={() => {}} />
        </div>
      );
    }

    // Score Repair page
    if (currentPath.includes('/admin/score-repair')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Score Repair Requests</h1>
          <div className="grid gap-4">
            {mockScoreRepairRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{request.user_name}</h3>
                      <p className="text-sm text-muted-foreground">Current Score: {request.current_score} • Target: {request.target_score}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={
                      request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      request.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }>
                      {request.status}
                    </Badge>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Settings page
    if (currentPath.includes('/admin/settings')) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Admin Settings</h1>
          <Card>
            <CardContent className="p-8 text-center">
              <Settings className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Settings Coming Soon</h3>
              <p className="text-muted-foreground">Configure system settings, bureau APIs, pricing and more.</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default Dashboard view
    return (
      <>
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground">Master Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={IndianRupee} color="emerald" delay={0} />
          <StatsCard title="Total Users" value={totalUsers} icon={Users} color="blue" delay={0.1} />
          <StatsCard title="Reports Generated" value={totalReports} icon={FileText} color="purple" delay={0.2} />
          <StatsCard title="Active Partners" value={`${activePartners}/${mockPartners.length}`} icon={Building2} color="teal" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Revenue (Last 7 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCreditReports.slice(0, 5).map((report, i) => (
                    <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" onClick={() => setSelectedReport(report)}>
                      <div>
                        <p className="font-medium text-foreground">{report.full_name}</p>
                        <p className="text-sm text-muted-foreground">{report.pan_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{report.average_score}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(report.created_date), 'dd MMM')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      <MasterAdminSidebar currentPage="MasterAdminDashboard" onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <ReportDetailModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onDownload={() => {}}
      />
    </div>
  );
}
