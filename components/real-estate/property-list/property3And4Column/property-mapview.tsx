'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, X, SearchIcon, RotateCcw } from 'lucide-react';

export function MapView({ properties = [], title = 'Property Listings' }) {
  const [viewType, setViewType] = useState('grid');
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* GRID WRAPPER */}
      <div className='grid grid-cols-1 xl:grid-cols-12 gap-6'>
        {/* LEFT SIDE - Property Listings */}
        <div className='xl:col-span-5 p-6 lg:p-8 overflow-y-auto h-[calc(100vh-80px)]'>
          {/* Header */}
          <div className='flex items-center justify-between mb-6'>
            <div>
              <h2 className='text-xl font-semibold text-gray-900 mb-1'>
                {title}
              </h2>
              <p className='text-sm text-gray-500'>
                Showing 1–{properties.length} of {properties.length} results
              </p>
            </div>

            {/* Filter Toggle Button */}
            <Button
              onClick={() => setShowFilter(true)}
              variant='outline'
              className='rounded-full text-gray-800 px-4 py-2 border shadow-sm hover:bg-gray-50 flex items-center gap-2'
            >
              <SlidersHorizontal className='h-4 w-4' /> More Filter
            </Button>
          </div>

          {/* Sort + View Controls */}
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Sort by</span>
              <Select>
                <SelectTrigger className='w-[120px] h-8 text-sm'>
                  <SelectValue placeholder='Newest' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='newest'>Newest</SelectItem>
                  <SelectItem value='bestseller'>Best Seller</SelectItem>
                  <SelectItem value='bestmatch'>Best Match</SelectItem>
                  <SelectItem value='pricelow'>Price Low</SelectItem>
                  <SelectItem value='pricehigh'>Price High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Grid/List Toggle with Text */}
            <div className='flex items-center gap-0 overflow-hidden'>
              <Button
                onClick={() => setViewType('grid')}
                variant='ghost'
                className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                  viewType === 'grid'
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                Grid
              </Button>
              <div className='h-4 w-px'></div>
              <Button
                onClick={() => setViewType('list')}
                variant='ghost'
                className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                  viewType === 'list'
                    ? 'text-red-600'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                List
              </Button>
            </div>
          </div>

          {/* Property Cards */}
          <div
            className={`grid gap-6 ${
              viewType === 'grid' ? 'sm:grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {properties.map((p) => (
              <Card
                key={p.id}
                className='overflow-hidden border rounded-xl shadow-sm hover:shadow-md transition-all duration-200'
              >
                <img
                  src={p.image}
                  alt={p.title}
                  className='w-full h-40 object-cover'
                />
                <CardContent className='p-4 space-y-2'>
                  <div className='flex gap-2 flex-wrap'>
                    {p.featured && (
                      <Badge className='bg-red-500 hover:bg-red-600 text-white text-xs'>
                        FEATURED
                      </Badge>
                    )}
                    <Badge className='bg-black hover:bg-gray-800 text-white text-xs'>
                      FOR {p.priceType === 'rent' ? 'RENT' : 'SALE'}
                    </Badge>
                  </div>
                  <h3 className='font-semibold text-gray-900 text-sm truncate'>
                    {p.title}
                  </h3>
                  <p className='text-sm text-gray-500'>{p.location}</p>
                  <p className='text-red-600 font-bold text-sm'>
                    {p.priceType === 'rent'
                      ? `$${p.price.toLocaleString()} / mo`
                      : `$${p.price.toLocaleString()}`}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE - Google Map */}
        <div className='xl:col-span-7 relative h-[calc(100vh-80px)] bg-gray-200'>
          <iframe
            title='Map'
            className='w-full h-full'
            src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31510.7524969315!2d-118.343!3d34.052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80c2c0!2sLos%20Angeles!5e0!3m2!1sen!2sus!4v1700000000000'
            loading='lazy'
          ></iframe>
        </div>
      </div>

      {/* Filter Popup Modal - Centered Popup Style */}
      <AnimatePresence>
        {showFilter && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'
              onClick={() => setShowFilter(false)}
            />

            {/* Centered Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden'>
                <div className='flex items-center justify-between p-6 border-b'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    Filters
                  </h3>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setShowFilter(false)}
                    className='h-8 w-8 rounded-full hover:bg-gray-100'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                </div>

                <div className='overflow-y-auto max-h-[calc(90vh-80px)] p-6'>
                  <div className='space-y-6'>
                    {/* Search */}
                    <div>
                      <div className='font-semibold text-gray-900 mb-2'>
                        Find your home
                      </div>
                      <Input placeholder='What are you looking for?' />
                    </div>

                    {/* Listing Status */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Listing Status
                      </div>
                      <div className='flex gap-4'>
                        {['All', 'Buy', 'Rent'].map((option) => (
                          <label
                            key={option}
                            className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
                          >
                            <input
                              type='radio'
                              name='listing-status'
                              value={option}
                              className='h-4 w-4 border-gray-300 text-red-500 focus:ring-red-500'
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Property Type */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Property Type
                      </div>
                      <div className='flex gap-4'>
                        {['Houses', 'Apartments'].map((option) => (
                          <label
                            key={option}
                            className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              value={option}
                              className='h-4 w-4 border-gray-300 text-red-500 focus:ring-red-500'
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Price Range
                      </div>
                      <Slider max={6000000} step={1000} className='mb-4' />
                      <div className='flex gap-3'>
                        <Input placeholder='Min.' />
                        <span className='flex items-center'>-</span>
                        <Input placeholder='Max' />
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Bedrooms
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {['Any', '2+', '3+', '4+', '5+'].map((option) => (
                          <label key={option} className='cursor-pointer'>
                            <input
                              type='radio'
                              name='bedrooms'
                              value={option}
                              className='peer hidden'
                            />
                            <span className='flex items-center justify-center px-4 py-2 border rounded-lg text-sm text-gray-700 hover:border-red-400 peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-600'>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Bathrooms
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {['Any', '1+', '2+', '3+', '4+', '5+'].map((option) => (
                          <label key={option} className='cursor-pointer'>
                            <input
                              type='radio'
                              name='bathrooms'
                              value={option}
                              className='peer hidden'
                            />
                            <span className='flex items-center justify-center px-4 py-2 border rounded-lg text-sm text-gray-700 hover:border-red-400 peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-600'>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Location
                      </div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder='All Cities' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='ny'>New York</SelectItem>
                          <SelectItem value='la'>Los Angeles</SelectItem>
                          <SelectItem value='chicago'>Chicago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Square Feet */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Square Feet
                      </div>
                      <div className='flex gap-3'>
                        <Input placeholder='Min.' />
                        <span className='flex items-center'>-</span>
                        <Input placeholder='Max' />
                      </div>
                    </div>

                    {/* Year Built */}
                    <div>
                      <div className='mb-3 font-semibold text-gray-900'>
                        Year Built
                      </div>
                      <div className='flex gap-3'>
                        <Input placeholder='From' />
                        <span className='flex items-center'>-</span>
                        <Input placeholder='To' />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className='flex gap-3 pt-4'>
                      <Button className='flex-1 bg-[#F35C48] hover:bg-[#d94d3c] flex items-center justify-center gap-2'>
                        <SearchIcon className='h-4 w-4' />
                        Search
                      </Button>
                      <Button
                        variant='outline'
                        className='flex items-center justify-center gap-2'
                      >
                        <RotateCcw className='h-4 w-4' />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
