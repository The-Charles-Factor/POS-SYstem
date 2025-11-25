import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true); // Always collapsed on mobile
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const menuItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      path: '/products',
      label: 'Inventory',
      icon: Package,
    },
    {
      path: '/sales',
      label: 'Sales',
      icon: ShoppingCart,
    },
  ];

  const bottomMenuItems = [
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleMenuClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  return (
    <>
      {/* Mobile Header - Minimal */}
      {isMobile && (
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white z-40 h-16 shadow-lg border-b border-gray-700">
          <div className="flex items-center justify-between h-full px-4">
            {/* Simple logo only */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">POS</h1>
            </div>
            
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Ultra Minimal */}
      <aside className={`
        bg-gradient-to-b from-gray-900 to-gray-800 text-white 
        transition-all duration-300 ease-in-out
        flex flex-col
        fixed lg:static top-0 left-0 h-screen z-30
        ${isCollapsed ? 'w-16' : 'w-20'}
        shadow-2xl border-r border-gray-700
        overflow-y-auto
      `}>
        
        {/* Navigation Menu - Icons Only */}
        <nav className={`flex-1 overflow-y-auto py-4 ${isMobile ? 'mt-16' : 'mt-4'}`}>
          <div className="space-y-2 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleMenuClick}
                  className={`
                    flex items-center justify-center rounded-lg p-3 transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-600 shadow-lg shadow-blue-500/25 text-white' 
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                    }
                    cursor-pointer
                  `}
                  title={item.label}
                >
                  <div className={`
                    transition-transform duration-200
                    ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section - Icons Only */}
        <div className="border-t border-gray-700 p-3 space-y-2">
          {/* Settings Menu Item */}
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleMenuClick}
                className={`
                  flex items-center justify-center rounded-lg p-3 transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gray-700 text-white' 
                    : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                  }
                  cursor-pointer
                `}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}

          {/* Logout Button */}
          <button 
            className={`
              w-full flex items-center justify-center rounded-lg p-3 text-gray-300 
              hover:bg-red-600 hover:text-white transition-all duration-200 group
              cursor-pointer
            `}
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Add padding for mobile header */}
      {isMobile && <div className="lg:hidden h-16" />}
    </>
  );
};

export default Sidebar;