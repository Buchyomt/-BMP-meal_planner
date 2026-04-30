import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Share2, FileDown, Check } from 'lucide-react';

const CostSummary = () => {
  const { categories, weeklyBudget: defaultListBudget } = useSelector(state => state.shoppingList);
  const { total: globalBudget, spent: globalSpent } = useSelector(state => state.budget);
  
  const [shareStatus, setShareStatus] = useState('Share Shopping List');
  const [exportStatus, setExportStatus] = useState('Export as PDF');
  
  const allItems = categories.flatMap(c => c.items);
  const totalPlannedCost = allItems.reduce((sum, item) => sum + (item.price || 0), 0);
  
  // Use globalSpent as our 'Purchased/Spent' amount (synced from checked items in ShoppingList.jsx)
  const actualSpent = globalSpent;
  
  const checkedItems = allItems.filter(item => item.checked);
  const purchasePercentage = allItems.length > 0 
    ? Math.round((checkedItems.length / allItems.length) * 100) 
    : 0;
    
  const budgetSpentPercentage = Math.min(Math.round((actualSpent / globalBudget) * 100), 100);
  const amountLeft = globalBudget - actualSpent;

  const getFormattedList = () => {
    let list = `🛒 BMP SHOPPING LIST\n`;
    list += `----------------------------\n`;
    
    categories.forEach(cat => {
      if (cat.items.length > 0) {
        list += `\n${cat.emoji} ${cat.name.toUpperCase()}\n`;
        cat.items.forEach(item => {
          list += `${item.checked ? '✅' : '⬜'} ${item.name} (₦${item.price.toLocaleString()})\n`;
        });
      }
    });

    list += `\n----------------------------\n`;
    list += `💰 TOTAL PLANNED: ₦${totalPlannedCost.toLocaleString()}\n`;
    list += `💸 ACTUAL SPENT: ₦${actualSpent.toLocaleString()}\n`;
    list += `📅 Generated on: ${new Date().toLocaleDateString()}\n`;
    return list;
  };

  const handleShare = async () => {
    try {
      const text = getFormattedList();
      await navigator.clipboard.writeText(text);
      setShareStatus('Copied to Clipboard!');
      setTimeout(() => setShareStatus('Share Shopping List'), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleExport = () => {
    const text = getFormattedList();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bmp_shopping_list_${new Date().getTime()}.txt`;
    a.click();
    
    setExportStatus('Downloading...');
    setTimeout(() => setExportStatus('Export as PDF'), 2000);
  };

  return (
    <div className="cost-summary-card">
      <div className="summary-header">
        <h3>Cost Summary</h3>
        <p>Real-time budget synchronization</p>
      </div>
      
      <div className="total-display">
        <div className="amount-label">
          <span>Actual Spent</span>
          <div className="budget-badge">
            Target: ₦{globalBudget.toLocaleString()}
          </div>
        </div>
        <div className="total-amount">₦{actualSpent.toLocaleString()}</div>
      </div>
      
      <div className="budget-progress-section">
        <div className="progress-labels">
          <span>Budget Utilization</span>
          <span className="percentage">{budgetSpentPercentage}%</span>
        </div>
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${budgetSpentPercentage}%` }}
          ></div>
        </div>
        <div className="progress-footer">
          <div className="footer-item">
            <span className="label">₦{actualSpent.toLocaleString()}</span>
            <span className="sub-label">spent</span>
          </div>
          <div className="footer-item align-right">
            <span className="label">₦{amountLeft.toLocaleString()}</span>
            <span className="sub-label">left</span>
          </div>
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-icon circle green">🛒</div>
          <div className="stat-info">
            <div className="stat-row">
              <span className="stat-label">Items Bought</span>
              <span className="stat-value green">{purchasePercentage}%</span>
            </div>
            <div className="mini-progress">
              <div className="mini-fill" style={{ width: `${purchasePercentage}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-icon circle blue">📝</div>
          <div className="stat-info">
            <div className="stat-row">
              <span className="stat-label">Planned Cost</span>
              <span className="stat-value blue">₦{totalPlannedCost.toLocaleString()}</span>
            </div>
            <p className="stat-sub-label">Total list value</p>
          </div>
        </div>
      </div>
      
      <div className="category-breakdown">
        <h4>CATEGORY BREAKDOWN</h4>
        {categories.map(cat => {
          const catTotal = cat.items.reduce((sum, item) => sum + (item.price || 0), 0);
          const catPercentage = totalPlannedCost > 0 ? (catTotal / totalPlannedCost) * 100 : 0;
          return (
            <div key={cat.id} className="breakdown-row">
              <div className="breakdown-info">
                <span className="cat-name">{cat.emoji} {cat.name}</span>
                <span className="cat-price">₦{catTotal.toLocaleString()}</span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className={`bar-fill category-${cat.id}`} 
                  style={{ width: `${catPercentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="action-buttons">
        <button 
          className={`btn-share ${shareStatus === 'Copied to Clipboard!' ? 'active' : ''}`}
          onClick={handleShare}
        >
          {shareStatus === 'Copied to Clipboard!' ? <Check size={16} /> : <Share2 size={16} />}
          {shareStatus}
        </button>
        <button 
          className={`btn-export ${exportStatus === 'Downloading...' ? 'active' : ''}`}
          onClick={handleExport}
        >
          {exportStatus === 'Downloading...' ? <Check size={16} /> : <FileDown size={16} />}
          {exportStatus}
        </button>
      </div>
    </div>
  );
};

export default CostSummary;
