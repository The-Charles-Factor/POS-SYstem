import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Calendar, 
  Clock, 
  Menu,
  Search,
  ShoppingCart,
  Package,
  TrendingUp,
  Zap,
  Wifi,
  Battery,
  Signal
} from 'lucide-react';

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate battery and connectivity status
  useEffect(() => {
    const batteryTimer = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - 0.1));
    }, 60000);

    const connectivityTimer = setInterval(() => {
      setIsOnline(Math.random() > 0.1);
    }, 30000);

    return () => {
      clearInterval(batteryTimer);
      clearInterval(connectivityTimer);
    };
  }, []);

  const getBatteryColor = (level) => {
    if (level > 70) return 'text-green-400';
    if (level > 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBatteryIcon = (level) => {
    if (level > 80) return '🟢';
    if (level > 60) return '🟡';
    if (level > 40) return '🟠';
    return '🔴';
  };

  return (
    <>
      {/* Mobile Status Bar - iPhone Style */}
      <div className="lg:hidden bg-gradient-to-r from-blue-700 to-purple-800 text-white px-4 py-1 text-xs">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="font-semibold">POS Pro</span>
            {isOnline ? (
              <div className="flex items-center space-x-1">
                <Signal className="w-3 h-3 text-green-400" />
                <Wifi className="w-3 h-3 text-green-400" />
              </div>
            ) : (
              <span className="text-red-400">Offline</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className={getBatteryColor(batteryLevel)}>
              {Math.round(batteryLevel)}%
            </span>
            <Battery className={`w-4 h-4 ${getBatteryColor(batteryLevel)}`} />
          </div>
        </div>
      </div>

      <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-2xl border-b border-white/10">
        <div className="px-4 lg:px-6 py-3 lg:py-4">
          {/* Main Header Content */}
          <div className="flex items-center justify-between">
            
            {/* Left Section - Brand & Mobile Menu */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Brand Logo */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-white/30 to-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl shadow-lg border border-white/20">
                  <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg lg:text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                    POS Pro
                  </h1>
                  <p className="text-blue-100 text-xs lg:text-sm hidden lg:block">
                    Enterprise Retail System
                  </p>
                </div>
              </div>
            </div>

            {/* Center Section - Date & Time */}
            <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-1 justify-center">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 lg:py-3 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-blue-200" />
                <span className="font-medium text-sm lg:text-base">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 lg:py-3 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner">
                <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-blue-200" />
                <span className="font-mono font-bold text-sm lg:text-lg">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {/* Live Status Indicator */}
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className="text-xs text-blue-200 font-medium">
                  {isOnline ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Right Section - User Info & Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Quick Actions - Mobile */}
              <div className="flex items-center space-x-1 lg:hidden">
                <button className="p-2 hover:bg-white/10 rounded-xl transition-colors active:scale-95">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-xl transition-colors active:scale-95">
                  <TrendingUp className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-white/10 rounded-xl transition-all duration-200 active:scale-95 group">
                <Bell className="w-5 h-5 lg:w-6 lg:h-6 text-white group-hover:scale-110 transition-transform" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-blue-600 shadow-lg animate-pulse">
                  3
                </span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-2 lg:space-x-3 bg-white/10 px-3 lg:px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10 shadow-inner hover:bg-white/15 transition-all duration-200 cursor-pointer group">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </div>
                <div className="hidden lg:block text-right">
                  <div className="font-semibold text-sm">Admin User</div>
                  <div className="text-blue-200 text-xs">Store Manager</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Date & Time & Status */}
          <div className="md:hidden mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Calendar className="w-4 h-4 text-blue-200" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
                <Clock className="w-4 h-4 text-blue-200" />
                <span className="font-mono text-sm font-bold">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {/* Mobile Status */}
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
                isOnline 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {isOnline ? '🟢 Live' : '🔴 Offline'}
              </div>
            </div>
          </div>

          {/* Mobile Quick Stats Bar */}
          <div className="lg:hidden mt-3 grid grid-cols-4 gap-2">
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm border border-white/10">
              <Package className="w-4 h-4 mx-auto mb-1 text-blue-200" />
              <div className="text-xs text-white font-bold">1.2K</div>
              <div className="text-[10px] text-blue-200">Products</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm border border-white/10">
              <ShoppingCart className="w-4 h-4 mx-auto mb-1 text-green-200" />
              <div className="text-xs text-white font-bold">48</div>
              <div className="text-[10px] text-blue-200">Today</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm border border-white/10">
              <TrendingUp className="w-4 h-4 mx-auto mb-1 text-yellow-200" />
              <div className="text-xs text-white font-bold">KES 12.5K</div>
              <div className="text-[10px] text-blue-200">Revenue</div>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center backdrop-blur-sm border border-white/10">
              <Zap className="w-4 h-4 mx-auto mb-1 text-purple-200" />
              <div className="text-xs text-white font-bold">98%</div>
              <div className="text-[10px] text-blue-200">Uptime</div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-gradient-to-b from-blue-700 to-purple-800 border-t border-white/10 shadow-2xl">
            <div className="px-4 py-3 space-y-2">
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                <Search className="w-5 h-5" />
                <span>Search Products</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span>Quick Sale</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Sales Report</span>
              </button>
              <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors">
                <Package className="w-5 h-5" />
                <span>Inventory</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Custom Styles for Mobile Optimization */}
      <style jsx>{`
        @media (max-width: 640px) {
          /* Ensure header doesn't cause horizontal scroll */
          header {
            width: 100vw;
            position: relative;
            left: 50%;
            right: 50%;
            margin-left: -50vw;
            margin-right: -50vw;
          }
        }
      `}</style>
    </>
  );
};

export default Header;