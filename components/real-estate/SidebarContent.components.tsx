import React from 'react'
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '../ui/button';
import { RotateCcw } from 'lucide-react';

export const SidebarContent = ({state, handleChange, resetFilter}) => {
  return (
    <div className="p-4 border rounded-lg space-y-6 bg-white">
      <div className="w-full flex justify-end">
        <Button
          onClick={resetFilter}
          variant="ghost"
          className="text-sm text-gray-500 underline flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <Input
        placeholder="What are you looking for?"
        value={state.search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      {/* Add the rest of your filters exactly as before */}
      <div>
        <div className="mb-2 font-semibold text-gray-900">Price Range</div>
        <Slider
          max={6000000}
          step={1000}
          value={state.priceRange}
          onValueChange={(value) => handleChange("priceRange", value)}
        />
      </div>
    </div>
  )
}
