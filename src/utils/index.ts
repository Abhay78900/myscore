// Page URL mapping for navigation
const pageRoutes: Record<string, string> = {
  Home: '/',
  Dashboard: '/dashboard',
  CheckScore: '/check-score',
  SelectReports: '/select-reports',
  CreditReport: '/credit-report',
  UnlockReport: '/unlock-report',
  PaymentGateway: '/payment',
  HowItWorks: '/how-it-works',
  AdminLogin: '/admin/login',
  MasterAdminDashboard: '/admin/dashboard',
  AdminAnalytics: '/admin/analytics',
  AdminReports: '/admin/reports',
  AdminReportsRepository: '/admin/reports-repository',
  AdminSettings: '/admin/settings',
  AdminUsers: '/admin/users',
  UserRoleManagement: '/admin/user-roles',
  ManagePartners: '/admin/partners',
  PartnerWalletManagement: '/admin/partner-wallets',
  ScoreRepairRequests: '/admin/score-repair',
  TransactionHistory: '/admin/transactions',
  PartnerDashboard: '/partner/dashboard',
  PartnerReports: '/partner/reports',
  PartnerClients: '/partner/clients',
  PartnerMarketing: '/partner/marketing',
  AuthRedirect: '/auth-redirect',
};

export function createPageUrl(pageName: string): string {
  return pageRoutes[pageName] || '/';
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with Indian numbering system
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

// Get score category
export function getScoreCategory(score: number): { label: string; color: string } {
  if (score >= 750) return { label: 'Excellent', color: 'credit-excellent' };
  if (score >= 700) return { label: 'Very Good', color: 'credit-good' };
  if (score >= 650) return { label: 'Good', color: 'credit-good' };
  if (score >= 550) return { label: 'Average', color: 'credit-average' };
  return { label: 'Poor', color: 'credit-poor' };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
