import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  capitalizeFLetter,
  formatNumber,
  formattedNoDecimal,
  formatToINR,
} from '@/utils/function.utils';

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
}

interface PropertyCardProps {
  property: Property;
  view: 'grid' | 'list';
}

export function PropertyCard({ property, view }: PropertyCardProps) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`property-detail/${property?.id}`)}
      className={`overflow-hidden p-3 border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
        view === 'list' ? 'flex flex-row h-48' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${view === 'list' ? 'w-2/5' : ''}`}>
        {property?.primary_image && (
          // <Image
          //   src={
          //     property?.primary_image
          //   }
          //   alt={"property"}
          //   width={400}
          //   height={280}
          //   className={`object-cover ${
          //     view === "list" ? "h-full w-full" : "w-full h-40"
          //   }`}
          // />
          <Image
            src={property?.primary_image}
            alt={'property'}
            width={400}
            height={280}
            className={`object-cover rounded-lg ${
              view === 'list' ? 'h-full w-full' : 'w-full h-40'
            }`}
          />
        )}
        {property.featured && (
          <Badge className='absolute top-2 left-2 bg-red-500 text-white font-semibold px-2 py-0.5 text-xs'>
            FEATURED
          </Badge>
        )}

        <Badge className='absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md'>
          {formatToINR(property.price)}{' '}
          {property.listing_type === 'rent' && '/ mo'}
        </Badge>
      </div>

      {/* Content */}
      <CardContent
        className={`flex flex-col justify-between ${
          view === 'list' ? 'w-3/5' : 'pt-4'
        }`}
      >
        <div>
          <h3
            className={`font-bold text-gray-900 ${
              view === 'list' ? 'text-lg mb-1' : 'text-xl mb-2'
            }`}
          >
            {property.title}
          </h3>
          <div className='flex items-center text-gray-600 mb-2'>
            <MapPin className='h-4 w-4 mr-1' />
            {/* <span className="text-sm">{`${property.city} , ${property.state} , ${property.country}`}</span> */}
            <span className='text-sm'>{`${capitalizeFLetter(
              property.city
            )} , ${capitalizeFLetter(property.state)} `}</span>
          </div>

          <div className='flex items-center gap-4 text-gray-700 mb-2'>
            <div className='flex items-center space-x-1'>
              <Bed className='h-4 w-4' />
              <span className='text-xs'>{property.bedrooms} bed</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Bath className='h-4 w-4' />
              <span className='text-xs'>{property.bathrooms} bath</span>
            </div>
            <div className='flex items-center space-x-1'>
              <Square className='h-4 w-4' />
              <span className='text-xs'>
                {formattedNoDecimal(property.total_area)} sqft
              </span>
            </div>
          </div>
        </div>

        {/* <div className='mt-auto'>
          <Badge
            variant='outline'
            className='border-blue-600 text-blue-600 px-3 py-1 text-xs font-semibold'
          >
            {property.listing_type === 'rent'
              ? 'FOR RENT'
              : property.listing_type === 'sale'
              ? 'FOR SALE'
              : 'FOR LEASE'}
          </Badge>
        </div> */}
      </CardContent>
    </Card>
  );
}
