import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Microscope, 
  Layers, 
  ShoppingBag, 
  Users, 
  AlertTriangle, 
  Settings, 
  Menu, 
  LogOut,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export type TabType = 'overview' | 'scans' | 'hives' | 'marketplace' | 'users' | 'outbreaks' | 'settings' | 'profile';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  activeQuarantinesCount: number;
  scansCount?: number;
  isOpen?: boolean;
  onToggleMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange,
  activeQuarantinesCount,
  scansCount,
  isOpen = true,
  onToggleMobile,
  isCollapsed = false,
  onToggleCollapse,
  onSignOut
}) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const navItems = [
    { id: 'overview' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { 
      id: 'scans' as TabType, 
      label: 'Disease Scans', 
      icon: Microscope,
      badge: scansCount !== undefined && scansCount > 0 ? scansCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-700',
      hasDropdown: true
    },
    { 
      id: 'hives' as TabType, 
      label: 'Active Hives', 
      icon: Layers,
      hasDropdown: true 
    },
    { id: 'marketplace' as TabType, label: 'Marketplace', icon: ShoppingBag },
    { id: 'users' as TabType, label: 'Beekeepers', icon: Users },
    { 
      id: 'outbreaks' as TabType, 
      label: 'Outbreak Alerts', 
      icon: AlertTriangle,
      badge: activeQuarantinesCount > 0 ? activeQuarantinesCount : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-700'
    },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings }
  ];

  const toggleDropdown = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const handleMenuClick = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else if (onToggleMobile) {
      onToggleMobile();
    }
  };

  return (
    <aside 
      className={`fixed md:relative h-screen bg-white border-r border-slate-200 text-slate-900 flex flex-col transition-all duration-300 z-50 shrink-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } ${
        isCollapsed ? 'w-20 md:w-20' : 'w-64 md:w-64'
      }`}
    >
      {/* Brand Header with 3-line Hamburger Menu Button */}
      <div className={`border-b border-slate-200 transition-all ${isCollapsed ? 'p-3' : 'p-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between gap-3'}`}>
          <div 
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
            title="BeeGuard Central Intelligence"
          >
            {/* Custom Photographic Apiary Logo */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-amber-400/90 shadow-md shadow-amber-500/10 shrink-0 group-hover:scale-105 group-hover:ring-amber-500 transition-all duration-200 bg-amber-50">
              <img 
                src="/login-hero.jpg" 
                alt="BeeGuard" 
                className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-transparent to-amber-400/10 pointer-events-none" />
              <span className="absolute -bottom-1 -right-1 text-[11px] filter drop-shadow">🐝</span>
            </div>

            {!isCollapsed && (
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-slate-900 leading-tight tracking-tight text-base truncate">
                    BeeGuard
                  </h1>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300/60 uppercase tracking-wider">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium truncate">Apiary Management</p>
              </div>
            )}
          </div>
          
          {/* 3-Line Menu Button (Collapses/Expands Sidebar) */}
          <button 
            type="button"
            onClick={handleMenuClick}
            className={`p-2 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors shrink-0 text-slate-600 hover:text-slate-900 ${
              isCollapsed ? 'mt-1' : ''
            }`}
            title={isCollapsed ? "Expand Sidebar (3-line menu)" : "Collapse Sidebar (3-line menu)"}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center p-2.5' : 'justify-between gap-3 px-3 py-2.5'
                  } rounded-lg transition-colors group relative ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900 font-semibold' 
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'min-w-0'}`}>
                    <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-emerald-600'
                    }`} />
                    {!isCollapsed && (
                      <span className="text-sm truncate">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* Badge & Dropdown Trigger */}
                  {isCollapsed ? (
                    item.badge !== undefined && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    )
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      {item.badge !== undefined && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeColor || 'bg-emerald-100 text-emerald-700'}`}>
                          {item.badge}
                        </span>
                      )}

                      {item.hasDropdown && (
                        <span 
                          onClick={(e) => toggleDropdown(item.label, e)} 
                          className="p-0.5 hover:bg-slate-200/60 rounded"
                          title="Toggle sub-menu"
                        >
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedMenu === item.label ? 'rotate-180' : ''}`} />
                        </span>
                      )}
                    </div>
                  )}
                </button>

                {/* Sub-Menu when expanded */}
                {!isCollapsed && item.hasDropdown && expandedMenu === item.label && (
                  <ul className="mt-1 ml-7 pl-3 border-l-2 border-slate-200 space-y-1 text-xs animate-in fade-in duration-150">
                    {item.id === 'scans' && (
                      <>
                        <li>
                          <button
                            type="button"
                            onClick={() => onTabChange('scans')}
                            className="w-full text-left py-1.5 px-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded font-medium"
                          >
                            All Field Scans
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => onTabChange('scans')}
                            className="w-full text-left py-1.5 px-2 text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded flex items-center justify-between"
                          >
                            <span>Critical Pathogens</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                          </button>
                        </li>
                      </>
                    )}
                    {item.id === 'hives' && (
                      <>
                        <li>
                          <button
                            type="button"
                            onClick={() => onTabChange('hives')}
                            className="w-full text-left py-1.5 px-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-50 rounded font-medium"
                          >
                            Colony Fleet
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => onTabChange('hives')}
                            className="w-full text-left py-1.5 px-2 text-slate-600 hover:text-amber-600 hover:bg-slate-50 rounded flex items-center justify-between"
                          >
                            <span>Quarantined Colonies</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          </button>
                        </li>
                      </>
                    )}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className={`border-t border-slate-200 transition-all ${isCollapsed ? 'p-2' : 'p-4'}`}>
        <div 
          onClick={() => onTabChange('profile')}
          className={`flex items-center ${isCollapsed ? 'justify-center p-2' : 'gap-3 p-2 -mx-2'} mb-3 rounded-xl cursor-pointer transition-all ${
            activeTab === 'profile' 
              ? 'bg-emerald-50 border border-emerald-200 shadow-xs' 
              : 'hover:bg-slate-200/60'
          }`}
          title="Open Super Administrator Profile & Settings"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center font-semibold text-white shadow-sm">
              SK
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Samyak Kamble</p>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <span>Super Administrator</span>
                  {activeTab === 'profile' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                </p>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTabChange('profile');
                }}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors shrink-0 text-slate-400 hover:text-slate-800"
                title="Administrator Profile Settings"
              >
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === 'profile' ? 'text-emerald-600 translate-x-0.5' : ''}`} />
              </button>
            </>
          )}
        </div>

        <button 
          onClick={onSignOut ? onSignOut : () => alert('Signing out of BeeGuard Admin...')}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-2 px-3'} py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors`}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
