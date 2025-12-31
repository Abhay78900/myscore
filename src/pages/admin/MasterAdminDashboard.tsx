import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Users, FileText, TrendingUp, IndianRupee, Building2, Settings, Wrench, CreditCard, UserCog, Search, Plus, Minus, Receipt, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MasterAdminSidebar from '@/components/admin/MasterAdminSidebar';
import StatsCard from '@/components/admin/StatsCard';
import UserTable from '@/components/admin/UserTable';
import ReportDetailModal from '@/components/admin/ReportDetailModal';
import WalletManagementDialog from '@/components/admin/WalletManagementDialog';
import PartnerFormDialog from '@/components/admin/PartnerFormDialog';
import ScoreRepairDetailDialog from '@/components/admin/ScoreRepairDetailDialog';
import { mockCreditReports, mockTransactions, mockPartners as initialMockPartners, mockUsers, mockScoreRepairRequests as initialRepairRequests, mockWalletTransactions } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { getAllReports, getAllTransactions } from '@/utils/reportStorage';
import { CreditReport, Partner, ScoreRepairRequest, WalletTransaction } from '@/types';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function MasterAdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Partner management state
  const [partners, setPartners] = useState<Partner[]>(initialMockPartners);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [walletDialogType, setWalletDialogType] = useState<'add' | 'deduct'>('add');
  const [partnerFormOpen, setPartnerFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);
  
  // Score repair state
  const [scoreRepairRequests, setScoreRepairRequests] = useState<ScoreRepairRequest[]>(initialRepairRequests);
  const [selectedRepairRequest, setSelectedRepairRequest] = useState<ScoreRepairRequest | null>(null);
  const [repairDialogOpen, setRepairDialogOpen] = useState(false);
  
  // Wallet transactions state
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate(createPageUrl('Home'));
  };

  // Get generated reports from centralized storage and combine with mock data
  const getStoredReports = (): CreditReport[] => {
    const storedReports = getAllReports();
    const mockIds = storedReports.map(r => r.id);
    const uniqueMock = mockCreditReports.filter(r => !mockIds.includes(r.id));
    return [...storedReports, ...uniqueMock];
  };

  const getStoredTransactions = () => {
    const storedTxns = getAllTransactions();
    const storedIds = storedTxns.map(t => t.id);
    const uniqueMock = mockTransactions.filter(t => !storedIds.includes(t.id));
    return [...storedTxns, ...uniqueMock];
  };

  const allReports = getStoredReports();
  const allTxns = getStoredTransactions();
  
  const totalRevenue = allTxns.filter(t => t.status === 'success').reduce((sum, t) => sum + t.amount, 0);
  const totalReports = allReports.length;
  const totalUsers = mockUsers.length;
  const activePartners = partners.filter(p => p.status === 'active').length;

  // Generate chart data
  const chartData = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM d'),
    revenue: Math.floor(Math.random() * 5000) + 1000,
    reports: Math.floor(Math.random() * 20) + 5,
  }));

  // Wallet management handlers
  const handleWalletAction = useCallback((partnerId: string, amount: number, description: string) => {
    const type = walletDialogType;
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const newBalance = type === 'add' 
          ? p.wallet_balance + amount 
          : Math.max(0, p.wallet_balance - amount);
        const newTotalLoaded = type === 'add' ? p.total_wallet_loaded + amount : p.total_wallet_loaded;
        
        // Create wallet transaction record
        const txn: WalletTransaction = {
          id: `wtxn_${Date.now()}`,
          partner_id: partnerId,
          partner_email: p.owner_email,
          transaction_type: type === 'add' ? 'credit' : 'debit',
          amount,
          balance_before: p.wallet_balance,
          balance_after: newBalance,
          description,
          status: 'success',
          created_date: new Date().toISOString(),
        };
        setWalletTransactions(prev => [txn, ...prev]);
        
        return { ...p, wallet_balance: newBalance, total_wallet_loaded: newTotalLoaded };
      }
      return p;
    }));
    
    toast.success(`Successfully ${type === 'add' ? 'added' : 'deducted'} ₹${amount}`);
  }, [walletDialogType]);

  // Partner CRUD handlers
  const handleCreateOrUpdatePartner = useCallback((data: Partial<Partner> & { password?: string }) => {
    if (editingPartner) {
      setPartners(prev => prev.map(p => 
        p.id === editingPartner.id ? { ...p, ...data } : p
      ));
      toast.success('Partner updated successfully');
    } else {
      setPartners(prev => [...prev, data as Partner]);
      toast.success('Partner created successfully');
    }
    setEditingPartner(null);
  }, [editingPartner]);

  const handleTogglePartnerStatus = useCallback((partnerId: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const newStatus = p.status === 'active' ? 'inactive' : 'active';
        toast.success(`Partner ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  }, []);

  const handleDeletePartner = useCallback(() => {
    if (partnerToDelete) {
      setPartners(prev => prev.filter(p => p.id !== partnerToDelete.id));
      toast.success('Partner deleted successfully');
      setPartnerToDelete(null);
      setDeleteConfirmOpen(false);
    }
  }, [partnerToDelete]);

  // Score repair handlers
  const handleUpdateRepairStatus = useCallback((requestId: string, status: ScoreRepairRequest['status'], notes?: string) => {
    setScoreRepairRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status, admin_notes: notes || r.admin_notes } : r
    ));
    toast.success(`Request status updated to ${status.replace('_', ' ')}`);
  }, []);

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
      const filteredReports = allReports.filter(r => 
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

    // Partners page with CRUD functionality
    if (currentPath.includes('/admin/partners')) {
      const filteredPartners = partners.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.franchise_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-display font-bold text-foreground">Partners & Franchises</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search partners..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64" />
              </div>
              <Button onClick={() => { setEditingPartner(null); setPartnerFormOpen(true); }} className="gap-2">
                <Plus className="w-4 h-4" /> Add Partner
              </Button>
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredPartners.map((partner) => (
              <Card key={partner.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{partner.name}</h3>
                        <p className="text-sm text-muted-foreground">{partner.franchise_id} • {partner.email}</p>
                        <p className="text-xs text-muted-foreground">{partner.phone} • {partner.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">₹{partner.wallet_balance.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Wallet Balance</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{partner.commission_rate}%</p>
                        <p className="text-xs text-muted-foreground">Commission</p>
                      </div>
                      <Badge className={
                        partner.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                        partner.status === 'suspended' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }>
                        {partner.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => { setEditingPartner(partner); setPartnerFormOpen(true); }}
                          title="Edit Partner"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleTogglePartnerStatus(partner.id)}
                          title={partner.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {partner.status === 'active' ? (
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ToggleLeft className="w-4 h-4 text-slate-400" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => { setPartnerToDelete(partner); setDeleteConfirmOpen(true); }}
                          className="text-red-600 hover:bg-red-50"
                          title="Delete Partner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredPartners.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Partners Found</h3>
                  <p className="text-muted-foreground mb-4">Create your first partner to get started</p>
                  <Button onClick={() => { setEditingPartner(null); setPartnerFormOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Partner
                  </Button>
                </CardContent>
              </Card>
            )}
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
            {partners.map((partner) => (
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                        onClick={() => {
                          setSelectedPartner(partner);
                          setWalletDialogType('add');
                          setWalletDialogOpen(true);
                        }}
                      >
                        <Plus className="w-3 h-3" /> Add
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setSelectedPartner(partner);
                          setWalletDialogType('deduct');
                          setWalletDialogOpen(true);
                        }}
                      >
                        <Minus className="w-3 h-3" /> Deduct
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Recent Wallet Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Wallet Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">Partner</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {walletTransactions.slice(0, 10).map((txn) => {
                      const partner = partners.find(p => p.id === txn.partner_id);
                      return (
                        <tr key={txn.id} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm">{partner?.name || 'Unknown'}</td>
                          <td className="px-4 py-3">
                            <Badge className={txn.transaction_type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}>
                              {txn.transaction_type}
                            </Badge>
                          </td>
                          <td className={`px-4 py-3 text-sm font-semibold ${txn.transaction_type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {txn.transaction_type === 'credit' ? '+' : '-'}₹{txn.amount}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{txn.description}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{format(new Date(txn.created_date), 'dd MMM yyyy')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
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
                    {allTxns.slice(0, 20).map((txn) => (
                      <tr key={txn.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-mono">{txn.transaction_id.slice(0, 12)}...</td>
                        <td className="px-4 py-3 text-sm">{txn.client_name || txn.user_email}</td>
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
      const handleViewReport = (report: CreditReport) => {
        sessionStorage.setItem('viewReport', JSON.stringify(report));
        navigate(`/credit-report?reportId=${report.id}&viewer=admin`);
      };
      
      return (
        <div className="space-y-6">
          <h1 className="text-2xl font-display font-bold text-foreground">Reports Repository</h1>
          <p className="text-muted-foreground">All {allReports.length} generated reports from users and partners</p>
          <UserTable 
            reports={allReports} 
            onViewReport={handleViewReport} 
            onDownload={() => {}} 
          />
        </div>
      );
    }

    // Score Repair page with full functionality
    if (currentPath.includes('/admin/score-repair')) {
      const pendingCount = scoreRepairRequests.filter(r => r.status === 'pending').length;
      const inProgressCount = scoreRepairRequests.filter(r => r.status === 'in_progress').length;
      
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Score Repair Requests</h1>
              <p className="text-muted-foreground">{pendingCount} pending • {inProgressCount} in progress</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {scoreRepairRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.user_name}</h3>
                        <p className="text-sm text-muted-foreground">{request.user_email}</p>
                        <p className="text-xs text-muted-foreground">{request.user_mobile}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="font-bold text-red-600">{request.current_score}</p>
                      </div>
                      <div className="text-center">
                        <span className="text-muted-foreground">→</span>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="font-bold text-emerald-600">{request.target_score}</p>
                      </div>
                      <Badge className={
                        request.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        request.status === 'in_progress' ? 'bg-purple-100 text-purple-700' :
                        request.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                        request.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }>
                        {request.status.replace('_', ' ')}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedRepairRequest(request);
                          setRepairDialogOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {scoreRepairRequests.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Repair Requests</h3>
                  <p className="text-muted-foreground">There are no score repair requests at the moment</p>
                </CardContent>
              </Card>
            )}
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
          <StatsCard title="Active Partners" value={`${activePartners}/${partners.length}`} icon={Building2} color="teal" delay={0.3} />
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
                  {allReports.slice(0, 5).map((report) => (
                    <div 
                      key={report.id} 
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted" 
                      onClick={() => {
                        sessionStorage.setItem('viewReport', JSON.stringify(report));
                        navigate(`/credit-report?reportId=${report.id}&viewer=admin`);
                      }}
                    >
                      <div>
                        <p className="font-medium text-foreground">{report.full_name}</p>
                        <p className="text-sm text-muted-foreground">{report.pan_number} • {report.initiated_by === 'partner' ? 'Partner' : 'User'}</p>
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

      {/* Modals */}
      <ReportDetailModal
        report={selectedReport}
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        onDownload={() => {}}
      />
      
      <WalletManagementDialog
        isOpen={walletDialogOpen}
        onClose={() => { setWalletDialogOpen(false); setSelectedPartner(null); }}
        partner={selectedPartner}
        type={walletDialogType}
        onConfirm={handleWalletAction}
      />
      
      <PartnerFormDialog
        isOpen={partnerFormOpen}
        onClose={() => { setPartnerFormOpen(false); setEditingPartner(null); }}
        partner={editingPartner}
        onSubmit={handleCreateOrUpdatePartner}
      />
      
      <ScoreRepairDetailDialog
        isOpen={repairDialogOpen}
        onClose={() => { setRepairDialogOpen(false); setSelectedRepairRequest(null); }}
        request={selectedRepairRequest}
        onUpdateStatus={handleUpdateRepairStatus}
      />
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Partner</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {partnerToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePartner} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
