import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  LogOut,
  CreditCard,
  History,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Partner } from '@/types';

interface PartnerSidebarProps {
  currentPage: string;
  onLogout: () => void;
  partner?: Partner;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'PartnerDashboard' },
  { name: 'My Reports', icon: FileText, page: 'PartnerReports' },
];

const PartnerSidebar: React.FC<PartnerSidebarProps> = ({ currentPage, onLogout, partner }) => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold">CreditCheck</span>
            <p className="text-xs text-purple-200">Partner Portal</p>
          </div>
        </div>
      </div>

      {/* Partner Info */}
      {partner && (
        <div className="p-4 mx-3 mt-4 bg-purple-700/50 rounded-xl">
          <p className="text-sm text-purple-200">Welcome,</p>
          <p className="font-semibold truncate">{partner.name}</p>
          <div className="mt-2 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-purple-300" />
            <span className="text-sm text-purple-200">
              ₹{partner.wallet_balance.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.page}
              onClick={() => navigate(createPageUrl(item.page))}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-200 hover:bg-purple-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-700/50">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3 text-purple-200 hover:text-white hover:bg-purple-700/50"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default PartnerSidebar;
