// Types for CreditCheck application

export interface User {
  id: string;
  email: string;
  full_name: string;
  user_role: 'USER' | 'PARTNER_ADMIN' | 'MASTER_ADMIN';
  created_date: string;
  phone?: string;
  pan_number?: string;
  referral_code_used?: string;
}

export interface CreditReport {
  id: string;
  user_email: string;
  full_name: string;
  pan_number: string;
  mobile: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  report_status: 'LOCKED' | 'UNLOCKED';
  initiated_by: 'user' | 'partner';
  initiator_email?: string;
  partner_id?: string;
  transaction_id?: string;
  bureaus_checked: string[];
  cibil_score?: number;
  experian_score?: number;
  equifax_score?: number;
  crif_score?: number;
  average_score: number;
  score_category: string;
  report_generated_at: string;
  created_date: string;
  credit_utilization: number;
  total_accounts: number;
  active_accounts: number;
  closed_accounts: number;
  hard_enquiries: number;
  soft_enquiries: number;
  active_loans: Loan[];
  closed_loans: Loan[];
  credit_cards: CreditCard[];
  enquiry_details: Enquiry[];
  oldest_account_age_months: number;
  credit_age_years: number;
  score_factors: ScoreFactors;
  improvement_tips: string[];
  is_high_risk: boolean;
  risk_flags?: string[];
  view_count?: number;
  last_viewed_at?: string;
  admin_notes?: string;
}

export interface Loan {
  loan_type: string;
  lender: string;
  account_number: string;
  sanctioned_amount: number;
  current_balance: number;
  emi_amount: number;
  tenure_months: number;
  start_date: string;
  closed_date?: string;
  status: string;
  overdue_amount: number;
  rate_of_interest: string;
  payment_history: PaymentRecord[];
  collateral_value?: number;
  collateral_type?: string;
}

export interface CreditCard {
  bank: string;
  card_type: string;
  credit_limit: number;
  current_balance: number;
  available_credit: number;
  utilization: number;
  status: string;
  payment_history: PaymentRecord[];
}

export interface PaymentRecord {
  month: string;
  year: number;
  status: string;
  dpd: number;
}

export interface Enquiry {
  date: string;
  institution: string;
  purpose: string;
  amount: number;
}

export interface ScoreFactors {
  payment_history: number;
  credit_utilization: number;
  credit_age: number;
  credit_mix: number;
  new_credit: number;
}

export interface Partner {
  id: string;
  name: string;
  owner_email: string;
  franchise_id: string;
  phone?: string;
  address?: string;
  commission_rate: number;
  status: 'active' | 'inactive' | 'suspended';
  wallet_balance: number;
  total_wallet_loaded: number;
  total_sales: number;
  total_revenue: number;
  total_commission_earned: number;
  total_commission_paid: number;
  created_date: string;
}

export interface Transaction {
  id: string;
  user_email: string;
  transaction_id: string;
  payment_gateway: string;
  amount: number;
  bureaus_purchased: string[];
  report_count: number;
  status: 'pending' | 'success' | 'failed';
  payment_method?: string;
  initiated_by: 'user' | 'partner';
  initiator_email: string;
  partner_id?: string;
  commission_amount?: number;
  referral_code?: string;
  created_date: string;
  client_name?: string;
  client_pan?: string;
  client_mobile?: string;
}

export interface WalletTransaction {
  id: string;
  partner_id: string;
  partner_email: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  balance_before: number;
  balance_after: number;
  description: string;
  reference_id?: string;
  status: 'success' | 'pending' | 'failed';
  created_date: string;
}

export interface ScoreRepairRequest {
  id: string;
  user_email: string;
  user_name: string;
  user_mobile: string;
  current_score: number;
  report_id: string;
  status: 'pending' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  service_charge: number;
  admin_notes?: string;
  created_date: string;
}

export interface AppSettings {
  id: string;
  setting_key: string;
  setting_value: string;
}

export interface BureauConfig {
  id: string;
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  logo: string;
}
