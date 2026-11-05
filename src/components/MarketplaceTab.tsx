import React, { useState } from 'react';
import { ShoppingBag, Trash2, MapPin, User, Check, Flag } from 'lucide-react';
import { MarketplaceItem } from '../types';

interface MarketplaceTabProps {
  items: MarketplaceItem[];
  onUpdateItemStatus: (id: string, newStatus: 'ACTIVE' | 'PENDING_REVIEW' | 'FLAGGED') => void;
  onDeleteItem: (id: string) => void;
  onShowToast?: (type: 'success' | 'warning' | 'info', title: string, desc?: string) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  items,
  onUpdateItemStatus,
  onDeleteItem,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Beehives',
    'Equipment',
    'Queen Bees',
    'Honey Processing',
    'Protective Wear'
  ];

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleApprove = (item: MarketplaceItem) => {
    onUpdateItemStatus(item.id, 'ACTIVE');
    if (onShowToast) {
      onShowToast('success', 'Listing Approved', `"${item.productName}" is now active in market.`);
    }
  };

  const handleFlag = (item: MarketplaceItem) => {
    onUpdateItemStatus(item.id, 'FLAGGED');
    if (onShowToast) {
      onShowToast('warning', 'Listing Flagged', `"${item.productName}" flagged for policy review.`);
    }
  };

  const handleDelete = (item: MarketplaceItem) => {
    if (window.confirm(`Delete listing "${item.productName}"?`)) {
      onDeleteItem(item.id);
      if (onShowToast) {
        onShowToast('info', 'Listing Removed', `"${item.productName}" has been deleted.`);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl w-full mx-auto space-y-6">
      {/* Header & Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span>Marketplace Moderation</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee seller listings, queen genetics, and hive equipment safety
          </p>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Moderation Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="py-3.5 px-5">Product Name & Category</th>
                <th className="py-3.5 px-5">Price (₹)</th>
                <th className="py-3.5 px-5">Seller</th>
                <th className="py-3.5 px-5">Location</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-5">
                    <p className="font-semibold text-slate-900 text-sm">{item.productName}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">{item.category}</p>
                  </td>

                  <td className="py-4 px-5 font-bold text-slate-900 text-sm">
                    ₹{item.price.toLocaleString('en-IN')}
                  </td>

                  <td className="py-4 px-5 text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.sellerName}</span>
                    </span>
                  </td>

                  <td className="py-4 px-5 text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </span>
                  </td>

                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap inline-block ${
                      item.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700'
                        : item.status === 'PENDING_REVIEW'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'ACTIVE' ? 'Approved' : item.status === 'PENDING_REVIEW' ? 'Pending Review' : 'Flagged'}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right space-x-2">
                    {item.status === 'PENDING_REVIEW' && (
                      <button
                        onClick={() => handleApprove(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}

                    {item.status !== 'FLAGGED' && (
                      <button
                        onClick={() => handleFlag(item)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-medium inline-flex items-center gap-1"
                      >
                        <Flag className="w-3 h-3" />
                        <span>Flag</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors inline-block"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
