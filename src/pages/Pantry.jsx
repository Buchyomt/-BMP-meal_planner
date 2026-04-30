import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Minus, Search, Trash2, Boxes, AlertTriangle, CheckCircle, ImagePlus, Camera } from 'lucide-react';
import {
  updateQuantity,
  updateItemImage,
  addPantryItemWithNotification,
  removePantryItemWithNotification,
  alertLowStock,
} from '../features/pantry/pantrySlice';
import useOnlineStatus from '../hooks/useOnlineStatus';
import './Pantry.css';

const LOW_STOCK_THRESHOLD = 1;

// Fallback emoji icons per item name keyword
const getItemEmoji = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('rice'))      return '🌾';
  if (n.includes('bean'))      return '🫘';
  if (n.includes('oil'))       return '🫙';
  if (n.includes('salt'))      return '🧂';
  if (n.includes('tomato'))    return '🍅';
  if (n.includes('onion'))     return '🧅';
  if (n.includes('pepper'))    return '🌶️';
  if (n.includes('garlic'))    return '🧄';
  if (n.includes('egg'))       return '🥚';
  if (n.includes('chicken') || n.includes('meat') || n.includes('fish')) return '🍖';
  if (n.includes('milk'))      return '🥛';
  if (n.includes('flour'))     return '🌾';
  if (n.includes('sugar'))     return '🍬';
  if (n.includes('water'))     return '💧';
  if (n.includes('yam'))       return '🍠';
  return '📦';
};

const Pantry = () => {
  const dispatch   = useDispatch();
  const { items }  = useSelector((state) => state.pantry);
  const isOnline   = useOnlineStatus();

  const [searchTerm, setSearchTerm] = useState('');
  const [newItem,    setNewItem]    = useState({ name: '', quantity: '', unit: 'kg', image: '' });
  const [isAdding,  setIsAdding]   = useState(false);
  const [addedFlash, setAddedFlash] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fileInputRef    = useRef(null);
  const editFileRefs    = useRef({});

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.quantity <= LOW_STOCK_THRESHOLD).length;

  // Convert file to base64 data URL
  const fileToDataURL = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(file);
    });

  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataURL = await fileToDataURL(file);
    setImagePreview(dataURL);
    setNewItem(prev => ({ ...prev, image: dataURL }));
  };

  const handleEditImage = async (itemId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const dataURL = await fileToDataURL(file);
    dispatch(updateItemImage({ id: itemId, image: dataURL }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.quantity) return;

    const item = {
      id:       Date.now().toString(),
      name:     newItem.name.trim(),
      quantity: parseFloat(newItem.quantity),
      unit:     newItem.unit,
      image:    newItem.image || '',
    };

    dispatch(addPantryItemWithNotification(item));
    setAddedFlash(item.id);
    setTimeout(() => setAddedFlash(null), 2000);
    setNewItem({ name: '', quantity: '', unit: 'kg', image: '' });
    setImagePreview('');
    setIsAdding(false);
  };

  const adjustQuantity = (item, delta) => {
    const newQty = Math.max(0, item.quantity + delta);
    dispatch(updateQuantity({ id: item.id, quantity: newQty }));
    if (newQty <= LOW_STOCK_THRESHOLD && newQty < item.quantity) {
      dispatch(alertLowStock(item.name));
    }
  };

  const handleRemove = (item) => {
    dispatch(removePantryItemWithNotification(item.id, item.name));
  };

  return (
    <div className="pantry-page">
      <header className="page-header">
        <div className="header-text">
          <h1>Pantry Tracker</h1>
          <p>Manage your inventory to optimize your shopping spend.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lowStockCount > 0 && (
            <div className="low-stock-banner">
              <AlertTriangle size={16} />
              <span>{lowStockCount} item{lowStockCount > 1 ? 's' : ''} running low</span>
            </div>
          )}
          <button className="add-pantry-btn" onClick={() => { setIsAdding(!isAdding); setImagePreview(''); }}>
            <Plus size={18} /> Add Item
          </button>
        </div>
      </header>

      {isAdding && (
        <form className="add-item-form glass-card" onSubmit={handleAdd}>
          <h3 style={{ marginBottom: '1rem', fontWeight: 700 }}>Add New Item</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Item Name</label>
              <input
                type="text"
                placeholder="e.g. Rice, Onions"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="0.0"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Unit</label>
              <select value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
                <option>kg</option>
                <option>g</option>
                <option>L</option>
                <option>ml</option>
                <option>pack</option>
                <option>pieces</option>
                <option>cups</option>
                <option>tubers</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group image-upload-group">
            <label>Item Image <span style={{ fontWeight: 400, color: '#94A3B8' }}>(optional)</span></label>
            <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="image-upload-preview" />
              ) : (
                <div className="image-upload-placeholder">
                  <ImagePlus size={28} color="#94A3B8" />
                  <span>Click to upload a photo</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageFileChange}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={() => { setIsAdding(false); setImagePreview(''); }}>Cancel</button>
            <button type="submit" className="save-btn">
              <Plus size={16} /> Save to Pantry
            </button>
          </div>
        </form>
      )}

      <div className="pantry-controls">
        <div className="search-bar">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="item-count">{items.length} item{items.length !== 1 ? 's' : ''} in pantry</span>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-pantry">
          <Boxes size={48} style={{ opacity: 0.3 }} />
          <p>{searchTerm ? 'No items match your search.' : 'Your pantry is empty. Add an item to get started.'}</p>
        </div>
      ) : (
        <div className="pantry-grid">
          {filteredItems.map(item => {
            const isLow    = item.quantity <= LOW_STOCK_THRESHOLD;
            const justAdded = addedFlash === item.id;
            return (
              <div
                key={item.id}
                className={`pantry-card glass-card ${isLow ? 'low-stock' : ''} ${justAdded ? 'just-added' : ''}`}
              >
                {/* Card Image */}
                <div className="pantry-img-wrapper">
                  {isOnline && item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="pantry-item-img"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                  ) : null}
                  <div
                    className="pantry-item-emoji"
                    style={{ display: (isOnline && item.image) ? 'none' : 'flex' }}
                  >
                    {getItemEmoji(item.name)}
                  </div>

                  {/* Edit image button */}
                  <button
                    className="edit-img-btn"
                    title="Change image"
                    onClick={() => editFileRefs.current[item.id]?.click()}
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    ref={(el) => (editFileRefs.current[item.id] = el)}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleEditImage(item.id, e)}
                  />

                  {isLow && <span className="pantry-low-badge">⚠️ Low</span>}
                </div>

                <div className="pantry-card-body">
                  <div className="card-top">
                    <h3>{item.name}</h3>
                    <button
                      className="delete-btn"
                      onClick={() => handleRemove(item)}
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="quantity-control">
                    <button onClick={() => adjustQuantity(item, -1)} aria-label="Decrease">
                      <Minus size={16} />
                    </button>
                    <div className="quantity-display">
                      <strong>{item.quantity}</strong>
                      <span>{item.unit}</span>
                    </div>
                    <button onClick={() => adjustQuantity(item, 1)} aria-label="Increase">
                      <Plus size={16} />
                    </button>
                  </div>

                  {justAdded && (
                    <span className="added-badge">
                      <CheckCircle size={12} /> Added
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pantry;
