import { PropertyCard } from './property-card';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  SlidersHorizontal,
  RotateCcw,
  Search as SearchIcon,
} from 'lucide-react';
import FilterDropdown from '../../FilterDropdown.component';
import Modal from '@/components/common-components/modal';
import { useSetState } from '@/utils/function.utils';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export function PropertyView(props: any) {
  const { properties, title = 'List View' } = props;

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [state, setState] = useSetState({ isOpen: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='max-w-7xl mx-auto p-6'
    >
      {/* Breadcrumb */}
      {/* <div className='text-sm text-gray-600 mb-2'>Find your home</div> */}

      {/* <h1 className='text-3xl font-bold mb-6'>{title}</h1> */}

      {/* Main layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
        {/* Sidebar filters */}
        <aside className='space-y-6 lg:col-span-1'>
          <div className='p-4 border rounded-lg space-y-6 bg-white'>
            <div className='font-semibold text-gray-900'>Find your home</div>

            <Input placeholder='What are you looking for?' />

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
                      name='listing-status'
                      value={option}
                      className='h-4 w-4 border-gray-300 text-red-500 focus:ring-red-500'
                      onChange={(e) => console.log('Selected:', e.target.value)}
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
                      value={option}
                      className='h-4 w-4 border-gray-300 text-red-500 focus:ring-red-500'
                      onChange={(e) =>
                        console.log(
                          e.target.checked
                            ? `Checked: ${option}`
                            : `Unchecked: ${option}`
                        )
                      }
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
              <Slider max={6000000} step={1000} />
              <div className='flex gap-3 mt-2'>
                <Input placeholder='Min.' />
                <span className='flex items-center'>-</span>
                <Input placeholder='Max' />
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Bedrooms</div>

              <div className='flex flex-wrap gap-2'>
                {['Any', '2+', '3+', '4+', '5+'].map((option) => (
                  <label key={option} className='cursor-pointer'>
                    <input
                      type='radio'
                      name='bedrooms'
                      value={option}
                      className='peer hidden'
                      onChange={(e) => console.log('Selected:', e.target.value)}
                    />
                    <span
                      className='flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700
                         hover:border-red-400
                         peer-checked:border-red-500'
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Bathrooms</div>
              <div className='flex flex-wrap gap-2'>
                {['Any', '1+', '2+', '3+', '4+', '5+'].map((option) => (
                  <label key={option} className='cursor-pointer'>
                    <input
                      type='radio'
                      name='bathrooms'
                      value={option}
                      className='peer hidden'
                      onChange={(e) => console.log('Selected:', e.target.value)}
                    />
                    <span
                      className='flex items-center justify-center px-3 py-1.5 border rounded-md text-sm text-gray-700
                         hover:border-red-400
                         peer-checked:border-red-500'
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Location</div>
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

            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Square Feet
              </div>
              <div className='flex gap-3'>
                <Input placeholder='Min.' />
                <span className='flex items-center'>-</span>
                <Input placeholder='Max' />
              </div>
            </div>

            <div>
              <div className='mb-2 font-semibold text-gray-900'>Year Built</div>
              <div className='flex gap-3'>
                <Input />
                <Input />
              </div>
            </div>

            <Button className='w-full bg-[#F35C48] hover:bg-[#d94d3c] flex items-center justify-center gap-2'>
              <SearchIcon className='h-4 w-4' /> Search
            </Button>
            <Button
              variant='ghost'
              className='w-full text-sm text-gray-500 underline flex items-center justify-center'
            >
              <RotateCcw className='h-4 w-4 mr-1' />
              Reset all filters
            </Button>
          </div>
        </aside>

        {/* Properties section */}
        <section className='lg:col-span-3 space-y-6'>
          {/* Top bar */}
          <div className='flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border shadow-sm'>
            <span className='text-sm text-gray-600'>
              {/* Showing 1-8 of 25 results */}
            </span>
            <div className='flex items-center gap-4'>
              {/* Sort */}
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

              {/* Grid/List toggle */}
              <div className='flex items-center gap-0 rounded-lg overflow-hidden border'>
                <Button
                  onClick={() => setView('grid')}
                  variant='ghost'
                  className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                    view === 'grid'
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  Grid
                </Button>
                <div className='h-4 w-px bg-gray-300'></div>
                <Button
                  onClick={() => setView('list')}
                  variant='ghost'
                  className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                    view === 'list'
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  List
                </Button>
              </div>

              {/* Advanced Filter Button */}
              <Button
                variant='outline'
                onClick={() => setState({ isOpen: true })}
                className='flex items-center gap-2 border-gray-300'
              >
                <SlidersHorizontal className='h-4 w-4' />
                More Filter
              </Button>
            </div>
          </div>

          {/* Properties */}
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'flex flex-col gap-6'
            }
          >
            {properties.map((property: any) => (
              <PropertyCard key={property.id} property={property} view={view} />
            ))}
          </div>

          {/* Pagination */}
          {/* <div className='flex justify-center items-center gap-2 pt-8'>
            <Button variant='outline' className='h-10 px-4 rounded-lg' disabled>
              Previous
            </Button>
            <Button className='h-10 w-10 rounded-lg bg-red-500 hover:bg-red-600 text-white'>
              1
            </Button>
            <Button variant='outline' className='h-10 w-10 rounded-lg'>
              2
            </Button>
            <Button variant='outline' className='h-10 w-10 rounded-lg'>
              3
            </Button>
            <span className='h-10 w-10 flex items-center justify-center text-gray-500'>
              ...
            </span>
            <Button variant='outline' className='h-10 w-10 rounded-lg'>
              8
            </Button>
            <Button variant='outline' className='h-10 px-4 rounded-lg'>
              Next
            </Button>
          </div> */}
        </section>
      </div>

      {/* More Filter Modal (mobile) */}
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
