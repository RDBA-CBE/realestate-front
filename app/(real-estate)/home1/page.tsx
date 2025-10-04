'use client';

import { motion } from 'framer-motion';
// import Header from '@/components/common-components/Header';
import BannerSection from '@/components/common-components/HeroSection';
import ApartmentTypes from '@/components/common-components/ApartmentTypes';
import HowItWorks from '@/components/common-components/HowItWorks';
import FeaturedListings from '@/components/common-components/FeaturedListings';
import PropertiesByCities from '@/components/common-components/PropertiesByCities';
import SellingOptions from '@/components/common-components/SellingOptions';
import PopularProperties from '@/components/common-components/PopularProperties';
import Testimonials from '@/components/common-components/Testimonials';
import BlogSection from '@/components/common-components/BlogSection';
import Footer from '@/components/common-components/Footer';

// ---------------- PAGE ----------------
export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header + Gallery */}
        {/* <Header /> */}
        <BannerSection />
        
        <div>
          <ApartmentTypes />
          <HowItWorks />
          <FeaturedListings />
          <PropertiesByCities />
          <SellingOptions />
          <PopularProperties />
          <Testimonials />
          <BlogSection />
        </div>
        
        <Footer />
      </motion.div>
    </div>
  );
}