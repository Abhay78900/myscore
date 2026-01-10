import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Wallet,
  LogOut,
  CreditCard,
  Users,
  Megaphone,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Partner } from '@/types';

interface PartnerSidebarProps {
  currentPage: string;
  onLogout: () => void;
  partner?: Partner;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/partner/dashboard' },
  { name: 'My Reports', icon: FileText, path: '/partner/reports' },
  { name: 'My Clients', icon: Users, path: '/partner/clients' },
  { name: 'Wallet', icon: Wallet, path: '/partner/wallet' },
  { name: 'Marketing', icon: Megaphone, path: '/partner/marketing' },
];

const SidebarContent: React.FC<{ 
  onLogout: () => void; 
  partner?: Partner;
  onNavigate?: () => void;
}> = ({ onLogout, partner, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-purple-700/50">
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
        <div className="p-3 mx-3 mt-4 bg-purple-700/50 rounded-xl">
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
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-500 text-white'
                  : 'text-purple-200 hover:bg-purple-700/50 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 lg:p-4 border-t border-purple-700/50">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3 text-purple-200 hover:text-white hover:bg-purple-700/50"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </>
  );
};

const PartnerSidebar: React.FC<PartnerSidebarProps> = ({ currentPage, onLogout, partner }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-purple-900 text-white px-4 py-3 flex items-center gap-3">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-purple-800">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-gradient-to-b from-purple-900 to-purple-800 text-white border-purple-700">
            <SidebarContent onLogout={onLogout} partner={partner} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          <span className="font-bold">Partner Portal</span>
        </div>
        {partner && (
          <div className="ml-auto flex items-center gap-1 text-sm text-purple-200">
            <Wallet className="w-4 h-4" />
            ₹{partner.wallet_balance.toLocaleString()}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white min-h-screen flex-col shrink-0">
        <SidebarContent onLogout={onLogout} partner={partner} />
      </aside>
    </>
  );
};

export default PartnerSidebar;
