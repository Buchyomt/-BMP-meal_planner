import React from 'react';
import { BarChart, Bar, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import './SavingsChart.css';

const SavingsChart = ({ weeklyHistory, totalSavings }) => {
  const chartData = weeklyHistory && weeklyHistory.length > 0 
    ? weeklyHistory 
    : [
        { day: 'Mon', savings: 0 },
        { day: 'Tue', savings: 0 },
        { day: 'Wed', savings: 0 },
        { day: 'Thu', savings: 0 },
        { day: 'Fri', savings: 0 },
        { day: 'Sat', savings: 0 },
      ];

  const formattedSavings = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(totalSavings || 0);

  return (
    <div className="analytics-card savings-chart">
      <div className="card-header savings-header">
        <h3>Weekly Savings</h3>
        <span className="time-badge">This Week</span>
      </div>
      
      <div className="savings-summary">
        <div className="savings-icon-box">
          <TrendingUp color="#B45309" size={20} />
        </div>
        <div>
          <h2 className="savings-amount">{formattedSavings}</h2>
          <p className="savings-subtitle">saved against budget</p>
          <p className="savings-trend text-yellow">↗ Consistent savings</p>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={100} style={{ pointerEvents: 'none' }}>
          <BarChart data={chartData}>
            <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 2 ? '#09b428ff' : '#12883fff'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SavingsChart;
