import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
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

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleLinkClick = () => {
    if (isMobile) {
      closeMobileMenu();
    }
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log('Logging out...');
    // Example: clear auth tokens, redirect to login, etc.
    // navigate('/login');
    handleLinkClick();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        bg-gradient-to-b from-gray-900 to-gray-800 text-white 
        transition-all duration-300 ease-in-out
        flex flex-col
        fixed lg:static top-0 left-0 h-screen z-50
        ${isMobile ? (isMobileOpen ? 'w-64 translate-x-0' : '-translate-x-full') : 'w-64'}
        shadow-2xl border-r border-gray-700
        overflow-y-auto
      `}>
        
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">L</span>
            </div>
            {(!isMobile || isMobileOpen) && (
              <h1 className="text-xl font-bold text-white">njoroge</h1>
            )}
          </div>
        </div>

        {/* Close Button for Mobile */}
        {isMobile && isMobileOpen && (
          <div className="lg:hidden flex justify-end p-4 border-b border-gray-700">
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center rounded-lg p-3 transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-600/80 backdrop-blur-sm shadow-lg shadow-blue-500/25 text-white' 
                      : 'bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/70 text-gray-300 hover:text-white'
                    }
                    justify-start space-x-3
                    cursor-pointer border border-gray-600/30
                  `}
                >
                  <div className={`
                    transition-transform duration-200
                    ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 p-3 space-y-2">
          {/* Settings Menu Item */}
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePath(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center rounded-lg p-3 transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gray-700/80 backdrop-blur-sm text-white' 
                    : 'bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/70 text-gray-300 hover:text-white'
                  }
                  justify-start space-x-3
                  cursor-pointer border border-gray-600/30
                `}
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.label}</div>
                </div>
              </Link>
            );
          })}

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className={`
              w-full flex items-center rounded-lg p-3 text-gray-300 
              bg-gray-800/50 backdrop-blur-sm hover:bg-red-600/80 hover:text-white 
              transition-all duration-200 group border border-gray-600/30
              justify-start space-x-3
              cursor-pointer
            `}
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
{/* logo */}
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 rounded-lg transition-all duration-200 border border-gray-600/50 shadow-lg"
        >
          {isMobileOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      )}
    </>
  );
};

export default Sidebar;


