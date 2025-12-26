import React from 'react';
import { format } from 'date-fns';
import { CreditReport } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BureauReportViewProps {
  report: CreditReport;
  bureauName: string;
  score: number;
  controlNumber?: number;
}

const BureauReportView: React.FC<BureauReportViewProps> = ({
  report,
  bureauName,
  score,
  controlNumber = Math.floor(Math.random() * 9000000000) + 1000000000,
}) => {
  const getScoreColor = (s: number) => {
    if (s >= 750) return 'text-emerald-600';
    if (s >= 650) return 'text-teal-600';
    if (s >= 550) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreCategory = (s: number) => {
    if (s >= 750) return { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700' };
    if (s >= 700) return { label: 'Very Good', color: 'bg-teal-100 text-teal-700' };
    if (s >= 650) return { label: 'Good', color: 'bg-cyan-100 text-cyan-700' };
    if (s >= 550) return { label: 'Average', color: 'bg-amber-100 text-amber-700' };
    return { label: 'Poor', color: 'bg-red-100 text-red-700' };
  };

  const category = getScoreCategory(score);
  const allAccounts = [
    ...(report.active_loans || []),
    ...(report.credit_cards?.map(c => ({
      loan_type: 'Credit Card',
      lender: c.bank,
      account_number: 'XXXX' + Math.floor(Math.random() * 9000 + 1000),
      sanctioned_amount: c.credit_limit,
      current_balance: c.current_balance,
      status: c.status,
      payment_history: c.payment_history,
    })) || []),
  ];

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{bureauName}</p>
              <p className="text-xs text-muted-foreground">Control Number: {controlNumber}</p>
              <p className="text-xs text-muted-foreground">
                Report Date: {format(new Date(), 'EEE MMM dd yyyy')}
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</p>
              <Badge className={`mt-2 ${category.color}`}>{category.label}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{report.full_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{report.date_of_birth || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{report.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">PAN</p>
              <p className="font-medium font-mono">{report.pan_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{report.total_accounts}</p>
              <p className="text-muted-foreground">Total Accounts</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600">{report.active_accounts}</p>
              <p className="text-muted-foreground">Active</p>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{report.closed_accounts}</p>
              <p className="text-muted-foreground">Closed</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-amber-600">{report.credit_utilization}%</p>
              <p className="text-muted-foreground">Utilization</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {allAccounts.map((account, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <p className="font-semibold">{account.lender}</p>
                  <p className="text-sm text-muted-foreground">{account.loan_type}</p>
                </div>
                <Badge variant="outline">{account.status || 'Active'}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Account No.</p>
                  <p className="font-mono">{account.account_number}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Sanctioned</p>
                  <p className="font-medium">₹{account.sanctioned_amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Balance</p>
                  <p className="font-medium">₹{account.current_balance?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{account.status || 'Active'}</p>
                </div>
              </div>
            </div>
          ))}
          {allAccounts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No accounts found</p>
          )}
        </CardContent>
      </Card>

      {/* Enquiries */}
      {report.enquiry_details && report.enquiry_details.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Enquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.enquiry_details.slice(0, 5).map((enquiry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{enquiry.institution}</p>
                    <p className="text-sm text-muted-foreground">{enquiry.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">₹{enquiry.amount?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(enquiry.date), 'dd MMM yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Score Factors */}
      {report.score_factors && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Score Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(report.score_factors).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-muted-foreground">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        value >= 80 ? 'bg-emerald-500' :
                        value >= 60 ? 'bg-teal-500' :
                        value >= 40 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BureauReportView;
