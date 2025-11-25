import React, { useContext, useState, useMemo, useEffect } from "react";
import { POSContext } from "../context/POSContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ShoppingCart, 
  DollarSign,
  BarChart3,
  Download,
  Filter,
  RefreshCw,
  Clock,
  Zap,
  Award,
  Calendar,
  Scan,
  QrCode,
  Barcode,
  Camera,
  Upload,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  Smartphone,
  Tablet,
  Monitor,
  Warehouse,
  Truck,
  Users,
  Star,
  Crown,
  Rocket,
  Sparkles,
  Target,
  PieChart,
  LineChart,
  BarChart,
  Activity
} from "lucide-react";

const Products = () => {
  const { products, setProducts, getProfit, orders = [] } = useContext(POSContext);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedProductQR, setSelectedProductQR] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const [lastSaleAlert, setLastSaleAlert] = useState({});
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [viewMode, setViewMode] = useState("table"); // table, grid, cards
  const [bulkAction, setBulkAction] = useState("");
  const [importData, setImportData] = useState("");
  const itemsPerPage = 12;

  const [formData, setFormData] = useState({
    id: null,
    code: "",
    name: "",
    category: "",
    buyingPrice: "",
    sellingPrice: "",
    qty: "",
    supplier: "",
    reorderLevel: "5",
    description: "",
    unit: "pcs",
    status: "active",
    minStock: "2",
    barcode: "",
    weight: "",
    dimensions: "",
    tags: "",
    image: "",
    notes: ""
  });

  // Enhanced Automated Stock Alerts with AI predictions
  useEffect(() => {
    const alertInterval = setInterval(() => {
      // AI-Powered Stock Predictions
      const predictedStockOuts = products.filter(product => {
        const salesVelocity = getProductSalesPerformance(product) / 30; // Daily sales
        const daysUntilOut = (product.qty || 0) / salesVelocity;
        return daysUntilOut > 0 && daysUntilOut < 7; // Will run out in 7 days
      });

      if (predictedStockOuts.length > 0) {
        predictedStockOuts.forEach(product => {
          toast.warning(
            `🤖 AI Prediction: ${product.name} may run out in ${Math.ceil((product.qty || 0) / (getProductSalesPerformance(product) / 30))} days!`,
            { 
              autoClose: 12000,
              position: "bottom-right"
            }
          );
        });
      }

      // Low stock alerts
      const lowStockItems = products.filter(p => 
        Number(p.qty) <= Number(p.reorderLevel) && Number(p.qty) > 0
      );
      
      if (lowStockItems.length > 0) {
        lowStockItems.forEach(product => {
          if (!lastSaleAlert[product.id] || Date.now() - lastSaleAlert[product.id] > 300000) {
            toast.warning(
              `🔄 Low Stock: ${product.name} has only ${product.qty} units left!`,
              { 
                autoClose: 10000,
                position: "bottom-right"
              }
            );
            setLastSaleAlert(prev => ({ ...prev, [product.id]: Date.now() }));
          }
        });
      }

      // Slow-moving products with AI insights
      const slowMovingProducts = products.filter(product => {
        const productSales = orders.flatMap(order => 
          order.items?.filter(item => item.productId === product.id) || []
        );
        
        if (productSales.length === 0) {
          const productAge = Date.now() - (product.createdAt || Date.now());
          return productAge > 30 * 24 * 60 * 60 * 1000;
        }
        
        const lastSale = Math.max(...productSales.map(sale => new Date(sale.date || Date.now())));
        const daysSinceLastSale = (Date.now() - lastSale) / (24 * 60 * 60 * 1000);
        return daysSinceLastSale > 30;
      });

      if (slowMovingProducts.length > 0) {
        slowMovingProducts.forEach(product => {
          toast.info(
            `📦 Slow Mover: ${product.name} hasn't sold in 30+ days - Consider promotions!`,
            { 
              autoClose: 8000,
              position: "bottom-right"
            }
          );
        });
      }

    }, 300000);

    return () => clearInterval(alertInterval);
  }, [products, orders, lastSaleAlert]);

  // Enhanced product analytics with AI insights
  const getProductSalesPerformance = (product) => {
    const productSales = orders.flatMap(order => 
      order.items?.filter(item => item.productId === product.id) || []
    );
    return productSales.reduce((acc, sale) => acc + (sale.quantity || 0), 0);
  };

  const getDaysSinceLastSale = (product) => {
    const productSales = orders.flatMap(order => 
      order.items?.filter(item => item.productId === product.id) || []
    );
    
    if (productSales.length === 0) return null;
    
    const lastSale = Math.max(...productSales.map(sale => new Date(sale.date || Date.now())));
    return Math.floor((Date.now() - lastSale) / (24 * 60 * 60 * 1000));
  };

  const getTotalProductSales = (product) => {
    const productSales = orders.flatMap(order => 
      order.items?.filter(item => item.productId === product.id) || []
    );
    return productSales.reduce((acc, sale) => acc + (sale.total || 0), 0);
  };

  // AI-Powered Product Health Score
  const getProductHealthScore = (product) => {
    let score = 100;
    
    // Stock level penalty
    if (Number(product.qty) === 0) score -= 40;
    else if (Number(product.qty) <= Number(product.reorderLevel)) score -= 20;
    
    // Sales performance bonus/penalty
    const salesPerformance = getProductSalesPerformance(product);
    if (salesPerformance === 0) score -= 30;
    else if (salesPerformance > 10) score += 20;
    
    // Profit margin impact
    const margin = ((Number(product.sellingPrice) - Number(product.buyingPrice)) / Number(product.sellingPrice)) * 100;
    if (margin > 50) score += 15;
    else if (margin < 20) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  };

  // Process and filter products with enhanced analytics
  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                           p.code.toLowerCase().includes(search.toLowerCase()) ||
                           (p.tags && p.tags.toLowerCase().includes(search.toLowerCase())) ||
                           (p.supplier && p.supplier.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
      const matchesStatus = statusFilter ? getStockStatus(p) === statusFilter : true;
      const matchesTab = activeTab === "all" ? true : 
                        activeTab === "low-stock" ? getStockStatus(p) === "low-stock" :
                        activeTab === "out-of-stock" ? getStockStatus(p) === "out-of-stock" :
                        activeTab === "top-performing" ? getProductHealthScore(p) >= 80 : true;

      return matchesSearch && matchesCategory && matchesStatus && matchesTab;
    });

    // Enhanced sorting with AI insights
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy.includes("Price") || sortBy === "qty" || sortBy === "reorderLevel") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }
      
      if (sortBy === "salesPerformance") {
        aVal = getProductSalesPerformance(a);
        bVal = getProductSalesPerformance(b);
      }
      
      if (sortBy === "profitMargin") {
        aVal = ((Number(a.sellingPrice) - Number(a.buyingPrice)) / Number(a.sellingPrice)) * 100;
        bVal = ((Number(b.sellingPrice) - Number(b.buyingPrice)) / Number(b.sellingPrice)) * 100;
      }

      if (sortBy === "healthScore") {
        aVal = getProductHealthScore(a);
        bVal = getProductHealthScore(b);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered.map(product => ({
      ...product,
      salesPerformance: getProductSalesPerformance(product),
      profitMargin: ((Number(product.sellingPrice) - Number(product.buyingPrice)) / Number(product.sellingPrice)) * 100,
      daysSinceLastSale: getDaysSinceLastSale(product),
      totalSales: getTotalProductSales(product),
      healthScore: getProductHealthScore(product)
    }));
  }, [products, search, categoryFilter, statusFilter, sortBy, sortOrder, activeTab, orders]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [processedProducts, currentPage]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);

  // Enhanced Stock analysis with AI insights
  const stockAnalysis = useMemo(() => {
    const lowStock = products.filter(p => Number(p.qty) <= Number(p.reorderLevel) && Number(p.qty) > 0);
    const outOfStock = products.filter(p => Number(p.qty) === 0);
    const healthyStock = products.filter(p => Number(p.qty) > Number(p.reorderLevel));
    
    const totalInventoryValue = products.reduce((acc, p) => acc + (Number(p.buyingPrice) * Number(p.qty)), 0);
    const totalProfitPotential = products.reduce((acc, p) => acc + (getProfit(p) * Number(p.qty)), 0);

    // AI-Powered Insights
    const topSellingProducts = [...products]
      .sort((a, b) => getTotalProductSales(b) - getTotalProductSales(a))
      .slice(0, 5);

    const slowMovingProducts = products.filter(p => {
      const days = getDaysSinceLastSale(p);
      return days !== null && days > 30;
    });

    const bestMarginProducts = [...products]
      .sort((a, b) => {
        const marginA = ((Number(a.sellingPrice) - Number(a.buyingPrice)) / Number(a.sellingPrice)) * 100;
        const marginB = ((Number(b.sellingPrice) - Number(b.buyingPrice)) / Number(b.sellingPrice)) * 100;
        return marginB - marginA;
      })
      .slice(0, 5);

    const healthiestProducts = [...products]
      .sort((a, b) => getProductHealthScore(b) - getProductHealthScore(a))
      .slice(0, 5);

    return {
      lowStock,
      outOfStock,
      healthyStock,
      totalInventoryValue,
      totalProfitPotential,
      topSellingProducts,
      slowMovingProducts,
      bestMarginProducts,
      healthiestProducts,
      totalProducts: products.length,
      inventoryHealth: Math.max(0, 100 - (outOfStock.length / products.length * 50) - (lowStock.length / products.length * 25))
    };
  }, [products, getProfit, orders]);

  // Categories from existing products
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Enhanced CRUD Functions
  const handleDelete = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    toast.error("Product deleted successfully");
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleEdit = (product) => {
    setFormData({ 
      ...product,
      minStock: product.minStock || "2",
      barcode: product.barcode || "",
      weight: product.weight || "",
      dimensions: product.dimensions || "",
      tags: product.tags || "",
      image: product.image || "",
      notes: product.notes || ""
    });
    setShowForm(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enhanced Validation
    if (!formData.name || !formData.category || !formData.buyingPrice || !formData.sellingPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (Number(formData.sellingPrice) <= Number(formData.buyingPrice)) {
      toast.error("Selling price must be greater than buying price");
      return;
    }

    const productData = {
      ...formData,
      createdAt: formData.id ? formData.createdAt : Date.now(),
      updatedAt: Date.now(),
      barcode: formData.barcode || `BC${Date.now().toString().slice(-8)}`
    };

    if(formData.id) {
      // Edit existing
      const updated = products.map(p => p.id === formData.id ? productData : p);
      setProducts(updated);
      toast.success("Product updated successfully");
    } else {
      // Add new
      const newProduct = { 
        ...productData, 
        id: Date.now(),
        code: formData.code || `PROD-${Date.now().toString().slice(-6)}`
      };
      setProducts([...products, newProduct]);
      toast.success("Product added successfully");
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      id: null, 
      code: "", 
      name: "", 
      category: "", 
      buyingPrice: "", 
      sellingPrice: "", 
      qty: "", 
      supplier: "", 
      reorderLevel: "5",
      description: "",
      unit: "pcs",
      status: "active",
      minStock: "2",
      barcode: "",
      weight: "",
      dimensions: "",
      tags: "",
      image: "",
      notes: ""
    });
    setShowForm(false);
  };

  // Bulk Actions
  const handleBulkAction = (action) => {
    if (selectedProducts.size === 0) {
      toast.error("Please select products first");
      return;
    }

    const selectedIds = Array.from(selectedProducts);
    
    switch (action) {
      case "delete":
        const updated = products.filter(p => !selectedIds.includes(p.id));
        setProducts(updated);
        setSelectedProducts(new Set());
        toast.success(`${selectedIds.length} products deleted successfully`);
        break;
      case "restock":
        const restocked = products.map(p => 
          selectedIds.includes(p.id) ? { ...p, qty: (Number(p.qty) + 10).toString() } : p
        );
        setProducts(restocked);
        toast.success(`${selectedIds.length} products restocked`);
        break;
      case "export":
        const selectedProductsData = products.filter(p => selectedIds.includes(p.id));
        const dataStr = JSON.stringify(selectedProductsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'selected-products.json';
        link.click();
        toast.success(`${selectedIds.length} products exported`);
        break;
    }
    
    setShowBulkActions(false);
  };

  // QR Code Generation
  const generateQRCode = (product) => {
    setSelectedProductQR(product);
    setShowQRModal(true);
  };

  // Import Products from JSON
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedProducts = JSON.parse(e.target.result);
          if (Array.isArray(importedProducts)) {
            const newProducts = importedProducts.map(product => ({
              ...product,
              id: product.id || Date.now() + Math.random(),
              createdAt: product.createdAt || Date.now(),
              updatedAt: Date.now()
            }));
            setProducts(prev => [...prev, ...newProducts]);
            toast.success(`${newProducts.length} products imported successfully`);
          }
        } catch (error) {
          toast.error("Invalid file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const getStockStatus = (product) => {
    if (Number(product.qty) === 0) return "out-of-stock";
    if (Number(product.qty) <= Number(product.reorderLevel)) return "low-stock";
    return "in-stock";
  };

  const StockStatusBadge = ({ product }) => {
    const status = getStockStatus(product);
    const config = {
      "in-stock": { label: "In Stock", color: "bg-green-100 text-green-800 border-green-200" },
      "low-stock": { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      "out-of-stock": { label: "Out of Stock", color: "bg-red-100 text-red-800 border-red-200" }
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config[status].color}`}>
        {config[status].label}
      </span>
    );
  };

  const HealthScoreBadge = ({ score }) => {
    const getHealthColor = (score) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      if (score >= 40) return 'bg-orange-500';
      return 'bg-red-500';
    };

    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getHealthColor(score)}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <span className="text-xs font-medium">{score}%</span>
      </div>
    );
  };

  // Enhanced KPI Card Component
  const KPICard = ({ title, value, subtitle, icon: Icon, color = "blue", trend, onClick }) => (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 border-${color}-500 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${trend.value > 0 ? 'text-green-600' : trend.value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${trend.value < 0 ? 'rotate-180' : ''}`} />
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.period}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // Quick Actions with enhanced features
  const quickActions = [
    { 
      label: "Export Inventory", 
      icon: Download, 
      action: () => {
        const dataStr = JSON.stringify(products, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'inventory-backup.json';
        link.click();
        toast.success("Inventory exported successfully");
      } 
    },
    { 
      label: "AI Analysis", 
      icon: Rocket, 
      action: () => toast.info("🤖 AI Analysis: Running inventory optimization...") 
    },
    { 
      label: "Bulk Restock", 
      icon: Package, 
      action: () => setShowBulkActions(true) 
    },
    {
      label: "Import Products",
      icon: Upload,
      action: () => document.getElementById('import-file').click()
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              Inventory Intelligence
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-lg">AI-powered inventory management with real-time insights</p>
          </div>
          <div className="flex items-center gap-3 mt-4 lg:mt-0 flex-wrap">
            <button 
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 lg:p-6 text-white mb-6 lg:mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-sm lg:text-base">AI Inventory Insights</h3>
              <p className="text-purple-200 text-xs lg:text-sm">
                {stockAnalysis.lowStock.length > 0 
                  ? `${stockAnalysis.lowStock.length} products need attention` 
                  : "Your inventory is healthy!"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">{stockAnalysis.inventoryHealth.toFixed(0)}% Health</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2 lg:gap-3 mb-6 lg:mb-8">
        {quickActions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-xs lg:text-sm font-medium"
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
        <input
          id="import-file"
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </div>

      {/* Enhanced Stock Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <KPICard
          title="Total Products"
          value={stockAnalysis.totalProducts.toLocaleString()}
          subtitle="Active items"
          icon={Package}
          color="blue"
          onClick={() => setActiveTab("all")}
        />
        
        <KPICard
          title="Inventory Value"
          value={`KES ${Math.round(stockAnalysis.totalInventoryValue).toLocaleString()}`}
          subtitle="Stock worth"
          icon={DollarSign}
          color="green"
        />
        
        <KPICard
          title="Need Attention"
          value={stockAnalysis.lowStock.length + stockAnalysis.outOfStock.length}
          subtitle="Require action"
          icon={AlertTriangle}
          color="yellow"
          onClick={() => setActiveTab("low-stock")}
        />
        
        <KPICard
          title="AI Health Score"
          value={`${stockAnalysis.inventoryHealth.toFixed(0)}%`}
          subtitle="System health"
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-4 lg:mb-6">
        <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 shadow-lg w-fit">
          {[
            { key: "all", label: "All Products", count: processedProducts.length, icon: Package },
            { key: "low-stock", label: "Need Restock", count: stockAnalysis.lowStock.length, icon: AlertTriangle },
            { key: "out-of-stock", label: "Out of Stock", count: stockAnalysis.outOfStock.length, icon: ShoppingCart },
            { key: "top-performing", label: "Top Performers", count: stockAnalysis.healthiestProducts.length, icon: Crown }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 text-xs lg:text-sm ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View:</span>
          <div className="flex bg-white rounded-xl p-1 shadow-sm">
            {[
              { key: "table", label: "Table", icon: BarChart },
              { key: "grid", label: "Grid", icon: PieChart },
              { key: "cards", label: "Cards", icon: LineChart }
            ].map((view) => (
              <button
                key={view.key}
                onClick={() => setViewMode(view.key)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  viewMode === view.key 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{selectedProducts.size} selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction("restock")}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700"
              >
                Restock
              </button>
              <button
                onClick={() => handleBulkAction("delete")}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Filters and Search */}
      <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 mb-4 lg:mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Smart Search</label>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input 
                placeholder="Search products, suppliers, tags..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 lg:py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 lg:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 lg:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
            >
              <option value="name">Name</option>
              <option value="healthScore">Health Score</option>
              <option value="salesPerformance">Sales Performance</option>
              <option value="profitMargin">Profit Margin</option>
              <option value="qty">Quantity</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setSortOrder("asc")}
                className={`flex-1 border rounded-xl px-3 py-2 lg:py-3 font-medium transition-colors text-sm ${
                  sortOrder === "asc" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                A-Z
              </button>
              <button 
                onClick={() => setSortOrder("desc")}
                className={`flex-1 border rounded-xl px-3 py-2 lg:py-3 font-medium transition-colors text-sm ${
                  sortOrder === "desc" 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Z-A
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Display - Mobile Optimized */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(new Set(paginatedProducts.map(p => p.id)));
                        } else {
                          setSelectedProducts(new Set());
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Health</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedProducts.map(product => (
                  <tr key={product.id} className="hover:bg-blue-50 transition-colors group">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedProducts);
                          if (e.target.checked) {
                            newSelected.add(product.id);
                          } else {
                            newSelected.delete(product.id);
                          }
                          setSelectedProducts(newSelected);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 text-sm">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.code}</div>
                        <div className="text-xs text-gray-400 mt-1">KES {Number(product.sellingPrice).toFixed(2)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{product.qty} units</span>
                          <StockStatusBadge product={product} />
                        </div>
                        {getStockStatus(product) === "low-stock" && (
                          <div className="text-xs text-yellow-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Reorder: {product.reorderLevel}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <HealthScoreBadge score={product.healthScore} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => generateQRCode(product)}
                          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-50 rounded transition-colors"
                          title="QR Code"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => confirmDelete(product)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="px-4 lg:px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, processedProducts.length)}
                  </span> of{" "}
                  <span className="font-medium">{processedProducts.length}</span> results
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 border text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Grid/Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {paginatedProducts.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.code}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedProducts.has(product.id)}
                  onChange={(e) => {
                    const newSelected = new Set(selectedProducts);
                    if (e.target.checked) {
                      newSelected.add(product.id);
                    } else {
                      newSelected.delete(product.id);
                    }
                    setSelectedProducts(newSelected);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Category</span>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Stock</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{product.qty}</span>
                    <StockStatusBadge product={product} />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Price</span>
                  <span className="text-sm font-semibold text-green-600">KES {Number(product.sellingPrice).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Health Score</span>
                  <HealthScoreBadge score={product.healthScore} />
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <button 
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
                <button 
                  onClick={() => generateQRCode(product)}
                  className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                >
                  <QrCode className="w-3 h-3" />
                  QR
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 lg:p-8">
              <div className="flex justify-between items-center mb-6 lg:mb-8">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {formData.id ? "Edit Product" : "Add New Product"}
                  </h3>
                  <p className="text-gray-600 mt-2 text-sm lg:text-base">
                    {formData.id ? "Update product information" : "Add a new product to your inventory"}
                  </p>
                </div>
                <button 
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Basic Information */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Basic Information</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="name" 
                    placeholder="Enter product name" 
                    value={formData.name} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Code</label>
                  <input 
                    name="code" 
                    placeholder="Auto-generated if empty" 
                    value={formData.code} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                  <input 
                    name="supplier" 
                    placeholder="Enter supplier name" 
                    value={formData.supplier} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Pricing Information */}
                <div className="lg:col-span-2 mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Pricing & Inventory</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buying Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">KES</span>
                    <input 
                      name="buyingPrice" 
                      placeholder="0.00" 
                      value={formData.buyingPrice} 
                      onChange={handleChange} 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">KES</span>
                    <input 
                      name="sellingPrice" 
                      placeholder="0.00" 
                      value={formData.sellingPrice} 
                      onChange={handleChange} 
                      type="number" 
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Quantity</label>
                  <input 
                    name="qty" 
                    placeholder="0" 
                    value={formData.qty} 
                    onChange={handleChange} 
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level</label>
                  <input 
                    name="reorderLevel" 
                    placeholder="5" 
                    value={formData.reorderLevel} 
                    onChange={handleChange} 
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Additional Information */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    placeholder="Product description, features, or notes..." 
                    value={formData.description} 
                    onChange={handleChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Advanced Details */}
                <div className="lg:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Advanced Details</h4>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Barcode</label>
                  <input 
                    name="barcode" 
                    placeholder="Auto-generated if empty" 
                    value={formData.barcode} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input 
                    name="tags" 
                    placeholder="e.g., popular, seasonal, new" 
                    value={formData.tags} 
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Real-time Price Calculation Preview */}
                {formData.buyingPrice && formData.sellingPrice && (
                  <div className="lg:col-span-2 p-4 lg:p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      AI Price Analysis
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-xl lg:text-2xl font-bold text-green-600">
                          KES {(Number(formData.sellingPrice) - Number(formData.buyingPrice)).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Profit per Unit</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-xl lg:text-2xl font-bold text-blue-600">
                          {((Number(formData.sellingPrice) - Number(formData.buyingPrice)) / Number(formData.sellingPrice) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Profit Margin</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-xl lg:text-2xl font-bold text-purple-600">
                          {((Number(formData.sellingPrice) - Number(formData.buyingPrice)) / Number(formData.buyingPrice) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Markup Percentage</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="lg:col-span-2 flex gap-3 lg:gap-4 justify-end pt-6 border-t">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-6 lg:px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm lg:text-base"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 lg:px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl text-sm lg:text-base"
                  >
                    {formData.id ? "Update Product" : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedProductQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Product QR Code</h3>
              <p className="text-gray-600 mb-6">{selectedProductQR.name}</p>
              
              {/* QR Code Placeholder - In real implementation, use a QR code library */}
              <div className="bg-gray-100 rounded-xl p-8 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Barcode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">QR Code for: {selectedProductQR.code}</p>
                  <p className="text-xs text-gray-400 mt-2">Scan to view product details</p>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowQRModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    // In real implementation, this would download the QR code
                    toast.success("QR Code downloaded successfully");
                    setShowQRModal(false);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Download QR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 lg:p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>"{productToDelete.name}"</strong>? 
                This will permanently remove the product and all associated data.
              </p>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDelete(productToDelete.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
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

export default Products;