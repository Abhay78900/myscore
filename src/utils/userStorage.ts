// User and Partner Storage Utility
import { User, Partner } from '@/types';

const USERS_KEY = 'app_users';
const PARTNERS_KEY = 'app_partners';
const USER_CREDENTIALS_KEY = 'user_credentials';
const PARTNER_CREDENTIALS_KEY = 'partner_credentials';

interface UserCredential {
  email: string;
  password: string;
  role: 'USER' | 'PARTNER_ADMIN' | 'MASTER_ADMIN';
  name: string;
  userId: string;
}

interface PartnerCredential {
  email: string;
  password: string;
  partnerId: string;
  name: string;
}

// Initialize default credentials
const DEFAULT_CREDENTIALS: UserCredential[] = [
  { email: 'user@demo.com', password: 'user123', role: 'USER', name: 'John Doe', userId: 'user_demo_1' },
  { email: 'partner@demo.com', password: 'partner123', role: 'PARTNER_ADMIN', name: 'Partner Admin', userId: 'user_demo_2' },
  { email: 'admin@demo.com', password: 'admin123', role: 'MASTER_ADMIN', name: 'Master Admin', userId: 'user_demo_3' },
];

// ========== User Credentials ==========

export const getAllUserCredentials = (): UserCredential[] => {
  const stored = sessionStorage.getItem(USER_CREDENTIALS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with defaults
  sessionStorage.setItem(USER_CREDENTIALS_KEY, JSON.stringify(DEFAULT_CREDENTIALS));
  return DEFAULT_CREDENTIALS;
};

export const saveUserCredential = (credential: UserCredential): void => {
  const credentials = getAllUserCredentials();
  const existingIndex = credentials.findIndex(c => c.email.toLowerCase() === credential.email.toLowerCase());
  if (existingIndex >= 0) {
    credentials[existingIndex] = credential;
  } else {
    credentials.push(credential);
  }
  sessionStorage.setItem(USER_CREDENTIALS_KEY, JSON.stringify(credentials));
};

export const validateUserLogin = (email: string, password: string): UserCredential | null => {
  const credentials = getAllUserCredentials();
  const user = credentials.find(
    c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  return user || null;
};

// ========== Partner Credentials ==========

export const getAllPartnerCredentials = (): PartnerCredential[] => {
  const stored = sessionStorage.getItem(PARTNER_CREDENTIALS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with default partner
  const defaultPartner: PartnerCredential[] = [
    { email: 'partner@demo.com', password: 'partner123', partnerId: 'partner_1', name: 'ABC Financial Services' },
  ];
  sessionStorage.setItem(PARTNER_CREDENTIALS_KEY, JSON.stringify(defaultPartner));
  return defaultPartner;
};

export const savePartnerCredential = (credential: PartnerCredential): void => {
  const credentials = getAllPartnerCredentials();
  const existingIndex = credentials.findIndex(c => c.email.toLowerCase() === credential.email.toLowerCase());
  if (existingIndex >= 0) {
    credentials[existingIndex] = credential;
  } else {
    credentials.push(credential);
  }
  sessionStorage.setItem(PARTNER_CREDENTIALS_KEY, JSON.stringify(credentials));
  
  // Also add to user credentials as PARTNER_ADMIN
  saveUserCredential({
    email: credential.email,
    password: credential.password,
    role: 'PARTNER_ADMIN',
    name: credential.name,
    userId: credential.partnerId,
  });
};

export const validatePartnerLogin = (email: string, password: string): PartnerCredential | null => {
  const credentials = getAllPartnerCredentials();
  const partner = credentials.find(
    c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
  );
  return partner || null;
};

// ========== Users ==========

export const getAllUsers = (): User[] => {
  const stored = sessionStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveUser = (user: User): void => {
  const users = getAllUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUserByEmail = (email: string): User | null => {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

// ========== Partners ==========

export const getAllPartners = (): Partner[] => {
  const stored = sessionStorage.getItem(PARTNERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const savePartner = (partner: Partner, password?: string): void => {
  const partners = getAllPartners();
  const existingIndex = partners.findIndex(p => p.id === partner.id);
  if (existingIndex >= 0) {
    partners[existingIndex] = partner;
  } else {
    partners.push(partner);
  }
  sessionStorage.setItem(PARTNERS_KEY, JSON.stringify(partners));
  
  // Save credentials if password provided
  if (password) {
    savePartnerCredential({
      email: partner.email,
      password: password,
      partnerId: partner.id,
      name: partner.name,
    });
  }
};

export const getPartnerById = (id: string): Partner | null => {
  const partners = getAllPartners();
  return partners.find(p => p.id === id) || null;
};

export const getPartnerByEmail = (email: string): Partner | null => {
  const partners = getAllPartners();
  return partners.find(p => p.email.toLowerCase() === email.toLowerCase() || p.owner_email.toLowerCase() === email.toLowerCase()) || null;
};

export const deletePartner = (id: string): void => {
  const partners = getAllPartners();
  const filtered = partners.filter(p => p.id !== id);
  sessionStorage.setItem(PARTNERS_KEY, JSON.stringify(filtered));
};

// ========== Initialize with Mock Data ==========

export const initializeWithMockData = (mockUsers: User[], mockPartners: Partner[]): void => {
  // Initialize users if empty
  if (getAllUsers().length === 0) {
    sessionStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
  
  // Initialize partners if empty
  if (getAllPartners().length === 0) {
    sessionStorage.setItem(PARTNERS_KEY, JSON.stringify(mockPartners));
    
    // Add default partner credentials
    mockPartners.forEach(p => {
      const existingCreds = getAllPartnerCredentials();
      if (!existingCreds.find(c => c.email === p.email)) {
        savePartnerCredential({
          email: p.email,
          password: 'partner123', // Default password for mock partners
          partnerId: p.id,
          name: p.name,
        });
      }
    });
  }
};
