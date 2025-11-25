import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Save, 
  RefreshCw, 
  Settings as SettingsIcon,
  DollarSign,
  Bell,
  Receipt,
  Shield,
  Database,
  Palette,
  Store,
  User,
  CreditCard,
  BarChart3,
  Download,
  Upload
} from 'lucide-react';

const Settings = () => {
  // Load existing settings from localStorage or use defaults
  const [settings, setSettings] = useState({
    // Business Settings
    businessName: 'Business POS',
    businessEmail: 'contact@business.com',
    businessPhone: '+254 700 000 000',
    businessAddress: 'Nairobi, Kenya',
    
    // Tax & Pricing
    taxRate: 16,
    defaultDiscount: 0,
    currency: 'KES',
    currencySymbol: 'KSh',
    
    // Stock & Inventory
    lowStockAlert: true,
    lowStockThreshold: 5,
    autoReorder: false,
    reorderQuantity: 10,
    
    // Sales & Receipts
    printReceipt: true,
    receiptFooter: 'Thank you for your business!',
    showTaxOnReceipt: true,
    defaultPaymentMethod: 'cash',
    
    // Security & Access
    requirePin: false,
    sessionTimeout: 30,
    backupAuto: false,
    
    // Appearance
    theme: 'light',
    language: 'en',
    dateFormat: 'DD/MM/YYYY',
  });

  const [activeTab, setActiveTab] = useState('business');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('pos_settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Error loading saved settings');
      }
    };

    loadSettings();
  }, []);

  // Handle setting changes
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Save all settings
  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      localStorage.setItem('pos_settings', JSON.stringify(settings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(
        <div className="flex items-center space-x-2">
          <Save className="w-5 h-5" />
          <span>Settings saved successfully</span>
        </div>,
        { autoClose: 3000 }
      );
      
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        businessName: 'Business POS',
        businessEmail: 'contact@business.com',
        businessPhone: '+254 700 000 000',
        businessAddress: 'Nairobi, Kenya',
        taxRate: 16,
        defaultDiscount: 0,
        currency: 'KES',
        currencySymbol: 'KSh',
        lowStockAlert: true,
        lowStockThreshold: 5,
        autoReorder: false,
        reorderQuantity: 10,
        printReceipt: true,
        receiptFooter: 'Thank you for your business!',
        showTaxOnReceipt: true,
        defaultPaymentMethod: 'cash',
        requirePin: false,
        sessionTimeout: 30,
        backupAuto: false,
        theme: 'light',
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
      };
      
      setSettings(defaultSettings);
      setHasUnsavedChanges(true);
      toast.info('Settings reset to defaults');
    }
  };

  // Export settings
  const handleExport = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pos-settings-backup.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  // Import settings
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(prev => ({ ...prev, ...importedSettings }));
          setHasUnsavedChanges(true);
          toast.success('Settings imported successfully');
        } catch (error) {
          toast.error('Invalid settings file');
        }
      };
      reader.readAsText(file);
    }
    event.target.value = ''; // Reset file input
  };

  const settingTabs = [
    { id: 'business', label: 'Business', icon: Store },
    { id: 'tax', label: 'Tax & Pricing', icon: DollarSign },
    { id: 'inventory', label: 'Inventory', icon: Database },
    { id: 'sales', label: 'Sales & Receipts', icon: Receipt },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  const SettingSection = ({ title, description, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
      <div className="flex-1 mb-3 lg:mb-0">
        <label className="block text-sm font-medium text-gray-900 mb-1">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="w-full lg:w-64">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
              System Settings
            </h1>
            <p className="text-gray-600 mt-2">Configure your POS system preferences</p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 lg:mt-0">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            
            <button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {settingTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {/* Business Settings */}
          {activeTab === 'business' && (
            <div>
              <SettingSection
                title="Business Information"
                description="Basic information about your business"
              >
                <SettingRow label="Business Name" description="Display name for your POS system">
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => handleSettingChange('businessName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
                
                <SettingRow label="Business Email" description="Contact email for customers">
                  <input
                    type="email"
                    value={settings.businessEmail}
                    onChange={(e) => handleSettingChange('businessEmail', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
                
                <SettingRow label="Phone Number" description="Business contact number">
                  <input
                    type="tel"
                    value={settings.businessPhone}
                    onChange={(e) => handleSettingChange('businessPhone', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
                
                <SettingRow label="Business Address" description="Physical business location">
                  <textarea
                    value={settings.businessAddress}
                    onChange={(e) => handleSettingChange('businessAddress', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
              </SettingSection>
            </div>
          )}

          {/* Tax & Pricing Settings */}
          {activeTab === 'tax' && (
            <div>
              <SettingSection
                title="Tax & Pricing Configuration"
                description="Configure tax rates and pricing settings"
              >
                <SettingRow 
                  label="Tax Rate (%)" 
                  description="Default VAT rate applied to all sales"
                >
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={settings.taxRate}
                    onChange={(e) => handleSettingChange('taxRate', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
                
                <SettingRow 
                  label="Default Discount (%)" 
                  description="Automatic discount applied to sales"
                >
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={settings.defaultDiscount}
                    onChange={(e) => handleSettingChange('defaultDiscount', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
                
                <SettingRow label="Currency" description="Primary currency for transactions">
                  <select
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="KES">Kenyan Shilling (KES)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="GBP">British Pound (GBP)</option>
                  </select>
                </SettingRow>
                
                <SettingRow label="Currency Symbol" description="Symbol displayed with prices">
                  <input
                    type="text"
                    maxLength="3"
                    value={settings.currencySymbol}
                    onChange={(e) => handleSettingChange('currencySymbol', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
              </SettingSection>
            </div>
          )}

          {/* Inventory Settings */}
          {activeTab === 'inventory' && (
            <div>
              <SettingSection
                title="Inventory Management"
                description="Stock and inventory control settings"
              >
                <SettingRow 
                  label="Low Stock Alerts" 
                  description="Receive notifications when stock is low"
                >
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.lowStockAlert}
                      onChange={(e) => handleSettingChange('lowStockAlert', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable alerts</span>
                  </label>
                </SettingRow>
                
                <SettingRow 
                  label="Low Stock Threshold" 
                  description="Alert when stock falls below this quantity"
                >
                  <input
                    type="number"
                    min="1"
                    value={settings.lowStockThreshold}
                    onChange={(e) => handleSettingChange('lowStockThreshold', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
                
                <SettingRow 
                  label="Auto Reorder" 
                  description="Automatically create purchase orders for low stock"
                >
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.autoReorder}
                      onChange={(e) => handleSettingChange('autoReorder', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable auto reorder</span>
                  </label>
                </SettingRow>
                
                <SettingRow 
                  label="Reorder Quantity" 
                  description="Default quantity to reorder when stock is low"
                >
                  <input
                    type="number"
                    min="1"
                    value={settings.reorderQuantity}
                    onChange={(e) => handleSettingChange('reorderQuantity', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </SettingRow>
              </SettingSection>
            </div>
          )}

          {/* Sales & Receipts Settings */}
          {activeTab === 'sales' && (
            <div>
              <SettingSection
                title="Sales & Receipt Configuration"
                description="Configure sales process and receipt printing"
              >
                <SettingRow 
                  label="Print Receipt" 
                  description="Automatically print receipts after sale"
                >
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.printReceipt}
                      onChange={(e) => handleSettingChange('printReceipt', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Auto print receipts</span>
                  </label>
                </SettingRow>
                
                <SettingRow 
                  label="Show Tax on Receipt" 
                  description="Display tax breakdown on printed receipts"
                >
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.showTaxOnReceipt}
                      onChange={(e) => handleSettingChange('showTaxOnReceipt', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show tax details</span>
                  </label>
                </SettingRow>
                
                <SettingRow label="Default Payment Method" description="Preferred payment method">
                  <select
                    value={settings.defaultPaymentMethod}
                    onChange={(e) => handleSettingChange('defaultPaymentMethod', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="bank">Bank Transfer</option>
                  </select>
                </SettingRow>
                
                <SettingRow label="Receipt Footer" description="Custom message on receipt footer">
                  <textarea
                    value={settings.receiptFooter}
                    onChange={(e) => handleSettingChange('receiptFooter', e.target.value)}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Thank you for your business!"
                  />
                </SettingRow>
              </SettingSection>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div>
              <SettingSection
                title="Security & Access Control"
                description="System security and user access settings"
              >
                <SettingRow 
                  label="Require PIN" 
                  description="Require PIN for sensitive operations"
                >
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.requirePin}
                      onChange={(e) => handleSettingChange('requirePin', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable PIN protection</span>
                  </label>
                </SettingRow>
                
                <SettingRow 
                  label="Session Timeout (minutes)" 
                  description="Auto logout after inactivity"
                >
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', Number(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </SettingRow>
                
                <SettingRow 
                  label="Auto Backup" 
                  description="Automatically backup data daily"
                >
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.backupAuto}
                      onChange={(e) => handleSettingChange('backupAuto', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable auto backup</span>
                  </label>
                </SettingRow>
              </SettingSection>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div>
              <SettingSection
                title="Appearance & Display"
                description="Customize the look and feel of your POS"
              >
                <SettingRow label="Theme" description="Color theme for the application">
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </SettingRow>
                
                <SettingRow label="Language" description="Interface language">
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="sw">Swahili</option>
                    <option value="fr">French</option>
                  </select>
                </SettingRow>
                
                <SettingRow label="Date Format" description="How dates are displayed">
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </SettingRow>
              </SettingSection>
            </div>
          )}
        </div>
      </div>

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Settings;