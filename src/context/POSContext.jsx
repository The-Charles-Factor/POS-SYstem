import React, { createContext, useState, useEffect } from 'react';

export const POSContext = createContext();

export const POSProvider = ({ children }) => {
  // --- Demo products ---
  const demoProducts = [
    { id: 1, code: 'TO-101', name: 'Toilet Seat', category: 'Toilets', buyingPrice: 2500, sellingPrice: 3500, qty: 10, supplier: 'Sanitech Ltd', brand: 'AquaComfort', reorderLevel: 5, description: 'High-quality ceramic toilet seat' },
    { id: 2, code: 'FA-102', name: 'Faucet Tap', category: 'Taps', buyingPrice: 800, sellingPrice: 1200, qty: 15, supplier: 'FlowMaster Co.', brand: 'FlowTech', reorderLevel: 5, description: 'Chrome-finished kitchen faucet tap' },
    { id: 3, code: 'SH-103', name: 'Shower Head', category: 'Showers', buyingPrice: 1800, sellingPrice: 2500, qty: 8, supplier: 'HydroPro Ltd', brand: 'RainFlow', reorderLevel: 3, description: 'Adjustable rain shower head' },
    { id: 4, code: 'SI-104', name: 'Sink Basin', category: 'Sinks', buyingPrice: 4000, sellingPrice: 5000, qty: 5, supplier: 'CeramiCo', brand: 'PureBasin', reorderLevel: 2, description: 'Ceramic sink basin' },
    { id: 5, code: 'MI-105', name: 'Bathroom Mirror', category: 'Cabinets', buyingPrice: 1000, sellingPrice: 1800, qty: 12, supplier: 'MirrorWorks', brand: 'Reflecta', reorderLevel: 4, description: 'Elegant bathroom mirror with LED lighting' },
    { id: 6, code: 'TO-106', name: 'Wall-mounted Toilet', category: 'Toilets', buyingPrice: 7500, sellingPrice: 9500, qty: 6, supplier: 'Sanitech Ltd', brand: 'AquaComfort', reorderLevel: 3, description: 'Modern wall-mounted toilet' },
    { id: 7, code: 'FA-107', name: 'Bathroom Faucet', category: 'Taps', buyingPrice: 1000, sellingPrice: 1500, qty: 10, supplier: 'FlowMaster Co.', brand: 'FlowTech', reorderLevel: 5, description: 'Stylish bathroom faucet' },
    { id: 8, code: 'SH-108', name: 'Hand Shower', category: 'Showers', buyingPrice: 1200, sellingPrice: 1800, qty: 9, supplier: 'HydroPro Ltd', brand: 'RainFlow', reorderLevel: 4, description: 'Flexible hand shower with multiple sprays' },
    { id: 9, code: 'SI-109', name: 'Kitchen Sink', category: 'Sinks', buyingPrice: 5000, sellingPrice: 6500, qty: 7, supplier: 'CeramiCo', brand: 'PureBasin', reorderLevel: 3, description: 'Stainless steel kitchen sink' },
    { id: 10, code: 'MI-110', name: 'Medicine Cabinet', category: 'Cabinets', buyingPrice: 2000, sellingPrice: 3000, qty: 8, supplier: 'MirrorWorks', brand: 'Reflecta', reorderLevel: 3, description: 'Wall-mounted medicine cabinet' },
  ];

  // --- State ---
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  // --- Load from localStorage ---
  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem('products'));
    const storedSales = JSON.parse(localStorage.getItem('sales')) || [];

    setProducts(storedProducts && storedProducts.length > 0 ? storedProducts : demoProducts);
    setSales(storedSales);
  }, []);

  // --- Persist to localStorage ---
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  // --- Calculations ---
  const getProfit = (item) => item.sellingPrice - item.buyingPrice;
  const getCategoryProfit = (category) =>
    products
      .filter((p) => p.category === category)
      .reduce((acc, p) => acc + getProfit(p) * p.qty, 0);

  // --- CRUD Operations ---
  const addProduct = (product) => setProducts([...products, product]);
  const updateProduct = (updated) =>
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  const deleteProduct = (id) => setProducts(products.filter(p => p.id !== id));

  // --- Sales Operations ---
  const addSale = (sale) => setSales([...sales, sale]);

  return (
    <POSContext.Provider value={{
      products,
      setProducts,
      sales,
      setSales,
      getProfit,
      getCategoryProfit,
      addProduct,
      updateProduct,
      deleteProduct,
      addSale,
    }}>
      {children}
    </POSContext.Provider>
  );
};
