import React, { useContext, useMemo, useState } from "react";
import { POSContext } from "../context/POSContext";
import { 
  Bar, 
  Line, 
  Doughnut, 
  Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  Decimation
} from "chart.js";
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  ShoppingCart,
  Users,
  BarChart3,
  Download,
  Calendar,
  RefreshCw,
  Eye,
  MessageSquare
} from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  Decimation
);

const Dashboard = () => {
  const { products, orders, getProfit, customers = [] } = useContext(POSContext);
  const [dateRange, setDateRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Enhanced data processing with real synchronization
  const dashboardData = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    
    // Enhanced sales data processing
    const recentOrders = Array.isArray(orders) ? orders : [];
    const totalSales = recentOrders.reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0);
    const totalOrders = recentOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Enhanced customer analytics
    const totalCustomers = Array.isArray(customers) ? customers.length : 0;
    const newCustomersThisMonth = customers.filter(c => {
      if (!c.joinDate) return false;
      const custDate = new Date(c.joinDate);
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      return custDate >= monthStart;
    }).length;

    // Enhanced category calculations
    const categoryData = categories.map(cat => {
      const categoryProducts = products.filter(p => p.category === cat);
      const totalStock = categoryProducts.reduce((acc, p) => acc + (parseInt(p.qty) || 0), 0);
      const totalProfit = categoryProducts.reduce((acc, p) => acc + (getProfit(p) * (parseInt(p.qty) || 0)), 0);
      const totalValue = categoryProducts.reduce((acc, p) => acc + ((parseFloat(p.sellingPrice) || 0) * (parseInt(p.qty) || 0)), 0);
      const lowStockItems = categoryProducts.filter(p => (parseInt(p.qty) || 0) <= (parseInt(p.reorderLevel) || 5)).length;
      
      // Enhanced sales calculation per category
      const categorySales = recentOrders.reduce((acc, order) => {
        const catItems = Array.isArray(order.items) ? order.items.filter(item => item.category === cat) : [];
        return acc + catItems.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
      }, 0);
      
      return {
        name: cat,
        stock: totalStock,
        profit: totalProfit,
        value: totalValue,
        lowStock: lowStockItems,
        productCount: categoryProducts.length,
        sales: categorySales
      };
    });

    // Enhanced overall metrics
    const totalProducts = products.length;
    const totalStockValue = products.reduce((acc, p) => acc + ((parseFloat(p.sellingPrice) || 0) * (parseInt(p.qty) || 0)), 0);
    const totalPotentialProfit = products.reduce((acc, p) => acc + (getProfit(p) * (parseInt(p.qty) || 0)), 0);
    const lowStockProducts = products.filter(p => (parseInt(p.qty) || 0) <= (parseInt(p.reorderLevel) || 5) && (parseInt(p.qty) || 0) > 0);
    const outOfStockProducts = products.filter(p => (parseInt(p.qty) || 0) === 0);
    
    // Enhanced top performing products
    const topProducts = [...products]
      .sort((a, b) => (getProfit(b) * (parseInt(b.qty) || 0)) - (getProfit(a) * (parseInt(a.qty) || 0)))
      .slice(0, 5);

    // Enhanced sales trends with proper date handling
    const salesData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      
      const daySales = recentOrders.filter(order => {
        if (!order.date) return false;
        const orderDate = new Date(order.date);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      }).reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: daySales,
        fullDate: date
      };
    });

    // Enhanced inventory health score
    const inventoryHealth = Math.max(0, 100 - 
      (outOfStockProducts.length / Math.max(products.length, 1) * 50) - 
      (lowStockProducts.length / Math.max(products.length, 1) * 25)
    );

    // Enhanced recent sales with proper data handling
    const recentSales = recentOrders
      .slice(-10)
      .map(sale => ({
        ...sale,
        total: parseFloat(sale.total) || 0,
        items: Array.isArray(sale.items) ? sale.items : [],
        date: sale.date || new Date().toISOString()
      }))
      .reverse();

    return {
      categories,
      categoryData,
      totalProducts,
      totalStockValue,
      totalPotentialProfit,
      lowStockProducts,
      outOfStockProducts,
      topProducts,
      recentSales,
      totalSales,
      totalOrders,
      averageOrderValue,
      totalCustomers,
      newCustomersThisMonth,
      salesData,
      inventoryHealth
    };
  }, [products, orders, getProfit, customers, dateRange]);

  // Enhanced chart configurations with zoom and interaction
  const charts = {
    categoryPerformance: {
      data: {
        labels: dashboardData.categoryData.map(c => c.name),
        datasets: [
          {
            label: "Stock Value",
            data: dashboardData.categoryData.map(c => c.value),
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgba(59, 130, 246, 1)",
            borderWidth: 2,
            yAxisID: 'y',
          },
          {
            label: "Sales Revenue",
            data: dashboardData.categoryData.map(c => c.sales),
            backgroundColor: "rgba(16, 185, 129, 0.8)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 2,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { 
          mode: 'index', 
          intersect: false 
        },
        plugins: {
          legend: { 
            position: "top",
            labels: {
              usePointStyle: true,
              padding: 15
            }
          },
          title: { 
            display: true, 
            text: "Category Performance",
            font: { size: 16, weight: 'bold' },
            padding: { bottom: 20 }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: { size: 14 },
            bodyFont: { size: 13 },
            padding: 12,
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) label += ': ';
                label += 'KES ' + context.parsed.y.toFixed(2);
                return label;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { 
              display: true, 
              text: 'Stock Value (KES)'
            },
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: { 
              display: true, 
              text: 'Sales Revenue (KES)'
            },
            grid: { drawOnChartArea: false }
          }
        }
      }
    },

    salesTrend: {
      data: {
        labels: dashboardData.salesData.map(d => d.date),
        datasets: [{
          label: "Daily Sales",
          data: dashboardData.salesData.map(d => d.sales),
          borderColor: "rgba(139, 92, 246, 1)",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "rgba(139, 92, 246, 1)",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false 
          },
          title: { 
            display: true, 
            text: "Sales Trend (30 Days)",
            font: { size: 16, weight: 'bold' },
            padding: { bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Sales: KES ${context.parsed.y.toFixed(2)}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Sales (KES)'
            },
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          },
          x: {
            grid: { color: 'rgba(0, 0, 0, 0.1)' }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    },

    stockDistribution: {
      data: {
        labels: dashboardData.categoryData.map(c => c.name),
        datasets: [{
          data: dashboardData.categoryData.map(c => c.stock),
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderWidth: 3,
          borderColor: '#fff',
          hoverBorderWidth: 4,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
          legend: { 
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              boxWidth: 8
            }
          },
          title: { 
            display: true, 
            text: 'Stock Distribution',
            font: { size: 16, weight: 'bold' },
            padding: { bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} units (${percentage}%)`;
              }
            }
          }
        }
      }
    },

    profitPotential: {
      data: {
        labels: dashboardData.categoryData.map(c => c.name),
        datasets: [{
          data: dashboardData.categoryData.map(c => c.profit),
          backgroundColor: dashboardData.categoryData.map(c => 
            c.profit > 1000 ? 'rgba(16, 185, 129, 0.8)' : 
            c.profit > 500 ? 'rgba(245, 158, 11, 0.8)' : 'rgba(239, 68, 68, 0.8)'
          ),
          borderWidth: 3,
          borderColor: '#fff',
          hoverBorderWidth: 4,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { 
            display: true, 
            text: 'Profit by Category',
            font: { size: 16, weight: 'bold' },
            padding: { bottom: 20 }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Profit: KES ${context.parsed.toFixed(2)}`;
              }
            }
          }
        }
      }
    }
  };

  // Enhanced KPI Cards Component
  const KPICard = ({ title, value, subtitle, icon: Icon, color = "blue" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-4 lg:p-6 border-l-4 border-${color}-500 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-xs lg:text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-2 lg:p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  // Enhanced Alert Component
  const Alert = ({ type, message, count, action }) => (
    <div className={`p-3 lg:p-4 rounded-xl border-l-4 ${
      type === 'error' ? 'border-red-500 bg-red-50' :
      type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
      'border-blue-500 bg-blue-50'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${
            type === 'error' ? 'bg-red-100' :
            type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
          }`}>
            <AlertTriangle className={`w-4 h-4 ${
              type === 'error' ? 'text-red-600' :
              type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
            }`} />
          </div>
          <div className="ml-3">
            <p className={`text-sm font-semibold ${
              type === 'error' ? 'text-red-800' :
              type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
            }`}>
              {count && <span className="font-black">({count}) </span>}
              {message}
            </p>
          </div>
        </div>
        {action && (
          <button className={`text-xs font-medium px-3 py-1 rounded-lg ${
            type === 'error' ? 'bg-red-600 text-white hover:bg-red-700' :
            type === 'warning' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
            'bg-blue-600 text-white hover:bg-blue-700'
          } transition-colors`}>
            {action}
          </button>
        )}
      </div>
    </div>
  );

  // Inventory Health Gauge - Mobile Optimized
  const InventoryHealth = ({ score }) => {
    const getHealthColor = (score) => {
      if (score >= 80) return 'text-green-600';
      if (score >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getHealthStatus = (score) => {
      if (score >= 80) return 'Excellent';
      if (score >= 60) return 'Good';
      if (score >= 40) return 'Fair';
      return 'Poor';
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Health</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-xl lg:text-2xl font-bold ${getHealthColor(score)}`}>
                  {score.toFixed(0)}%
                </div>
                <div className="text-xs lg:text-sm text-gray-600">{getHealthStatus(score)}</div>
              </div>
            </div>
            <div 
              className="absolute top-0 left-0 w-24 h-24 lg:w-32 lg:h-32 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent transform -rotate-45"
              style={{
                clipPath: `inset(0 0 ${100 - score}% 0)`
              }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-6">
      {/* Header - Mobile Optimized */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-lg">Real-time business insights</p>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 flex-wrap">
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
              <option value="90d">90 Days</option>
            </select>
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden lg:inline">Refresh</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alert Section - Mobile Optimized */}
      <div className="mb-6 lg:mb-8 grid grid-cols-1 gap-3 lg:gap-4">
        {dashboardData.outOfStockProducts.length > 0 && (
          <Alert 
            type="error" 
            message="Out of stock items" 
            count={dashboardData.outOfStockProducts.length}
            action="Restock"
          />
        )}
        {dashboardData.lowStockProducts.length > 0 && (
          <Alert 
            type="warning" 
            message="Low stock alerts" 
            count={dashboardData.lowStockProducts.length}
            action="View"
          />
        )}
      </div>

      {/* KPI Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
        <KPICard
          title="Total Revenue"
          value={`KES ${dashboardData.totalSales.toLocaleString()}`}
          subtitle="All time sales"
          icon={DollarSign}
          color="green"
        />
        <KPICard
          title="Total Orders"
          value={dashboardData.totalOrders.toLocaleString()}
          subtitle="Completed"
          icon={ShoppingCart}
          color="blue"
        />
        <KPICard
          title="Stock Value"
          value={`KES ${Math.round(dashboardData.totalStockValue).toLocaleString()}`}
          subtitle="Inventory worth"
          icon={Package}
          color="purple"
        />
        <KPICard
          title="Customers"
          value={dashboardData.totalCustomers.toLocaleString()}
          subtitle="Active"
          icon={Users}
          color="orange"
        />
      </div>

      {/* Main Charts Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8 mb-6 lg:mb-8">
        {/* Sales Trend */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <div className="h-64 lg:h-80">
            <Line data={charts.salesTrend.data} options={charts.salesTrend.options} />
          </div>
        </div>

        {/* Inventory Health */}
        <InventoryHealth score={dashboardData.inventoryHealth} />
      </div>

      {/* Secondary Charts Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8">
        {/* Category Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <div className="h-64 lg:h-80">
            <Bar data={charts.categoryPerformance.data} options={charts.categoryPerformance.options} />
          </div>
        </div>

        {/* Stock Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <div className="h-64 lg:h-80">
            <Doughnut data={charts.stockDistribution.data} options={charts.stockDistribution.options} />
          </div>
        </div>
      </div>

      {/* Bottom Section - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Profit Potential */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <div className="h-64">
            <Pie data={charts.profitPotential.data} options={charts.profitPotential.options} />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Top Products</h3>
            <span className="text-xs lg:text-sm text-gray-500">By profit</span>
          </div>
          <div className="space-y-3">
            {dashboardData.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-xs lg:text-sm font-bold mr-3 lg:mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base truncate">{product.name}</p>
                    <p className="text-xs lg:text-sm text-gray-500 truncate">{product.category}</p>
                  </div>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <p className="font-bold text-green-600 text-sm lg:text-lg">
                    KES {Math.round(getProfit(product) * (parseInt(product.qty) || 0)).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Stock: {product.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Stats - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mt-6 lg:mt-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Recent Sales</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {dashboardData.recentSales.length > 0 ? (
              dashboardData.recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm lg:text-base truncate">
                      Order #{sale.id?.slice(-6) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(sale.date).toLocaleDateString()} • {sale.items?.length || 0} items
                    </p>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">
                      KES {sale.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent sales</p>
                <p className="text-sm">Sales will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg p-4 lg:p-6 text-white">
          <h3 className="text-lg lg:text-xl font-semibold mb-4 lg:mb-6">Performance</h3>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm lg:text-base">Avg. Order Value</span>
              <span className="font-bold text-sm lg:text-base">KES {dashboardData.averageOrderValue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm lg:text-base">New Customers</span>
              <span className="font-bold text-green-300 text-sm lg:text-base">+{dashboardData.newCustomersThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm lg:text-base">Inventory Health</span>
              <span className="font-bold text-sm lg:text-base">{dashboardData.inventoryHealth.toFixed(0)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm lg:text-base">Total Products</span>
              <span className="font-bold text-sm lg:text-base">{dashboardData.totalProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;