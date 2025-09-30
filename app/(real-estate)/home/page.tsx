// "use client";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import React from "react";

// export default function Page() {
//   const router = useRouter();
//   return (
//     <Button
//       className=" bg-red-500 hover:bg-red-600"
//       onClick={() => router.push("/home-data")}
//     >
//       Create account
//     </Button>
//   );
// }

import React from 'react';
import Header from '@/components/common-components/Header1';
import HeroSection from '@/components/common-components/HeroSection';
import ApartmentTypes from '@/components/common-components/ApartmentTypes';
import HowItWorks from '@/components/common-components/HowItWorks';
import FeaturedListings from '@/components/common-components/FeaturedListings';
import PropertiesByCities from '@/components/common-components/PropertiesByCities';
import SellingOptions from '@/components/common-components/SellingOptions';
import PopularProperties from '@/components/common-components/PopularProperties';
import Testimonials from '@/components/common-components/Testimonials';
import BlogSection from '@/components/common-components/BlogSection';
import Footer from '@/components/common-components/Footer';


export default function Page() {
  // const router = useRouter();
  return (
    <div>
      <Header />
      <HeroSection />
      <ApartmentTypes />
      <HowItWorks />
      <FeaturedListings />
      <PropertiesByCities />
      <SellingOptions />
      <PopularProperties />
      <Testimonials />
      <BlogSection />
      <Footer />
    </div>
  );
}

