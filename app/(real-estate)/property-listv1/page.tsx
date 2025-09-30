'use client';
import { PropertyView } from '@/components/real-estate/property-list/property3And4Column/property-view';

export default function Page() {
  const mockProperties = [
    {
      id: '1',
      title: 'Equestrian Family Home',
      location: 'San Diego City, CA, USA',
      price: 14000,
      priceType: 'rent',
      bedrooms: 5,
      bathrooms: 4,
      squareFeet: 900,
      image: '/assets/images/real-estate/1.png',
      featured: true,
      yearBuilt: 2018,
    },
    {
      id: '2',
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      price: 82000,
      priceType: 'rent',
      bedrooms: 6,
      bathrooms: 4,
      squareFeet: 1200,
      image: '/assets/images/real-estate/2.png',
    },
    {
      id: '3',
      title: 'Modern Downtown Apartment',
      location: 'New York City, NY, USA',
      price: 750000,
      priceType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      image: '/assets/images/real-estate/3.png',
      yearBuilt: 2020,
    },

    {
      id: '4',
      title: 'Modern Downtown Apartment',
      location: 'New York City, NY, USA',
      price: 750000,
      priceType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      image: '/assets/images/real-estate/4.png',
      yearBuilt: 2020,
    },
    {
      id: '5',
      title: 'Modern Downtown Apartment',
      location: 'New York City, NY, USA',
      price: 750000,
      priceType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      image: '/assets/images/real-estate/5.png',
      yearBuilt: 2020,
    },
    {
      id: '6',
      title: 'Modern Downtown Apartment',
      location: 'New York City, NY, USA',
      price: 750000,
      priceType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      image: '/assets/images/real-estate/6.png',
      yearBuilt: 2020,
    },
    {
      id: '7',
      title: 'Modern Downtown Apartment',
      location: 'New York City, NY, USA',
      price: 750000,
      priceType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      image: '/assets/images/real-estate/7.png',
      yearBuilt: 2020,
    },
    {
      id: '8',
      title: 'Modern Downtown Apartment',
      location: 'New York City, NY, USA',
      price: 750000,
      priceType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1200,
      image: '/assets/images/real-estate/8.png',
      yearBuilt: 2020,
    },
  ];

  return (
    <div>
      <PropertyView
        properties={mockProperties}
        title='New York Homes for Sale'
        // showFilters={true}
      />
    </div>
  );
}
