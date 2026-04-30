import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import './NutritionChart.css';

const defaultData = [
  { name: 'Protein', value: 35, color: '#FF7F50' },
  { name: 'Carbs', value: 40, color: '#FFD700' },
  { name: 'Vitamins', value: 15, color: '#00BFFF' },
  { name: 'Fats', value: 10, color: '#32CD32' },
];

const NutritionChart = ({ nutritionData }) => {
  // Use dynamic data if provided, otherwise fallback to default
  const chartData = Array.isArray(nutritionData) && nutritionData.length > 0 ? nutritionData : defaultData;

  return (
    <div className="analytics-card nutrition-chart">
      <div className="card-header">
        <h3>Nutrition Balance</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={200} style={{ pointerEvents: 'none' }}>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          {chartData.map((item, index) => (
            <div key={index} className="legend-item">
              <span className="dot" style={{ backgroundColor: item.color }}></span>
              <span className="label">{item.name} {item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionChart;
