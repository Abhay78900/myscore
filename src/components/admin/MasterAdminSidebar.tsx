import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MasterAdminSidebarProps {
  currentPage: string;
  onLogout: () => void;
}

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'MasterAdminDashboard' },
  { name: 'Analytics', icon: BarChart3, page: 'AdminAnalytics' },
  { name: 'Reports', icon: FileText, page: 'AdminReports' },
  { name: 'Repository', icon: FolderOpen, page: 'AdminReportsRepository' },
  { name: 'Users', icon: Users, page: 'AdminUsers' },
  { name: 'User Roles', icon: UserCog, page: 'UserRoleManagement' },
  { name: 'Partners', icon: Building2, page: 'ManagePartners' },
  { name: 'Partner Wallets', icon: Wallet, page: 'PartnerWalletManagement' },
  { name: 'Score Repair', icon: Wrench, page: 'ScoreRepairRequests' },
  { name: 'Settings', icon: Settings, page: 'AdminSettings' },
];

const MasterAdminSidebar: React.FC<MasterAdminSidebarProps> = ({ currentPage, onLogout }) => {
  const navigate = useNavigate();

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
          const isActive = currentPage === item.page;
          
          return (
            <button
              key={item.page}
              onClick={() => navigate(createPageUrl(item.page))}
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
