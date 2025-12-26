import { CreditReport, Partner, Transaction, User, WalletTransaction, ScoreRepairRequest } from '@/types';
import { subDays, format } from 'date-fns';

// Generate random date within range
const randomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Generate payment history
const generatePaymentHistory = () => {
  const history = [];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const currentDate = new Date();
  for (let i = 0; i < 36; i++) {
    const dt = new Date(currentDate);
    dt.setMonth(dt.getMonth() - i);
    const dpd = Math.random() > 0.92 ? Math.floor(Math.random() * 30) : 0;
    history.push({ month: months[dt.getMonth()], year: dt.getFullYear(), status: dpd === 0 ? 'STD' : `${dpd}`, dpd });
  }
  return history;
};

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'user_1',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    user_role: 'USER',
    created_date: '2024-01-15T10:30:00Z',
    phone: '+91 98765 43210',
  },
  {
    id: 'user_2',
    email: 'admin@creditcheck.com',
    full_name: 'Admin User',
    user_role: 'MASTER_ADMIN',
    created_date: '2023-06-01T08:00:00Z',
  },
  {
    id: 'user_3',
    email: 'partner@example.com',
    full_name: 'Partner Admin',
    user_role: 'PARTNER_ADMIN',
    created_date: '2024-02-20T14:00:00Z',
  },
];

// Mock Partners
export const mockPartners: Partner[] = [
  {
    id: 'partner_1',
    name: 'ABC Financial Services',
    owner_email: 'partner@example.com',
    franchise_id: 'ABC123',
    phone: '+91 98765 11111',
    address: 'Mumbai, Maharashtra',
    commission_rate: 20,
    status: 'active',
    wallet_balance: 15000,
    total_wallet_loaded: 50000,
    total_sales: 125,
    total_revenue: 49500,
    total_commission_earned: 9900,
    total_commission_paid: 5000,
    created_date: '2024-02-01T10:00:00Z',
  },
  {
    id: 'partner_2',
    name: 'XYZ Credit Advisors',
    owner_email: 'xyz@example.com',
    franchise_id: 'XYZ456',
    phone: '+91 98765 22222',
    address: 'Delhi, NCR',
    commission_rate: 18,
    status: 'active',
    wallet_balance: 8500,
    total_wallet_loaded: 30000,
    total_sales: 78,
    total_revenue: 30888,
    total_commission_earned: 5560,
    total_commission_paid: 3000,
    created_date: '2024-03-15T12:00:00Z',
  },
  {
    id: 'partner_3',
    name: 'LMN Finance Hub',
    owner_email: 'lmn@example.com',
    franchise_id: 'LMN789',
    phone: '+91 98765 33333',
    address: 'Bangalore, Karnataka',
    commission_rate: 22,
    status: 'inactive',
    wallet_balance: 0,
    total_wallet_loaded: 10000,
    total_sales: 25,
    total_revenue: 9900,
    total_commission_earned: 2178,
    total_commission_paid: 2178,
    created_date: '2024-04-01T09:00:00Z',
  },
];

// Mock Credit Reports
export const mockCreditReports: CreditReport[] = Array.from({ length: 50 }, (_, i) => {
  const scores = {
    cibil: 600 + Math.floor(Math.random() * 250),
    experian: 600 + Math.floor(Math.random() * 250),
    equifax: 600 + Math.floor(Math.random() * 250),
    crif: 600 + Math.floor(Math.random() * 250),
  };
  const avgScore = Math.round((scores.cibil + scores.experian + scores.equifax + scores.crif) / 4);

  const loanTypes = ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan', 'Business Loan'];
  const lenders = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Bajaj Finance', 'Kotak Mahindra'];
  
  const numLoans = Math.floor(Math.random() * 4) + 1;
  const activeLoans = Array.from({ length: numLoans }, () => {
    const sanctioned = Math.floor(Math.random() * 5000000) + 100000;
    return {
      loan_type: loanTypes[Math.floor(Math.random() * loanTypes.length)],
      lender: lenders[Math.floor(Math.random() * lenders.length)],
      account_number: `XXXX${Math.floor(Math.random() * 9000) + 1000}`,
      sanctioned_amount: sanctioned,
      current_balance: Math.floor(sanctioned * Math.random() * 0.7),
      emi_amount: Math.floor(sanctioned / 60),
      tenure_months: 60,
      start_date: randomDate(new Date(2020, 0, 1), new Date()),
      status: 'Active',
      overdue_amount: Math.random() > 0.85 ? Math.floor(Math.random() * 10000) : 0,
      rate_of_interest: `${(8 + Math.random() * 6).toFixed(2)}%`,
      payment_history: generatePaymentHistory(),
    };
  });

  const creditCards = [{
    bank: lenders[Math.floor(Math.random() * lenders.length)],
    card_type: ['Platinum', 'Gold', 'Silver', 'Rewards'][Math.floor(Math.random() * 4)],
    credit_limit: (Math.floor(Math.random() * 10) + 1) * 50000,
    current_balance: Math.floor(Math.random() * 100000),
    available_credit: 100000,
    utilization: Math.floor(Math.random() * 80) + 5,
    status: 'Active',
    payment_history: generatePaymentHistory(),
  }];

  const enquiryDetails = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
    date: randomDate(subDays(new Date(), 365), new Date()),
    institution: lenders[Math.floor(Math.random() * lenders.length)],
    purpose: ['Personal Loan', 'Credit Card', 'Home Loan', 'Auto Loan'][Math.floor(Math.random() * 4)],
    amount: Math.floor(Math.random() * 500000) + 50000,
  }));

  const isHighRisk = avgScore < 600;
  const names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sunita Devi', 'Vikram Singh', 'Neha Gupta', 'Rajesh Verma', 'Anita Reddy'];
  
  return {
    id: `report_${i + 1}`,
    user_email: `user${i + 1}@example.com`,
    full_name: names[i % names.length],
    pan_number: `ABCDE${1000 + i}F`,
    mobile: `+91 ${90000 + Math.floor(Math.random() * 9999)} ${10000 + Math.floor(Math.random() * 89999)}`,
    date_of_birth: '1990-05-15',
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    address: '123 Main Street, City, State - 400001',
    report_status: Math.random() > 0.3 ? 'UNLOCKED' : 'LOCKED',
    initiated_by: Math.random() > 0.6 ? 'user' : 'partner',
    partner_id: Math.random() > 0.6 ? mockPartners[Math.floor(Math.random() * mockPartners.length)].id : undefined,
    bureaus_checked: ['TransUnion CIBIL', 'Experian', 'Equifax', 'CRIF High Mark'],
    cibil_score: scores.cibil,
    experian_score: scores.experian,
    equifax_score: scores.equifax,
    crif_score: scores.crif,
    average_score: avgScore,
    score_category: avgScore >= 750 ? 'Excellent' : avgScore >= 700 ? 'Very Good' : avgScore >= 650 ? 'Good' : avgScore >= 550 ? 'Average' : 'Poor',
    report_generated_at: randomDate(subDays(new Date(), 90), new Date()),
    created_date: randomDate(subDays(new Date(), 90), new Date()),
    credit_utilization: Math.floor(Math.random() * 60) + 10,
    total_accounts: numLoans + creditCards.length,
    active_accounts: numLoans + creditCards.length,
    closed_accounts: Math.floor(Math.random() * 3),
    hard_enquiries: enquiryDetails.length,
    soft_enquiries: enquiryDetails.length + Math.floor(Math.random() * 3),
    active_loans: activeLoans,
    closed_loans: [],
    credit_cards: creditCards,
    enquiry_details: enquiryDetails,
    oldest_account_age_months: Math.floor(Math.random() * 120) + 12,
    credit_age_years: Math.floor(Math.random() * 10) + 1,
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
      'Avoid applying for multiple loans simultaneously',
      'Keep older credit accounts active',
    ],
    is_high_risk: isHighRisk,
    risk_flags: isHighRisk ? ['Low credit score', 'High utilization'] : [],
    view_count: Math.floor(Math.random() * 10) + 1,
  };
});

// Mock Transactions
export const mockTransactions: Transaction[] = Array.from({ length: 100 }, (_, i) => ({
  id: `txn_${i + 1}`,
  user_email: `user${(i % 30) + 1}@example.com`,
  transaction_id: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  payment_gateway: ['razorpay', 'wallet'][Math.floor(Math.random() * 2)],
  amount: [99, 198, 297, 396][Math.floor(Math.random() * 4)],
  bureaus_purchased: ['CIBIL', 'Experian', 'Equifax', 'CRIF'].slice(0, Math.floor(Math.random() * 4) + 1),
  report_count: Math.floor(Math.random() * 4) + 1,
  status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'success' | 'pending' | 'failed',
  payment_method: ['UPI', 'Card', 'Net Banking', 'Wallet'][Math.floor(Math.random() * 4)],
  initiated_by: Math.random() > 0.5 ? 'user' : 'partner',
  initiator_email: `user${(i % 30) + 1}@example.com`,
  partner_id: Math.random() > 0.5 ? mockPartners[Math.floor(Math.random() * mockPartners.length)].id : undefined,
  commission_amount: Math.floor(Math.random() * 80),
  created_date: randomDate(subDays(new Date(), 30), new Date()),
}));

// Mock Wallet Transactions
export const mockWalletTransactions: WalletTransaction[] = Array.from({ length: 50 }, (_, i) => {
  const partner = mockPartners[i % mockPartners.length];
  const type = Math.random() > 0.3 ? 'credit' : 'debit';
  const amount = type === 'credit' ? [1000, 2000, 5000, 10000][Math.floor(Math.random() * 4)] : [99, 198, 297, 396][Math.floor(Math.random() * 4)];
  
  return {
    id: `wtxn_${i + 1}`,
    partner_id: partner.id,
    partner_email: partner.owner_email,
    transaction_type: type,
    amount,
    balance_before: 10000 + Math.floor(Math.random() * 20000),
    balance_after: 10000 + Math.floor(Math.random() * 20000),
    description: type === 'credit' ? 'Wallet top-up' : `Report for Client #${1000 + i}`,
    status: 'success',
    created_date: randomDate(subDays(new Date(), 60), new Date()),
  };
});

// Mock Score Repair Requests
export const mockScoreRepairRequests: ScoreRepairRequest[] = Array.from({ length: 15 }, (_, i) => ({
  id: `repair_${i + 1}`,
  user_email: `user${i + 1}@example.com`,
  user_name: ['Rahul Sharma', 'Priya Patel', 'Amit Kumar'][i % 3],
  user_mobile: `+91 98765 ${10000 + i}`,
  current_score: 450 + Math.floor(Math.random() * 200),
  report_id: `report_${i + 1}`,
  status: ['pending', 'contacted', 'in_progress', 'completed', 'cancelled'][Math.floor(Math.random() * 5)] as ScoreRepairRequest['status'],
  service_charge: 999,
  created_date: randomDate(subDays(new Date(), 30), new Date()),
}));

// Current user simulation
export const getCurrentUser = (): User => {
  const stored = sessionStorage.getItem('currentUserRole');
  const role = (stored as User['user_role']) || 'USER';
  
  return {
    id: 'current_user',
    email: role === 'MASTER_ADMIN' ? 'admin@creditcheck.com' : role === 'PARTNER_ADMIN' ? 'partner@example.com' : 'john.doe@example.com',
    full_name: role === 'MASTER_ADMIN' ? 'Admin User' : role === 'PARTNER_ADMIN' ? 'Partner Admin' : 'John Doe',
    user_role: role,
    created_date: new Date().toISOString(),
  };
};

export const setCurrentUserRole = (role: User['user_role']) => {
  sessionStorage.setItem('currentUserRole', role);
};

// Get user's reports
export const getUserReports = (email: string): CreditReport[] => {
  return mockCreditReports.filter(r => r.user_email === email);
};

// Get partner by email
export const getPartnerByEmail = (email: string): Partner | undefined => {
  return mockPartners.find(p => p.owner_email === email);
};

// Bureau configuration
export const bureauConfig: Record<string, { name: string; fullName: string; color: string; bgColor: string; logo: string }> = {
  cibil: { name: 'CIBIL', fullName: 'TransUnion CIBIL', color: 'text-blue-600', bgColor: 'bg-blue-50', logo: '🔵' },
  experian: { name: 'Experian', fullName: 'Experian', color: 'text-purple-600', bgColor: 'bg-purple-50', logo: '🟣' },
  equifax: { name: 'Equifax', fullName: 'Equifax', color: 'text-red-600', bgColor: 'bg-red-50', logo: '🔴' },
  crif: { name: 'CRIF', fullName: 'CRIF High Mark', color: 'text-green-600', bgColor: 'bg-green-50', logo: '🟢' },
};
