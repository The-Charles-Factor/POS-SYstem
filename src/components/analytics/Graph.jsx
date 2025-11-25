import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getFromStorage } from '../../utils/localStorage';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graph = () => {
  const [products, setProducts] = useState([]);

  // Fetch products from localStorage
  useEffect(() => {
    const storedProducts = getFromStorage('products');
    setProducts(storedProducts);
  }, []);

  // Fallback demo products if localStorage empty
  const dataProducts = products.length > 0 ? products : [
    { id: 1, name: 'Apple', stock: 50 },
    { id: 2, name: 'Banana', stock: 80 },
    { id: 3, name: 'Orange', stock: 40 },
  ];

  // Chart data
  const data = {
    labels: dataProducts.map(p => p.name),
    datasets: [
      {
        label: 'Stock Levels',
        data: dataProducts.map(p => p.stock),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'POS Dashboard: Stock Trends' },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="font-bold mb-2">Stock Trends</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default Graph;
