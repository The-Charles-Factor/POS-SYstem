import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed on mobile
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-collapse when route changes
  useEffect(() => {
    setIsMobileOpen(false);
    // On mobile, keep it collapsed after navigation
    if (window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // On desktop, can be expanded
        setIsMobileOpen(false);
      } else {
        // On mobile, default to collapsed
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      path: '/products',
      label: 'Inventory',
      icon: Package,
      description: 'Manage Products',
      submenu: [
        { path: '/products', label: 'All Products', icon: Package },
      ]
    },
    {
      path: '/sales',
      label: 'Sales',
      icon: ShoppingCart,
      description: 'POS & Transactions',
      submenu: [
        { path: '/sales', label: 'Point of Sale', icon: ShoppingCart },
      ]
    },
  ];

  const bottomMenuItems = [
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      description: 'System Configuration'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (e, label) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMenuClick = (e, hasSubmenu, label) => {
    if (hasSubmenu) {
      toggleSubmenu(e, label);
    }
    // Auto-collapse on mobile after selection
    if (window.innerWidth < 1024 && !hasSubmenu) {
      setIsCollapsed(true);
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header - Only show menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white z-40 h-16 shadow-lg border-b border-gray-700">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                POS System
              </h1>
              <p className="text-gray-400 text-sm">Business Suite</p>
            </div>
          </div>
          
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        bg-gradient-to-b from-gray-900 to-gray-800 text-white 
        transition-all duration-300 ease-in-out
        flex flex-col
        fixed lg:static top-0 left-0 h-screen z-30
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl border-r border-gray-700
        lg:!translate-x-0
        overflow-y-auto
      `}>
        
        {/* Desktop Header */}
        <div className="p-4 border-b border-gray-700 lg:block hidden">
          <div className={`flex items-center justify-between ${isCollapsed ? 'flex-col space-y-4' : 'flex-row'}`}>
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    POS System
                  </h1>
                  <p className="text-gray-400 text-xs">Business Suite</p>
                </div>
              </div>
            )}
            
            {isCollapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-700 rounded-lg transition-colors group"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4 mt-16 lg:mt-0">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              const hasSubmenu = item.submenu;
              
              return (
                <div key={item.path} className="relative">
                  <Link
                    to={hasSubmenu ? '#' : item.path}
                    onClick={(e) => handleMenuClick(e, hasSubmenu, item.label)}
                    className={`
                      flex items-center rounded-lg p-3 transition-all duration-200 group
                      ${isActive 
                        ? 'bg-blue-600 shadow-lg shadow-blue-500/25 text-white' 
                        : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                      }
                      ${isCollapsed ? 'justify-center' : 'justify-between'}
                      cursor-pointer
                    `}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                      <div className={`
                        transition-transform duration-200
                        ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{item.label}</div>
                          <div className="text-xs text-gray-400 truncate">
                            {item.description}
                          </div>
                        </div>
                      )}
                    </div>

                    {!isCollapsed && hasSubmenu && (
                      <ChevronRight className={`
                        w-3 h-3 transition-transform duration-200
                        ${activeSubmenu === item.label ? 'rotate-90' : ''}
                      `} />
                    )}
                  </Link>

                  {/* Submenu */}
                  {hasSubmenu && activeSubmenu === item.label && !isCollapsed && (
                    <div className="ml-3 mt-1 space-y-1 animate-slideDown">
                      {item.submenu.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = isActivePath(subItem.path);
                        
                        return (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`
                              flex items-center space-x-2 rounded-lg p-2 text-sm transition-all duration-200
                              ${isSubActive 
                                ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-400' 
                                : 'text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                              }
                              cursor-pointer
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              // Auto-collapse on mobile after submenu selection
                              if (window.innerWidth < 1024) {
                                setIsCollapsed(true);
                                setIsMobileOpen(false);
                              }
                            }}
                          >
                            <SubIcon className="w-3 h-3" />
                            <span className="text-xs">{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 p-3 space-y-1">
          {/* System Status - Only show when expanded */}
          {!isCollapsed && (
            <div className="bg-gray-800/50 rounded-lg p-2 mb-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">System</span>
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs">Online</span>
                </div>
              </div>
            </div>
          )}

          {/* Settings Menu Item */}
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center rounded-lg p-3 transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gray-700 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }
                  ${isCollapsed ? 'justify-center' : 'space-x-3'}
                  cursor-pointer
                `}
                onClick={() => {
                  // Auto-collapse on mobile after selection
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true);
                    setIsMobileOpen(false);
                  }
                }}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && (
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.description}</div>
                  </div>
                )}
              </Link>
            );
          })}

          {/* Logout Button */}
          <button className={`
            w-full flex items-center rounded-lg p-3 text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200 group
            ${isCollapsed ? 'justify-center' : 'space-x-3'}
            cursor-pointer
          `}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Add padding for mobile header */}
      <div className="lg:hidden h-16" />

      {/* Custom Styles for Animation */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default Sidebar;