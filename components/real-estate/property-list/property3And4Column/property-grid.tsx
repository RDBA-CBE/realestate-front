import { PropertyCard } from './property-card';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Search as SearchIcon,
  Grid3X3,
  List,
} from 'lucide-react';
import FilterDropdown from '../../FilterDropdown.component';
import Modal from '@/components/common-components/modal';
import { useSetState } from '@/utils/function.utils';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export function PropertyGrid(props: any) {
  const { properties, title = 'New York Homes for Sale' } = props;

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [col, setCol] = useState(4);

  const [state, setState] = useSetState({
    isOpen: false,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='max-w-6xl mx-auto space-y-8 p-6'
    >
      {/* Breadcrumb */}
      {/* <div className='text-sm text-gray-600 mb-2'>Home / For Rent</div> */}

      <h1 className='text-3xl font-bold mb-6'>{title}</h1>

      {/* Top Filter Bar - Updated to match screenshot exactly */}
      <div className='flex flex-wrap items-center justify-between gap-4 mb-6 rounded-lg'>
        {/* Left side - Filters */}
        <div className='flex items-center gap-4 flex-wrap'>
          <FilterDropdown
            title='For Sale'
            subtitle='Listing Status'
            type='radio'
            options={['All', 'Buy', 'Rent']}
            onChange={(val) => console.log('Selected:', val)}
          />

          <FilterDropdown
            title='Property Type'
            subtitle='Select Options'
            type='checkbox'
            options={['All', 'Villa', 'Office']}
            onChange={(val) => console.log('Checked:', val)}
          />

          <FilterDropdown
            title='Price'
            subtitle='Price Range'
            type='range'
            onChange={(val) => console.log('Range:', val)}
          />

          <FilterDropdown
            title='Beds / Baths'
            subtitle='Bedroom & Bathroom'
            type='radio'
            options={['Any', '1+', '2+', '3+', '4+']}
            onChange={(val) => console.log('Selected:', val)}
          />

          <Button
            onClick={() => setState({ isOpen: true })}
            variant='outline'
            className='rounded-full text-gray-800 px-4 py-2 border shadow-sm hover:bg-gray-50 flex items-center gap-2'
          >
            <SlidersHorizontal className='h-4 w-4' /> More Filter
          </Button>
        </div>

        {/* Right side */}
        <div className='flex items-center gap-6'>
          {/* Sort section */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600 whitespace-nowrap'>
              Sort by
            </span>
            <Select defaultValue='newest'>
              <SelectTrigger className='w-[130px] border-0 shadow-none focus:ring-0 p-0 h-auto text-sm font-medium'>
                <SelectValue placeholder='Newest' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='newest'>Newest</SelectItem>
                <SelectItem value='price-low'>Price: Low to High</SelectItem>
                <SelectItem value='price-high'>Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid/List Toggle */}
          <div className='flex items-center gap-0 rounded-md overflow-hidden'>
            <Button
              onClick={() => setView('grid')}
              variant='ghost'
              className={`px-4 py-2 h-9 rounded-none text-sm font-medium ${
                view === 'grid'
                  ? 'text-red-600 bg-transparent'
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
                  ? 'text-red-600 bg-transparent'
                  : 'text-gray-600 hover:text-red-500'
              }`}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div
        className={
          view === 'grid'
            ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
            : 'flex flex-col gap-6'
        }
      >
        {properties.map((property: any) => (
          <PropertyCard key={property.id} property={property} view={view} />
        ))}
      </div>

      <Modal
        isOpen={state.isOpen}
        setIsOpen={() => setState({ isOpen: false })}
        title='More Filter'
        width='700px'
        renderComponent={() => (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto overflow-x-hidden px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* Price Range */}
            <div>
              <div className='mb-2 font-semibold text-gray-900'>
                Price Range
              </div>
              <Slider
                defaultValue={[20, 70987]}
                max={100000}
                step={1}
                className='mb-4'
              />
              <div className='flex gap-3'>
                <Input defaultValue='$20' className='border rounded-md' />
                <span className='flex items-center'>-</span>
                <Input defaultValue='$70987' className='border rounded-md' />
              </div>
            </div>

            {/* Type & Property ID */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='mb-2 font-semibold text-gray-900'>Type</div>
                <Select>
                  <SelectTrigger className='border rounded-md'>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='office'>Office</SelectItem>
                    <SelectItem value='house'>House</SelectItem>
                    <SelectItem value='apartment'>Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className='mb-2 font-semibold text-gray-900'>
                  Property ID
                </div>
                <Input
                  defaultValue='RT04949213'
                  className='border rounded-md'
                />
              </div>
            </div>

            {/* Bedrooms & Bathrooms */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='mb-2 font-semibold text-gray-900'>Bedrooms</div>
                <div className='flex gap-2 mt-2'>
                  {['any', '1+', '2+', '3+', '4+'].map((label) => (
                    <Button
                      key={label}
                      variant='outline'
                      className='border rounded-md'
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className='mb-2 font-semibold text-gray-900'>
                  Bathrooms
                </div>
                <div className='flex gap-2 mt-2'>
                  {['any', '1+', '2+', '3+', '4+'].map((label) => (
                    <Button
                      key={label}
                      variant='outline'
                      className='border rounded-md'
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Location & Square Feet */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <div className='mb-2 font-semibold text-gray-900'>Location</div>
                <Select>
                  <SelectTrigger className='border rounded-md'>
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
                  <Input placeholder='Min.' className='border rounded-md' />
                  <span className='flex items-center'>-</span>
                  <Input placeholder='Max' className='border rounded-md' />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <div className='mb-2 font-semibold text-gray-900'>Amenities</div>
              <div className='grid grid-cols-3 gap-3'>
                {[
                  'Attic',
                  'Basketball court',
                  'Air Conditioning',
                  'Lawn',
                  'TV Cable',
                  'Dryer',
                  'Outdoor Shower',
                  'Washer',
                  'Lake view',
                ].map((item) => (
                  <label key={item} className='flex items-center gap-2'>
                    <Checkbox className='border rounded' />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer buttons */}
            <div className='flex justify-between items-center pt-4'>
              <Button
                variant='ghost'
                className='text-sm text-gray-500 underline flex items-center'
              >
                <RotateCcw className='h-4 w-4' />
                Reset all filters
              </Button>
              <Button className='bg-[#F35C48] hover:bg-[#d94d3c] flex items-center '>
                <SearchIcon className='h-4 w-4' />
                Search
              </Button>
            </div>
          </div>
        )}
      />
    </motion.div>
  );
}
