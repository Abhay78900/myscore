import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Users, FileText, TrendingUp, IndianRupee, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MasterAdminSidebar from '@/components/admin/MasterAdminSidebar';
import StatsCard from '@/components/admin/StatsCard';
import { mockCreditReports, mockTransactions, mockPartners, mockUsers } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MasterAdminDashboard() {
  const navigate = useNavigate();

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
  }));

  return (
    <div className="min-h-screen bg-background flex">
      <MasterAdminSidebar currentPage="MasterAdminDashboard" onLogout={handleLogout} />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
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
                      <div key={report.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
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
        </div>
      </main>
    </div>
  );
}
