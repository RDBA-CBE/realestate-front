import { PropertyCard } from './property-card';
import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RotateCcw, Search as SearchIcon, Loader } from 'lucide-react';
import FilterDropdown from '../../FilterDropdown.component';
import Modal from '@/components/common-components/modal';
import { useSetState } from '@/utils/function.utils';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import useDebounce from '@/components/common-components/useDebounce';
import { PropertyCardSkeleton } from '@/components/common-components/skeleton/PropertyCardSkeleton.componenet';
import PriceRangeSlider from '@/components/common-components/priceRange';
import { FURNISHING_TYPE } from '@/utils/constant.utils';
import { TextInput } from '@/components/common-components/textInput';

export function PropertyView(props: any) {
  const {
    properties,
    title = 'List View',
    filters,
    loading,
    isLoadingMore,
    handNext,
    loadMore,
    categoryList,
    minPrice,
    maxPrice,
  } = props;

  const [state, setState] = useSetState({
    isOpen: false,
    search: '',
    listingStatus: '',
    propertyType: [],
    furnishing: [],
    priceRange: [0, 0],
    minPrice: 0,
    maxPrice: 0,
    bedrooms: '',
    bathrooms: '',
    location: '',
    sqftMin: '',
    sqftMax: '',
    yearBuiltMin: '',
    yearBuiltMax: '',
    view: 'grid',
    sort: null,
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

  useEffect(() => {
    setState({ minPrice, maxPrice, priceRange: [minPrice, maxPrice] });
  }, [minPrice, maxPrice]);

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
    state.furnishing,
    debouncedState.search,
    debouncedState.priceRange,
    debouncedState.minPrice,
    debouncedState.maxPrice,
    debouncedState.sqftMin,
    debouncedState.sqftMax,
    debouncedState.yearBuiltMin,
    debouncedState.yearBuiltMax,
    state.sort,
  ]);

  const handleChange = (name, value) => {
    setState({ [name]: value });
  };

  const resetFilter = () => {
    setState({
      search: '',
      listingStatus: '',
      propertyType: [],
      priceRange: [minPrice, maxPrice],
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

  const formatINR = (value: number) => {
    if (isNaN(value)) return '';
    return value.toLocaleString('en-IN');
  };

  const parseINR = (value: string) => {
    return Number(value.replace(/,/g, ''));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='xl:max-w-[110rem] max-w-[85rem] mx-auto p-6'
    >
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8 items-start min-h-screen'>
        <aside className='space-y-6 lg:col-span-1 sticky top-16 h-fit'>
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

            <TextInput
              placeholder='What are you looking for?'
              value={state.search}
              onChange={(e) => handleChange('search', e.target.value)}
            />

            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Listing Status
              </div>
              <div className='space-y-2'>
                {['All', 'Sale', 'Rent', 'Lease'].map((option) => (
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
                {categoryList?.map((option) => (
                  <label
                    key={option?.value}
                    className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      className='cursor-pointer'
                      checked={state.propertyType.some(
                        (t) => t.value === option.value
                      )}
                      onChange={(e) => {
                        let updated;
                        if (e.target.checked) {
                          // ✅ Allow only one selected option
                          updated = [option];
                        } else {
                          // ✅ Uncheck all if the same option is clicked again
                          updated = [];
                        }
                        handleChange('propertyType', updated);
                      }}
                    />
                    <span>{option?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <PriceRangeSlider
                min={0}
                max={50000000}
                value={state.priceRange}
                onChange={(val) => {
                  setState({ priceRange: val });
                  handleChange('minPrice', val[0]);
                  handleChange('maxPrice', val[1]);
                }}
              />

              <div className='flex gap-3 mt-4 items-center'>
                {/* Min Input */}
                <div className='relative w-full'>
                  <span className='absolute left-3 top-2 text-gray-600'>₹</span>
                  <Input
                    type='text'
                    className='pl-6 pr-0'
                    placeholder='Min.'
                    value={formatINR(state.priceRange?.[0] ?? 0)}
                    onChange={(e) => {
                      const newMin = parseINR(e.target.value);
                      const newMax = Math.max(
                        newMin,
                        state.priceRange?.[1] ?? 0
                      );
                      const updated = [newMin, newMax];
                      handleChange('priceRange', updated);
                      setState({ priceRange: updated });
                    }}
                  />
                </div>

                <span className='flex items-center'>-</span>

                {/* Max Input */}
                <div className='relative w-full'>
                  <span className='absolute left-3 top-2 text-gray-600'>₹</span>
                  <Input
                    type='text'
                    className='pl-6 pr-0'
                    placeholder='Max.'
                    value={formatINR(state.priceRange?.[1] ?? 0)}
                    onChange={(e) => {
                      const newMax = parseINR(e.target.value);
                      const newMin = Math.min(
                        newMax,
                        state.priceRange?.[0] ?? 0
                      );
                      const updated = [newMin, newMax];
                      handleChange('priceRange', updated);
                      setState({ priceRange: updated });
                    }}
                  />
                </div>
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
              <div className='mb-2 font-semibold text-gray-900'>Furnishing</div>
              <div className='space-y-2'>
                {FURNISHING_TYPE?.map((option) => (
                  <label
                    key={option?.value}
                    className='flex items-center gap-2 text-sm text-gray-700 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      className='cursor-pointer'
                      checked={state.furnishing.some(
                        (t) => t.value === option.value
                      )}
                      onChange={(e) => {
                        let updated;
                        if (e.target.checked) {
                          // ✅ Allow only one selected option
                          updated = [option];
                        } else {
                          // ✅ Uncheck all if the same option is clicked again
                          updated = [];
                        }
                        handleChange('furnishing', updated);
                      }}
                    />
                    <span>{option?.label}</span>
                  </label>
                ))}
              </div>
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
          <div className='sticky top-16 z-10'>
            <div className='flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-100 border-none rounded-lg border shadow-sm'>
              <div className='flex items-center gap-4'>
                <Link href='/property-listmv' className='no-underline'>
                  <Button
                    variant='ghost'
                    className='px-4 py-2 h-9 rounded-lg text-sm font-medium text-gray-600 hover:text-red-500 border border-gray-300 hover:border-red-200'
                  >
                    Map View
                  </Button>
                </Link>
                <span className='text-sm text-gray-600'></span>
              </div>

              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-600 whitespace-nowrap'>
                    Sort by:
                  </span>
                  <Select
                    defaultValue='default'
                    onValueChange={(value) => {
                      let sortValue = 'new'; // default
                      switch (value) {
                        case 'price-low':
                          sortValue = 'price';
                          break;
                        case 'price-high':
                          sortValue = '-price';
                          break;
                        case 'default':
                          sortValue = '';
                          break;
                        case 'newest':
                          sortValue = 'created_at';
                          break;
                      }
                      handleChange('sort', sortValue);
                    }}
                  >
                    <SelectTrigger className='border-0 shadow-none focus:ring-0 p-0 h-auto text-sm font-medium text-gray-900'>
                      <SelectValue placeholder='Newest' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='default'>Default</SelectItem>
                      <SelectItem value='newest'>Newest</SelectItem>

                      <SelectItem value='price-low'>
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value='price-high'>
                        Price: High to Low
                      </SelectItem>
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
          </div>

          {loading ? (
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
                  row={3}
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
                {properties?.map((property: any, index: number) => (
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
                      row={1}
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
