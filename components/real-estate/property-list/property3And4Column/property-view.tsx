import { PropertyCard } from './property-card';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw, Search as SearchIcon, Loader } from "lucide-react";
import FilterDropdown from "../../FilterDropdown.component";
import Modal from "@/components/common-components/modal";
import { useSetState } from "@/utils/function.utils";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import useDebounce from "@/components/common-components/useDebounce";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";

export function PropertyView(props: any) {
  const {
    properties,
    title = 'List View',
    filters,
    loading,
    isLoadingMore,
    handNext,
    loadMore,
  } = props;

  const [state, setState] = useSetState({
    isOpen: false,
    search: '',
    listingStatus: '',
    propertyType: [],
    priceRange: [0, 50000000], // Changed to match your slider max
    minPrice: 0, // Add initial minPrice
    maxPrice: 50000000, // Add initial maxPrice
    bedrooms: '',
    bathrooms: '',
    location: '',
    sqftMin: '',
    sqftMax: '',
    yearBuiltMin: '',
    yearBuiltMax: '',
    view: 'grid',
  });
  const skeletonCount = state.view == 'grid' ? 3 : 1;

  const observer = useRef(null);
  const lastPropertyElementRef = useCallback(
    (node) => {
      if (isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && handNext) {
          loadMore({ ...state, ...debouncedState });
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoadingMore, handNext, loadMore]
  );

  const debouncedState = {
    search: useDebounce(state.search),
    priceRange: useDebounce(state.priceRange),
    minPrice: useDebounce(state.minPrice),
    maxPrice: useDebounce(state.maxPrice),
    sqftMin: useDebounce(state.sqftMin),
    sqftMax: useDebounce(state.sqftMax),
    yearBuiltMin: useDebounce(state.yearBuiltMin),
    yearBuiltMax: useDebounce(state.yearBuiltMax),
  };

  useEffect(() => {
    filters({ ...state, ...debouncedState });
  }, [
    state.listingStatus,
    state.propertyType,
    state.bedrooms,
    state.bathrooms,
    state.location,
    ...Object.values(debouncedState),
  ]);

  const handleChange = (name, value) => {
    setState({ [name]: value });
  };

  const resetFilter = () => {
    setState({
      search: '',
      listingStatus: '',
      propertyType: [],
      priceRange: [0, 6000000],
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      location: '',
      sqftMin: '',
      sqftMax: '',
      yearBuiltMin: '',
      yearBuiltMax: '',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='xl:max-w-[110rem] max-w-[85rem] mx-auto p-6'
    >
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        <aside className='space-y-6 lg:col-span-1 '>
          <div className='p-4 border rounded-lg space-y-6 bg-gray-100 border-none'>
            <div className='w-full flex justify-end'>
              <Button
                onClick={() => resetFilter()}
                variant='ghost'
                className='text-sm text-gray-500 underline flex items-center gap-1'
              >
                <RotateCcw className='h-4 w-4' />
                Reset
              </Button>
            </div>

            <Input
              placeholder='What are you looking for?'
              value={state.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />

            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Listing Status
              </div>
              <div className='space-y-2'>
                {['All', 'Buy', 'Rent'].map((option) => (
                  <label
                    key={option}
                    className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
                  >
                    <input
                      type='radio'
                      name='listingStatus'
                      checked={state.listingStatus === option}
                      onChange={() => handleChange('listingStatus', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Property Type
              </div>
              <div className='space-y-2'>
                {['Houses', 'Apartments'].map((option) => (
                  <label
                    key={option}
                    className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      checked={state.propertyType.includes(option)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...state.propertyType, option]
                          : state.propertyType.filter((t) => t !== option);
                        handleChange('propertyType', updated);
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Price Range
              </div>

              {/* Labels row */}
              <div className='flex justify-between text-xs text-gray-500 mb-3 px-1'>
                <span>0</span>
                <span>1Cr</span>
                <span>2Cr</span>
                <span>3Cr</span>
                <span>4Cr</span>
                <span>5Cr+</span>
              </div>

              {/* Slider with two thumbs for range selection */}
              <Slider
                max={50000000}
                step={10000000}
                value={state.priceRange} // Use state.priceRange which is already an array [min, max]
                onValueChange={(value) => {
                  // Update the priceRange array in your state
                  handleChange('priceRange', value);
                  // Also update individual minPrice and maxPrice for consistency
                  handleChange('minPrice', value[0]);
                  handleChange('maxPrice', value[1]);
                }}
              />

              <div className='flex gap-3 mt-4'>
                <Input
                  type='number'
                  placeholder='Min.'
                  value={state.minPrice}
                  onChange={(e) => {
                    const newMin = Number(e.target.value) || 0;
                    const newMax = Math.max(newMin, state.priceRange[1]); // Ensure max is at least equal to min
                    handleChange('minPrice', newMin);
                    handleChange('priceRange', [newMin, newMax]);
                    handleChange('maxPrice', newMax);
                  }}
                />
                <span className='flex items-center'>-</span>
                <Input
                  type='number'
                  placeholder='Max.'
                  value={state.maxPrice}
                  onChange={(e) => {
                    const newMax = Number(e.target.value) || 0;
                    const newMin = Math.min(newMax, state.priceRange[0]); // Ensure min doesn't exceed max
                    handleChange('maxPrice', newMax);
                    handleChange('priceRange', [newMin, newMax]);
                    handleChange('minPrice', newMin);
                  }}
                />
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Bedrooms</div>

              <div className='flex flex-wrap gap-2'>
                {['Any', '2+', '3+', '4+', '5+'].map((option) => (
                  <label key={option}>
                    <input
                      type='radio'
                      name='bedrooms'
                      checked={state.bedrooms === option}
                      onChange={() => handleChange('bedrooms', option)}
                      className='peer hidden'
                    />
                    <span className='flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:border-red-400 peer-checked:border-red-500'>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Bathrooms</div>
              <div className='flex flex-wrap gap-2'>
                {['Any', '2+', '3+', '4+', '5+'].map((option) => (
                  <label key={option}>
                    <input
                      type='radio'
                      name='bathrooms'
                      checked={state.bathrooms === option}
                      onChange={() => handleChange('bathrooms', option)}
                      className='peer hidden'
                    />
                    <span className='flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700 hover:border-red-400 peer-checked:border-red-500'>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Location</div>
              <Select onValueChange={(val) => handleChange('location', val)}>
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

            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Square Feet
              </div>
              <div className='flex gap-3'>
                <Input
                  type='number'
                  placeholder='Min.'
                  value={state.sqftMin}
                  onChange={(e) => handleChange('sqftMin', e.target.value)}
                />
                <span className='flex items-center'>-</span>
                <Input
                  type='number'
                  placeholder='Max.'
                  value={state.sqftMax}
                  onChange={(e) => handleChange('sqftMax', e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Year Built</div>
              <div className='flex gap-3'>
                <Input
                  type='number'
                  placeholder=''
                  value={state.yearBuiltMin}
                  onChange={(e) => handleChange('yearBuiltMin', e.target.value)}
                />
                <Input
                  type='number'
                  placeholder=''
                  value={state.yearBuiltMax}
                  onChange={(e) => handleChange('yearBuiltMax', e.target.value)}
                />
              </div>
            </div>
          </div>
        </aside>

        <section className='lg:col-span-3 space-y-6'>
          <div className='flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 border-none rounded-lg border shadow-sm'>
            <span className='text-sm text-gray-600'></span>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-600 whitespace-nowrap'>
                  Sort by:
                </span>
                <Select defaultValue='newest'>
                  <SelectTrigger className=' border-0 shadow-none focus:ring-0 p-0 h-auto text-sm font-medium text-gray-900'>
                    <SelectValue placeholder='Newest' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='newest'>Newest</SelectItem>
                    <SelectItem value='price-low'>
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value='price-high'>
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value='popular'>Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center gap-0 rounded-lg overflow-hidden border'>
                <Button
                  onClick={() => setState({ view: 'grid' })}
                  variant='ghost'
                  className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                    state.view === 'grid'
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  Grid
                </Button>
                <div className='h-4 w-px bg-gray-300'></div>
                <Button
                  onClick={() => setState({ view: 'list' })}
                  variant='ghost'
                  className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                    state.view === 'list'
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Properties */}
          {loading ? (
            <div
            className={
              state.view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-6"
            }
          >
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <PropertyCardSkeleton
                key={`skeleton-${index}`}
                view={state.view}
              />
            ))}
          </div>
          ) : properties?.length == 0 ? (
            <div className='flex justify-center items-center w-full pt-40'>
              <div>No Property Found</div>
            </div>
          ) : (
            <>
              <div
                className={
                  state.view === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-6'
                }
              >
                {properties.map((property: any, index: number) => (
                  <div
                    key={index}
                    ref={
                      index === properties.length - 1
                        ? lastPropertyElementRef
                        : null
                    }
                  >
                    <PropertyCard property={property} view={state.view} />
                  </div>
                ))}
              </div>

              {isLoadingMore && (
                <div
                  className={
                    state.view === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'flex flex-col gap-6'
                  }
                >
                  {Array.from({ length: skeletonCount }).map((_, index) => (
                    <PropertyCardSkeleton
                      key={`skeleton-${index}`}
                      view={state.view}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <Modal
        isOpen={state.isOpen}
        setIsOpen={() => setState({ isOpen: false })}
        title='More Filter'
        width='700px'
        renderComponent={() => <div>...same filter options...</div>}
      />
    </motion.div>
  );
}
