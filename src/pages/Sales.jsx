import React, { useContext, useState, useMemo, useEffect } from 'react';
import { POSContext } from '../context/POSContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Filter,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Package,
  BarChart3,
  Download,
  Receipt,
  Scan,
  Clock,
  User,
  CreditCard,
  Smartphone,
  Zap,
  Sparkles,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const Sales = () => {
  const { products, setProducts, sales, addSale, getProfit } = useContext(POSContext);

  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [filterDate, setFilterDate] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [activeView, setActiveView] = useState('pos'); // 'pos' or 'history'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Enhanced localStorage initialization with backup
  useEffect(() => {
    const initializeData = () => {
      try {
        // Load cart
        const savedCart = localStorage.getItem('pos_cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCart(Array.isArray(parsedCart) ? parsedCart : []);
        }

        // Load sales with backup
        const savedSales = localStorage.getItem('pos_sales');
        if (!savedSales && sales.length === 0) {
          // Initialize with sample data if empty
          const sampleSales = [];
          localStorage.setItem('pos_sales', JSON.stringify(sampleSales));
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        toast.error('Error loading saved data');
      }
    };

    initializeData();
  }, [sales.length]);

  // Enhanced localStorage persistence
  useEffect(() => {
    const saveCart = () => {
      try {
        localStorage.setItem('pos_cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [cart]);

  useEffect(() => {
    const saveSales = () => {
      try {
        localStorage.setItem('pos_sales', JSON.stringify(sales));
      } catch (error) {
        console.error('Error saving sales:', error);
      }
    };

    saveSales();
  }, [sales]);

  // Filter products for search
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.code.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.category.toLowerCase().includes(searchProduct.toLowerCase()) ||
      (product.barcode && product.barcode.includes(searchProduct))
    );
  }, [products, searchProduct]);

  // Enhanced cart calculations with validation
  const cartCalculations = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      const price = Number(item.sellingPrice) || 0;
      const qty = Number(item.qty) || 0;
      return acc + (price * qty);
    }, 0);
    
    const totalProfit = cart.reduce((acc, item) => {
      const profit = getProfit(item) || 0;
      const qty = Number(item.qty) || 0;
      return acc + (profit * qty);
    }, 0);
    
    const tax = subtotal * 0.16; // 16% VAT
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      itemCount: cart.reduce((acc, item) => acc + (Number(item.qty) || 0), 0)
    };
  }, [cart, getProfit]);

  // --- Enhanced Add to cart ---
  const handleAddToCart = () => {
    const product = products.find(p => p.code === selectedProduct);
    if(!product) {
      toast.error("Please select a valid product");
      return;
    }

    const productQty = Number(product.qty) || 0;
    const requestedQty = Number(quantity) || 1;

    if(requestedQty > productQty) {
      toast.error(`Not enough stock. Only ${productQty} available`);
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if(existing) {
      const newQty = (Number(existing.qty) || 0) + requestedQty;
      if(newQty > productQty) {
        toast.error(`Cannot add more. Only ${productQty - (Number(existing.qty) || 0)} left in stock`);
        return;
      }
      
      setCart(cart.map(item => 
        item.id === product.id ? {...item, qty: newQty} : item
      ));
    } else {
      setCart([...cart, {
        ...product, 
        qty: requestedQty,
        cartId: Date.now() + Math.random() // More unique ID
      }]);
    }

    toast.success(`${requestedQty} x ${product.name} added to cart`);
    setSelectedProduct('');
    setQuantity(1);
    setSearchProduct('');
  };

  // --- Quick add with barcode simulation ---
  const handleQuickAdd = (productCode, qty = 1) => {
    const product = products.find(p => p.code === productCode);
    if(!product) {
      toast.error("Product not found");
      return;
    }
    
    setSelectedProduct(productCode);
    setQuantity(qty);
    // Small delay to ensure state updates
    setTimeout(() => handleAddToCart(), 50);
  };

  // --- Remove from cart ---
  const handleRemove = (cartId) => {
    const item = cart.find(item => item.cartId === cartId);
    if (item) {
      setCart(cart.filter(item => item.cartId !== cartId));
      toast.info(`${item.name} removed from cart`);
    }
  };

  // --- Enhanced quantity management ---
  const handleQtyChange = (cartId, newQty) => {
    const newQtyNum = Number(newQty) || 0;
    
    if(newQtyNum < 1) {
      handleRemove(cartId);
      return;
    }

    const cartItem = cart.find(item => item.cartId === cartId);
    if (!cartItem) return;

    const product = products.find(p => p.id === cartItem.id);
    if (!product) return;
    
    const productQty = Number(product.qty) || 0;
    if(newQtyNum > productQty) {
      toast.error(`Only ${productQty} units available in stock`);
      return;
    }

    setCart(cart.map(item => 
      item.cartId === cartId ? {...item, qty: newQtyNum} : item
    ));
  };

  const handleQtyIncrement = (cartId) => {
    const cartItem = cart.find(item => item.cartId === cartId);
    if (cartItem) {
      handleQtyChange(cartId, (Number(cartItem.qty) || 0) + 1);
    }
  };

  const handleQtyDecrement = (cartId) => {
    const cartItem = cart.find(item => item.cartId === cartId);
    if (cartItem && (Number(cartItem.qty) || 0) > 1) {
      handleQtyChange(cartId, (Number(cartItem.qty) || 0) - 1);
    }
  };

  // --- Enhanced Checkout with validation ---
  const handleCheckout = async () => {
    if(cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    // Validate stock availability
    for(const item of cart) {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        toast.error(`Product ${item.name} not found`);
        return;
      }

      const itemQty = Number(item.qty) || 0;
      const productQty = Number(product.qty) || 0;
      
      if(itemQty > productQty) {
        toast.error(`Not enough stock for ${product.name}. Only ${productQty} available`);
        return;
      }
    }

    try {
      // Update stock
      const updatedProducts = products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        if(cartItem) {
          const newQty = Math.max(0, (Number(product.qty) || 0) - (Number(cartItem.qty) || 0));
          return {
            ...product, 
            qty: newQty.toString()
          };
        }
        return product;
      });
      setProducts(updatedProducts);

      // Record sale with enhanced data
      const saleRecord = {
        id: `SALE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          code: item.code,
          quantity: Number(item.qty) || 0,
          unitPrice: Number(item.sellingPrice) || 0,
          total: (Number(item.sellingPrice) || 0) * (Number(item.qty) || 0),
          profit: (getProfit(item) || 0) * (Number(item.qty) || 0)
        })),
        subtotal: parseFloat(cartCalculations.subtotal) || 0,
        tax: parseFloat(cartCalculations.tax) || 0,
        total: parseFloat(cartCalculations.total) || 0,
        profit: parseFloat(cartCalculations.totalProfit) || 0,
        customerName: customerName.trim() || 'Walk-in Customer',
        paymentMethod,
        date: new Date().toISOString(),
        status: 'completed',
        timestamp: Date.now()
      };

      addSale(saleRecord);

      // Print receipt
      printReceipt(saleRecord);

      // Clear cart and form
      setCart([]);
      setCustomerName('');
      setPaymentMethod('cash');
      localStorage.removeItem('pos_cart');
      
      toast.success(
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>Sale completed successfully! Receipt printed.</span>
        </div>,
        { autoClose: 3000 }
      );

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error processing sale. Please try again.');
    }
  };

  // --- Enhanced Receipt Printing ---
  const printReceipt = (sale) => {
    try {
      const receiptWindow = window.open('', '_blank');
      if (!receiptWindow) {
        toast.error('Please allow popups for receipt printing');
        return;
      }

      receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Receipt - ${sale.id}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                margin: 0; 
                padding: 20px;
                font-size: 14px;
                line-height: 1.3;
              }
              .header { 
                text-align: center; 
                margin-bottom: 20px;
                border-bottom: 2px dashed #000;
                padding-bottom: 10px;
              }
              .item { 
                margin: 8px 0;
                display: flex;
                justify-content: space-between;
              }
              .total { 
                font-weight: bold; 
                margin-top: 15px;
                border-top: 2px dashed #000;
                padding-top: 10px;
              }
              .footer { 
                margin-top: 20px; 
                text-align: center; 
                font-size: 12px;
                border-top: 1px dashed #000;
                padding-top: 10px;
              }
              .divider {
                border-top: 1px dashed #000;
                margin: 10px 0;
              }
            </style>
          </head>
          <body onload="window.print(); setTimeout(() => window.close(), 1000);">
            <div class="header">
              <h2>🛒 POS RECEIPT</h2>
              <p><strong>${sale.id}</strong></p>
              <p>${new Date(sale.date).toLocaleString()}</p>
              <p>Customer: ${sale.customerName}</p>
            </div>
            <div class="divider"></div>
            ${sale.items.map(item => `
              <div class="item">
                <div>
                  <div><strong>${item.name}</strong></div>
                  <div>${item.quantity} x KES ${item.unitPrice.toFixed(2)}</div>
                </div>
                <div>KES ${item.total.toFixed(2)}</div>
              </div>
            `).join('')}
            <div class="divider"></div>
            <div class="total">
              <div class="item"><span>Subtotal:</span> <span>KES ${sale.subtotal.toFixed(2)}</span></div>
              <div class="item"><span>Tax (16%):</span> <span>KES ${sale.tax.toFixed(2)}</span></div>
              <div class="item"><span><strong>TOTAL:</strong></span> <span><strong>KES ${sale.total.toFixed(2)}</strong></span></div>
              <div class="item"><span>Payment:</span> <span>${sale.paymentMethod.toUpperCase()}</span></div>
            </div>
            <div class="footer">
              <p>Thank you for your business!</p>
              <p>${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `);
      receiptWindow.document.close();
    } catch (error) {
      console.error('Print error:', error);
      toast.error('Error printing receipt');
    }
  };

  // --- Clear cart ---
  const handleClearCart = () => {
    if(cart.length === 0) return;
    setCart([]);
    localStorage.removeItem('pos_cart');
    toast.info("Cart cleared");
  };

  // --- Filtered Sales with pagination ---
  const filteredSales = useMemo(() => {
    const filtered = filterDate
      ? sales.filter(s => s.date && s.date.startsWith(filterDate))
      : sales;
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sales, filterDate]);

  // Pagination for sales history
  const paginatedSales = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSales, currentPage]);

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

  // Enhanced sales statistics
  const salesStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySales = sales.filter(s => 
      s.date && new Date(s.date).toDateString() === today
    );

    const totalSales = filteredSales.reduce((acc, s) => acc + (s.total || 0), 0);
    const totalProfit = filteredSales.reduce((acc, s) => acc + (s.profit || 0), 0);
    const totalItems = filteredSales.reduce((acc, s) => 
      acc + (s.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0), 0
    );

    return {
      totalSales: totalSales.toFixed(2),
      totalProfit: totalProfit.toFixed(2),
      totalItems,
      transactionCount: filteredSales.length,
      todaySales: todaySales.reduce((acc, s) => acc + (s.total || 0), 0).toFixed(2),
      todayTransactions: todaySales.length
    };
  }, [filteredSales, sales]);

  // Quick actions for common products
  const quickProducts = useMemo(() => {
    return products
      .filter(p => Number(p.qty) > 0)
      .slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 lg:p-6">
      {/* Header - Mobile Optimized */}
      <div className="mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              Point of Sale
            </h1>
            <p className="text-gray-600 mt-2 text-sm lg:text-lg">Process sales and manage transactions</p>
          </div>
          
          {/* View Toggle - Mobile Friendly */}
          <div className="flex items-center gap-3">
            <div className="flex bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setActiveView('pos')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'pos' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                POS
              </button>
              <button
                onClick={() => setActiveView('history')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeView === 'history' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                History
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* POS View */}
      {activeView === 'pos' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-8">
          {/* Left Column - Products & Cart */}
          <div className="xl:col-span-2 space-y-4 lg:space-y-6">
            {/* Product Selection */}
            <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Selection
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔍 Search Products
                  </label>
                  <input 
                    type="text"
                    placeholder="Search by name, code, or barcode..."
                    value={searchProduct}
                    onChange={e => setSearchProduct(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📦 Product
                  </label>
                  <select 
                    value={selectedProduct} 
                    onChange={e => setSelectedProduct(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select product</option>
                    {filteredProducts.map(p => (
                      <option key={p.id} value={p.code}>
                        {p.name} (Stock: {p.qty}) - KES {p.sellingPrice}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔢 Quantity
                  </label>
                  <input 
                    type="number" 
                    min="1" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button 
                onClick={handleAddToCart}
                disabled={!selectedProduct}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add to Cart
              </button>

              {/* Quick Add Products */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Add</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleQuickAdd(product.code, 1)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium text-center truncate"
                      title={product.name}
                    >
                      {product.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Shopping Cart - Mobile Optimized */}
            <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Cart ({cart.length} items)
                </h2>
                {cart.length > 0 && (
                  <button 
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Add products to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.cartId} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{item.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{item.code}</p>
                        <p className="text-xs text-gray-600">KES {item.sellingPrice} each</p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-2">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleQtyDecrement(item.cartId)}
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <input 
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => handleQtyChange(item.cartId, e.target.value)}
                            className="w-12 border border-gray-300 rounded px-1 py-1 text-center text-sm"
                          />
                          <button 
                            onClick={() => handleQtyIncrement(item.cartId)}
                            className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="text-right min-w-16">
                          <p className="font-semibold text-sm">KES {(item.sellingPrice * item.qty).toFixed(2)}</p>
                        </div>
                        
                        <button 
                          onClick={() => handleRemove(item.cartId)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Checkout & Customer Info */}
          <div className="space-y-4 lg:space-y-6">
            {/* Checkout Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Checkout
              </h2>

              {/* Customer Information */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Customer Name
                  </label>
                  <input 
                    type="text"
                    placeholder="Walk-in Customer"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CreditCard className="w-4 h-4 inline mr-1" />
                    Payment Method
                  </label>
                  <select 
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="mobile">📱 Mobile Money</option>
                    <option value="bank">🏦 Bank Transfer</option>
                  </select>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2 border-t pt-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cartCalculations.itemCount} items):</span>
                  <span>KES {cartCalculations.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (16%):</span>
                  <span>KES {cartCalculations.tax}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span>Total:</span>
                  <span>KES {cartCalculations.total}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Profit:</span>
                  <span>KES {cartCalculations.totalProfit}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold text-base transition-colors mt-4 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Complete Sale
              </button>
            </div>

            {/* Today's Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg p-4 lg:p-6 text-white">
              <h2 className="text-lg lg:text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Today's Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Transactions</span>
                  <span className="font-semibold">{salesStats.todayTransactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sales</span>
                  <span className="font-semibold">KES {salesStats.todaySales}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Items in Cart</span>
                  <span className="font-semibold">{cart.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales History View */}
      {activeView === 'history' && (
        <div className="bg-white rounded-2xl shadow-lg p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Sales History
            </h2>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <input 
                  type="date" 
                  value={filterDate} 
                  onChange={e => setFilterDate(e.target.value)}
                  className="border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              {filterDate && (
                <button 
                  onClick={() => setFilterDate('')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filteredSales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No sales records found</p>
              {filterDate && <p className="text-sm">Try selecting a different date</p>}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Sale ID</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Items</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                      <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedSales.map(sale => (
                      <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 text-sm font-medium text-gray-900">
                          <div className="truncate max-w-20">{sale.id}</div>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          <div>{new Date(sale.date).toLocaleDateString()}</div>
                          <div className="text-gray-500 text-xs">{new Date(sale.date).toLocaleTimeString()}</div>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-900 truncate max-w-24">{sale.customerName}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">
                          <div className="truncate max-w-32">
                            {sale.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm font-semibold text-gray-900">KES {sale.total?.toFixed(2)}</td>
                        <td className="px-3 py-2 text-sm font-semibold text-green-600">KES {sale.profit?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 border text-sm rounded ${
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
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {filteredSales.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Transactions:</span>
                      <div className="font-semibold">{salesStats.transactionCount}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Sales:</span>
                      <div className="font-semibold">KES {salesStats.totalSales}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Profit:</span>
                      <div className="font-semibold text-green-600">KES {salesStats.totalProfit}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Items Sold:</span>
                      <div className="font-semibold">{salesStats.totalItems}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

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

export default Sales;