'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { formatNumber } from '@/utils/function.utils';

interface FloorPlan {
  id: number;
  category: string;
  square_feet: string;
  price: string;
  image: string;
}

interface Props {
  data: FloorPlan[];
}

const FloorPlans: React.FC<Props> = ({ data }) => {
  console.log('✌️data --->', data);

  // Safely group data with useMemo and null checks
  const groupedData = useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return {} as Record<string, FloorPlan[]>;
    }
    
    return data.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, FloorPlan[]>);
  }, [data]);

  console.log('✌️groupedData --->', groupedData);

  const categories = Object.keys(groupedData) || [];
  
  // Initialize state with first available data
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedSqft, setSelectedSqft] = useState('');

  // Set initial values when data is available
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      const firstCategory = categories[0];
      setActiveCategory(firstCategory);
      
      const firstPlan = groupedData[firstCategory]?.[0];
      if (firstPlan) {
        setSelectedSqft(firstPlan.square_feet);
      }
    }
  }, [categories, groupedData, activeCategory]);

  const currentPlans = groupedData?.[activeCategory] || [];
  const selectedPlan = currentPlans?.find(p => p?.square_feet === selectedSqft) || currentPlans[0];

  const formatPrice = (price: string) => {
    if (!price) return '₹0';
    const num = parseFloat(price);
    if (isNaN(num)) return '₹0';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString()}`;
  };

  const getPriceRange = (plans: FloorPlan[]) => {
    if (!plans || plans.length === 0) return '₹0';
    const prices = plans.map(p => parseFloat(p?.price || '0')).filter(price => !isNaN(price));
    if (prices.length === 0) return '₹0';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `${formatPrice(min.toString())} - ${formatPrice(max.toString())}`;
  };

  // Handle category change safely
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    const firstPlan = groupedData[cat]?.[0];
    if (firstPlan) {
      setSelectedSqft(firstPlan.square_feet);
    }
  };

  // If no data or categories, show empty state
  if (!data || data.length === 0 || categories.length === 0) {
    return (
      <div className="border-none shadow-none bg-transparent">
        <h2 className="text-xl font-semibold mb-4">Price & Floor Plan</h2>
        <div className="text-center py-8 text-gray-500">
          No floor plans available
        </div>
      </div>
    );
  }

  return (
    <div className="border-none shadow-none bg-transparent">
      <h3 className="text-xl font-semibold mb-6">Price & Floor Plan</h3>


      <div className="flex border-b border-gray-200 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`flex-1 text-center py-3 relative transition-all ${
              activeCategory === cat ? 'bg-white text-black border-b-2 border-indigo-600' : 'bg-gray-50 text-gray-600'
            }`}
          >
            <div className="font-semibold capitalize">{cat.replace('bhk', ' BHK ')}</div>
            <div className="text-sm text-gray-500">{getPriceRange(groupedData[cat])}</div>
          </button>
        ))}
      </div>

      {/* SQ.FT Tabs */}
      {currentPlans.length > 0 && (
        <div className="flex overflow-x-auto gap-4 pb-2 border-b border-gray-200 scrollbar-hide">
          {currentPlans.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedSqft(plan.square_feet)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                selectedSqft === plan.square_feet
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-black'
              }`}
            >
              {formatNumber(plan.square_feet)} SQ.FT
            </button>
          ))}
        </div>
      )}

      {/* Price */}
      {selectedPlan && (
        <div className="mt-4 text-lg font-bold">{formatPrice(selectedPlan.price)}</div>
      )}

      {/* Floor Plan Image */}
      {selectedPlan && (
        <div className="relative w-full h-80 mt-4 rounded-xl border overflow-hidden bg-gray-50">
          <Image
            src={selectedPlan.image}
            alt={selectedPlan.category}
            fill
            className="object-contain p-4"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Details */}
      {selectedPlan && (
        <div className="flex flex-wrap justify-between gap-4 mt-6 text-sm text-gray-700">
          <div className="flex flex-col items-center flex-1">
            <span className="font-semibold">Plot Area</span>
            <span>{formatNumber(selectedPlan.square_feet)} sq.ft</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="font-semibold">Rera ID</span>
            <span>Rera Not Applicable</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <span className="font-semibold">Possession Status</span>
            <span className="text-green-600 font-semibold">Ready to Move</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorPlans;