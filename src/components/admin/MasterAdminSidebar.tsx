import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Users,
  Building2,
  Settings,
  LogOut,
  CreditCard,
  Wallet,
  UserCog,
  Wrench,
  FolderOpen,
  Receipt,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MasterAdminSidebarProps {
  currentPage: string;
  onLogout: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { name: 'Reports Repository', icon: FolderOpen, path: '/admin/reports-repository' },
  { name: 'Users', icon: Users, path: '/admin/users' },
  { name: 'User Roles', icon: UserCog, path: '/admin/user-roles' },
  { name: 'Partners', icon: Building2, path: '/admin/partners' },
  { name: 'Partner Wallets', icon: Wallet, path: '/admin/partner-wallets' },
  { name: 'Transactions', icon: Receipt, path: '/admin/transactions' },
  { name: 'Score Repair', icon: Wrench, path: '/admin/score-repair' },
  { name: 'Settings', icon: Settings, path: '/admin/settings' },
];

const MasterAdminSidebar: React.FC<MasterAdminSidebarProps> = ({ currentPage, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground min-h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold text-sidebar-foreground">CreditCheck</span>
            <p className="text-xs text-sidebar-foreground/60">Master Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={onLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default MasterAdminSidebar;
