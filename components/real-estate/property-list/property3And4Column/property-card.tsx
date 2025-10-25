'use client';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Share,
  GitCompareArrowsIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  capitalizeFLetter,
  Failure,
  formatPriceRange,
  formattedNoDecimal,
  formatToINR,
  Success,
  useSetState,
} from '@/utils/function.utils';
import Models from '@/imports/models.import';

interface PropertyImage {
  id: number;
  image_url: string;
  is_primary: boolean;
  order: number;
}

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  listing_type: 'rent' | 'sale' | 'lease';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  primary_image: string;
  featured?: boolean;
  total_area: string;
  state: string;
  city: string;
  country: string;
  is_compare: string;
  user_wishlists: boolean;
  images?: PropertyImage[];
  price_range?: any;
  // Add the new optional fields
  plot_sizes?: Array<{
    size: string;
    price: string;
  }>;
  developer_name?: string;
  broker_name?: string;
}

interface PropertyCardProps {
  property: Property;
  view: 'grid' | 'list';
  updateList?: any;
  list?: any;
  handleClick?: any;
}

// Add helper functions
const getGridColumnsClass = (count: number): string => {
  if (count <= 2) return 'grid-cols-2';
  if (count <= 3) return 'grid-cols-3';
  if (count <= 4) return 'grid-cols-4';
  if (count <= 5) return 'grid-cols-5';
  return 'grid-cols-6';
};

const getInitials = (name: string): string => {
  if (!name) return 'P';
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Consistent image dimensions
const GRID_IMAGE_HEIGHT = 180;
const LIST_IMAGE_HEIGHT = 210;

export function PropertyCard({
  property,
  view,
  list,
  updateList,
  handleClick,
}: PropertyCardProps) {
  const router = useRouter();
  const [hover, setHover] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [state, setState] = useSetState({
    is_compare: false,
    is_liked: false,
  });

  // Get all images for the slider
  const allImages = property?.images || [];
  const displayImages =
    allImages.length > 0
      ? allImages
      : [
          {
            id: 0,
            image_url: property.primary_image,
            is_primary: true,
            order: 0,
          },
        ];

  // Auto-slide functionality
  useEffect(() => {
    if (hover && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) =>
          prev === displayImages.length - 1 ? 0 : prev + 1
        );
      }, 3000); // 3 sec interval
      return () => clearInterval(interval);
    }
  }, [hover, displayImages.length]);

  const handleIconClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) handleWishList();
    else if (index === 1) handleCompareList();
    else handleShare();
  };

  const handleWishList = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token)
        return Failure('Please log in to add properties to your wishlist!');

      if (!property?.user_wishlists) {
        await Models.wishlist.add_property({ property_id: property?.id });
        const updatedLists = list.map((item: Property) =>
          item.id === property.id ? { ...item, user_wishlists: true } : item
        );
        updateList(updatedLists);
        Success('Added to your wishlist!');
      } else {
        await Models.wishlist.remove_property({ property_id: property?.id });
        const updatedLists = list.map((item: Property) =>
          item.id === property.id ? { ...item, user_wishlists: false } : item
        );
        updateList(updatedLists);
        Success('Removed from your wishlist!');
      }
    } catch (error) {
      console.log('✌️error --->', error);
    }
  };

  const handleCompareList = () => {
    try {
      const propertyId = property?.id;
      const compareList = JSON.parse(localStorage.getItem('compare') || '[]');

      let updatedList = [];
      if (compareList.includes(propertyId)) {
        updatedList = compareList.filter((id: string) => id !== propertyId);
        Success('Removed from compare list!');
      } else {
        updatedList = [...compareList, propertyId];
        Success('Added to compare list!');
      }

      localStorage.setItem('compare', JSON.stringify(updatedList));
      setState({ is_compare: updatedList.includes(propertyId) });
    } catch (error) {
      console.log('✌️error --->', error);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        Success('Link copied to clipboard!');
      }
    } catch (error) {
      console.log('✌️error --->', error);
    }
  };

  // Next / Prev button handlers
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const onClick = () => {
    if (handleClick) {
      handleClick();
    } else {
      router.push(`property-detail/${property?.id}`);
    }
  };

  // GRID VIEW
  if (view === 'grid') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className='h-full'
      >
        <Card
          onClick={() => onClick()}
          className='bg-gray-100 border-none overflow-hidden p-3 border shadow-sm hover:shadow-lg cursor-pointer h-full flex flex-col'
        >
          {/* Image Slider - Fixed Height */}
          <div className='relative'>
            <div
              className='relative overflow-hidden rounded-lg'
              style={{ height: GRID_IMAGE_HEIGHT }}
            >
              {displayImages.length > 0 && (
                <motion.div
                  key={displayImages[currentImageIndex]?.image_url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className='w-full h-full'
                >
                  <Image
                    src={displayImages[currentImageIndex]?.image_url}
                    alt={property.title}
                    width={400}
                    height={GRID_IMAGE_HEIGHT}
                    className='object-cover w-full h-full transition-opacity duration-500'
                  />
                </motion.div>
              )}

              {/* Left Arrow */}
              {displayImages.length > 1 && (
                <button
                  onClick={handlePrev}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition'
                >
                  <ChevronLeft size={18} />
                </button>
              )}

              {/* Right Arrow */}
              {displayImages.length > 1 && (
                <button
                  onClick={handleNext}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition'
                >
                  <ChevronRight size={18} />
                </button>
              )}

              {/* Image Dots */}
              {displayImages.length > 1 && (
                <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5'>
                  {displayImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Listing Type Badge */}
              <Badge
                className={`absolute top-3 left-3 text-white font-semibold capitalize border-none rounded-full px-4 py-1.5 ${
                  property.listing_type === 'sale'
                    ? 'bg-green-500'
                    : property.listing_type === 'lease'
                    ? 'bg-blue-500'
                    : property.listing_type === 'rent'
                    ? 'bg-orange-500'
                    : 'bg-gray-500'
                }`}
              >
                For {property.listing_type}
              </Badge>

              {/* Action Buttons */}
              {hover && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className='absolute bottom-2 right-2 flex gap-2'
                >
                  {[Heart, GitCompareArrowsIcon, Share].map((Icon, i) => {
                    const isCompareIcon = Icon === GitCompareArrowsIcon;
                    const like = Icon === Heart;

                    return (
                      <button
                        key={i}
                        className={`rounded-full p-2 shadow hover:bg-gray-100 transition-colors ${
                          isCompareIcon
                            ? state.is_compare || property?.is_compare
                              ? 'bg-green-500 text-white'
                              : 'bg-white text-black'
                            : like
                            ? property?.user_wishlists
                              ? 'bg-red-500 text-white'
                              : 'bg-white text-black'
                            : 'bg-white text-black'
                        }`}
                        onClick={(e) => handleIconClick(i, e)}
                      >
                        <Icon size={16} />
                      </button>
                    );
                  })}
                </motion.div>
              )}

              {/* Price Badge */}
              <Badge className='absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md'>
                {formatPriceRange(
                  property?.price_range?.minimum_price,
                  property?.price_range?.maximum_price
                )}{' '}
                {property.listing_type === 'rent' && '/ mo'}
              </Badge>
            </div>
          </div>

          {/* Property Content */}
          <CardContent className='flex flex-col justify-between mx-2 pt-3 flex-grow'>
            <div>
              <h3 className='text-gray-900 pb-1 text-xl mb-2 line-clamp-2'>
                {property.title}
              </h3>
              <div className='flex items-center text-gray-600 mb-4'>
                <MapPin className='h-5 w-5 mr-1 flex-shrink-0' />
                <span className='text-md line-clamp-1'>{`${capitalizeFLetter(
                  property.city
                )}, ${capitalizeFLetter(property.state)}`}</span>
              </div>

              <div className='flex items-center gap-4 text-gray-500 mb-2 flex-wrap text-md'>
                <div className='flex items-center space-x-1'>
                  <Bed className='h-5 w-5' />
                  <span>{property.bedrooms} bed</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Bath className='h-5 w-5' />
                  <span>{property.bathrooms} bath</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Square className='h-5 w-5' />
                  <span>{formattedNoDecimal(property.total_area)} sqft</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // LIST VIEW
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className='h-full'
    >
      <Card
        onClick={() => onClick()}
        className='bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-row'
      >
        {/* Image Slider - Fixed Height */}
        <div className='relative w-2/5 flex-shrink-0'>
          <div
            className='relative overflow-hidden h-full'
            style={{ height: LIST_IMAGE_HEIGHT }}
          >
            {displayImages.length > 0 && (
              <div
                key={displayImages[currentImageIndex]?.image_url}
                className='w-full h-full absolute'
              >
                <Image
                  src={displayImages[currentImageIndex]?.image_url}
                  alt={property.title}
                  width={400}
                  height={LIST_IMAGE_HEIGHT}
                  className='object-cover w-full h-full'
                />
              </div>
            )}

            {/* Left Arrow */}
            {displayImages.length > 1 && (
              <button
                onClick={handlePrev}
                className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition'
              >
                <ChevronLeft size={16} />
              </button>
            )}

            {/* Right Arrow */}
            {displayImages.length > 1 && (
              <button
                onClick={handleNext}
                className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition'
              >
                <ChevronRight size={16} />
              </button>
            )}

            {/* Image Dots */}
            {displayImages.length > 1 && (
              <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5'>
                {displayImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Listing Type Badge */}
            <Badge
              className={`absolute top-3 left-3 text-white font-semibold capitalize border-none rounded-full px-4 py-1.5 ${
                property.listing_type === 'sale'
                  ? 'bg-green-500'
                  : property.listing_type === 'lease'
                  ? 'bg-blue-500'
                  : property.listing_type === 'rent'
                  ? 'bg-orange-500'
                  : 'bg-gray-500'
              }`}
            >
              For {property.listing_type}
            </Badge>

            {/* Action Buttons */}
            {hover && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className='absolute bottom-3 right-3 flex gap-2'
              >
                {[Heart, GitCompareArrowsIcon, Share].map((Icon, i) => {
                  const isCompareIcon = Icon === GitCompareArrowsIcon;
                  const like = Icon === Heart;

                  return (
                    <button
                      key={i}
                      className={`rounded-full p-2 shadow hover:bg-gray-100 transition-colors ${
                        isCompareIcon
                          ? state.is_compare || property?.is_compare
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-black'
                          : like
                          ? property?.user_wishlists
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-black'
                          : 'bg-white text-black'
                      }`}
                      onClick={(e) => handleIconClick(i, e)}
                    >
                      <Icon size={16} />
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* Price Badge */}
            <Badge className='absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md'>
              {formatPriceRange(
                property?.price_range?.minimum_price,
                property?.price_range?.maximum_price
              )}{' '}
              {property.listing_type === 'rent' && '/ mo'}
            </Badge>
          </div>
        </div>

        {/* Property Content */}
        <CardContent className='flex flex-col flex-grow p-4 w-3/5'>
          <div className='flex flex-col h-full'>
            <div className='flex-grow'>
              <h3 className='text-gray-900 pb-1 text-xl mb-2 line-clamp-2'>
                {property.title}
              </h3>
              <div className='flex items-center text-gray-600 mb-4'>
                <MapPin className='h-5 w-5 mr-1 flex-shrink-0' />
                <span className='text-md line-clamp-1'>{`${capitalizeFLetter(
                  property.city
                )}, ${capitalizeFLetter(property.state)}`}</span>
              </div>

              <div className='flex items-center gap-4 text-gray-500 mb-2 flex-wrap text-md'>
                <div className='flex items-center space-x-1'>
                  <Bed className='h-5 w-5' />
                  <span>{property.bedrooms} bed</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Bath className='h-5 w-5' />
                  <span>{property.bathrooms} bath</span>
                </div>
                <div className='flex items-center space-x-1'>
                  <Square className='h-5 w-5' />
                  <span>{formattedNoDecimal(property.total_area)} sqft</span>
                </div>
              </div>

              {/* Plot Sizes Grid */}
              {property.plot_sizes && property.plot_sizes.length > 0 && (
                <div className='mb-4'>
                  <div
                    className={`grid gap-2 mb-2 ${getGridColumnsClass(
                      property.plot_sizes.length
                    )}`}
                  >
                    {property.plot_sizes.map((plot, index) => (
                      <div
                        key={index}
                        className='text-center text-xs text-gray-600'
                      >
                        {plot.size} sq.ft Plot
                      </div>
                    ))}
                  </div>
                  <div
                    className={`grid gap-2 ${getGridColumnsClass(
                      property.plot_sizes.length
                    )}`}
                  >
                    {property.plot_sizes.map((plot, index) => (
                      <div
                        key={index}
                        className='text-center font-semibold text-gray-900'
                      >
                        {plot.price}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Developer/Broker Info */}
            <div className='flex items-center justify-between pt-3 border-t border-gray-200 mt-4'>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center'>
                  <span className='text-xs font-semibold text-gray-600'>
                    {getInitials(
                      property.developer_name || property.broker_name || ''
                    )}
                  </span>
                </div>
                <div>
                  <div className='text-sm font-semibold text-gray-900'>
                    {property.developer_name ||
                      property.broker_name ||
                      'Property Owner'}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {property.developer_name
                      ? 'Developer'
                      : property.broker_name
                      ? 'Seller'
                      : 'Owner'}
                  </div>
                </div>
              </div>

              <Button
                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm font-medium'
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle contact action
                }}
              >
                Contact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
