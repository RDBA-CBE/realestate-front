// "use client";

// import { motion } from "framer-motion";
// import Gallery from "@/components/real-estate/property-detail/Gallery.component";
// import PropertyDetails from "@/components/real-estate/property-detail/PropertyDetails.component";
// import PropertyHeader from "@/components/real-estate/property-detail/PropertyHeader.component";
// import MapSection from "@/components/real-estate/property-detail/MapSection.component";
// import FloorPlans from "@/components/real-estate/property-detail/FloorPlans.component";
// import Amenities from "@/components/real-estate/property-detail/Amenities.component";
// import Reviews from "@/components/real-estate/property-detail/Reviews.component";
// import SimilarListings from "@/components/real-estate/property-detail/SimilarListings.component";
// import PropertyDesc from "@/components/real-estate/property-detail/PropertyDesc.component";
// import Nearby from "@/components/real-estate/property-detail/Nearby.component";
// import WalkScore from "@/components/real-estate/property-detail/Walkscore.component";
// import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";
// import PropertyTabs from "@/components/real-estate/PropertyTabs.component";
// import ImageCarousel from "@/components/real-estate/ImageCarousel.component";
// import Video from "@/components/real-estate/property-detail/Video.component";
// import VirtualTour from "@/components/real-estate/property-detail/VirtualTour.component";

// export default function Home() {
//   const images = [
//     "/assets/images/real-estate/01.png",
//     "/assets/images/real-estate/02.png",
//     "/assets/images/real-estate/03.png",
//     "/assets/images/real-estate/04.png",
//     "/assets/images/real-estate/05.png",
//     "/assets/images/real-estate/6.png",
//     "/assets/images/real-estate/7.png",
//   ];

//   return (
//     <div className="container mx-auto px-9 py-6 space-y-12">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       />

//       {/* Header + Gallery */}
//       <PropertyHeader />
//       {/* <ImageCarousel images={images} /> */}
//       <Gallery images={images} />

//       {/* Sticky Tabs */}
//       <PropertyTabs />

//       {/* Content sections with IDs */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <div id="overview">
//             <PropertyDetails />
//           </div>
//           <div id="desc">
//             <PropertyDesc />
//           </div>

//           <div id="map">
//             <MapSection />
//           </div>

//           <div id="amenities">
//             <Amenities />
//           </div>

//           <div id="floorplans">
//             <FloorPlans />
//           </div>

//           <div id="video">
//             <Video />
//           </div>

//           <div id="virtualtour">
//             <VirtualTour />
//           </div>

//           <div id="nearby">
//             <Nearby />
//           </div>

//           <div id="walkscore">
//             <WalkScore />
//           </div>

//           <div id="reviews">
//             <Reviews />
//           </div>
//         </div>

//         {/* Sticky Contact Form on the right */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-24">
//             <ContactAgentForm />
//           </div>
//         </div>
//       </div>

//       {/* Similar Listings */}
//       <SimilarListings />
//     </div>
//   );
// }
// 'use client';

// import { motion } from 'framer-motion';
// import { useState, useEffect } from 'react';
// import Gallery from '@/components/real-estate/property-detail/Gallery.component';
// import PropertyDetails from '@/components/real-estate/property-detail/PropertyDetails.component';
// import PropertyHeader from '@/components/real-estate/property-detail/PropertyHeader.component';
// import MapSection from '@/components/real-estate/property-detail/MapSection.component';
// import FloorPlans from '@/components/real-estate/property-detail/FloorPlans.component';
// import Amenities from '@/components/real-estate/property-detail/Amenities.component';
// import Reviews from '@/components/real-estate/property-detail/Reviews.component';
// import SimilarListings from '@/components/real-estate/property-detail/SimilarListings.component';
// import PropertyDesc from '@/components/real-estate/property-detail/PropertyDesc.component';
// import Nearby from '@/components/real-estate/property-detail/Nearby.component';
// import WalkScore from '@/components/real-estate/property-detail/Walkscore.component';
// import ContactAgentForm from '@/components/real-estate/property-detail/ContactAgentForm.component';
// import PropertyTabs from '@/components/real-estate/PropertyTabs.component';
// import ImageCarousel from '@/components/real-estate/ImageCarousel.component';
// import Video from '@/components/real-estate/property-detail/Video.component';
// import VirtualTour from '@/components/real-estate/property-detail/VirtualTour.component';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// // ---------------- AUTH HOOK ----------------
// function useAuth() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
//     setIsLoggedIn(loggedIn);
//     setIsLoading(false);
//   }, []);

//   const login = () => {
//     setIsLoggedIn(true);
//     localStorage.setItem('isLoggedIn', 'true');
//   };

//   const logout = () => {
//     setIsLoggedIn(false);
//     localStorage.removeItem('isLoggedIn');
//   };

//   return { isLoggedIn, login, logout, isLoading };
// }

// // ---------------- LOGIN FORM ----------------
// function LoginForm({
//   onSuccess,
//   onClose,
// }: {
//   onSuccess: () => void;
//   onClose: () => void;
// }) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     setTimeout(() => {
//       setIsLoading(false);
//       onSuccess();
//     }, 1000);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <Input id="email" type="email" placeholder="Enter your email" required />
//       </div>
//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <Input
//           id="password"
//           type="password"
//           placeholder="Enter your password"
//           required
//         />
//       </div>
//       <div className="flex gap-2 pt-4">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onClose}
//           className="flex-1"
//         >
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isLoading} className="flex-1">
//           {isLoading ? 'Logging in...' : 'Login'}
//         </Button>
//       </div>
//     </form>
//   );
// }

// // ---------------- CONTACT SECTION ----------------
// function ContactSection() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [showLogin, setShowLogin] = useState(false);
//   const { isLoggedIn, login, isLoading } = useAuth();

//   const handleContactClick = () => {
//     if (!isLoggedIn) {
//       setShowLogin(true);
//       setIsModalOpen(true);
//     } else {
//       setShowLogin(false);
//       setIsModalOpen(true);
//     }
//   };

//   const handleLoginSuccess = () => {
//     login();
//     setShowLogin(false);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setShowLogin(false);
//   };

//   const handleFormSuccess = () => {
//     setIsModalOpen(false);
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <Button disabled className="w-full bg-gray-400 text-white" size="lg">
//           Loading...
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Before login: button */}
//       {!isLoggedIn && (
//         <Button
//           onClick={handleContactClick}
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white"
//           size="lg"
//         >
//           Login to Contact
//         </Button>
//       )}

//       {/* Modal (login or contact form) */}
//       <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>
//               {showLogin ? 'Login to Continue' : 'Contact Agent'}
//             </DialogTitle>
//             <DialogDescription>
//               {showLogin
//                 ? 'Please login to contact the property agent'
//                 : "Fill out the form below and we'll get back to you soon"}
//             </DialogDescription>
//           </DialogHeader>
//           {showLogin ? (
//             <LoginForm
//               onSuccess={handleLoginSuccess}
//               onClose={handleCloseModal}
//             />
//           ) : (
//             <ContactAgentForm onSuccess={handleFormSuccess} />
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* After login: show form directly */}
//       {isLoggedIn && <ContactAgentForm onSuccess={handleFormSuccess} />}
//     </div>
//   );
// }

// // ---------------- PAGE ----------------
// export default function PropertyDetailPage() {
//   const images = [
//     '/assets/images/real-estate/01.png',
//     '/assets/images/real-estate/02.png',
//     '/assets/images/real-estate/03.png',
//     '/assets/images/real-estate/04.png',
//     '/assets/images/real-estate/05.png',
//     '/assets/images/real-estate/6.png',
//     '/assets/images/real-estate/7.png',
//   ];

//   return (
//     <div className="container mx-auto px-9 py-6 space-y-12">
//       <motion.div
//         initial={{ opacity: 0, y: 30 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//       />

//       {/* Header + Gallery */}
//       <PropertyHeader />
//       {/* <ImageCarousel images={images} /> */}
//       <Gallery images={images} />

//       {/* Sticky Tabs */}
//       <div className="py-6">
//         <PropertyTabs />
//       </div>

//       {/* Content sections */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           <div id="overview">
//             <PropertyDetails />
//           </div>
//           <div id="desc">
//             <PropertyDesc />
//           </div>
//           <div id="map">
//             <MapSection />
//           </div>
//           <div id="amenities">
//             <Amenities />
//           </div>
//           <div id="floorplans">
//             <FloorPlans />
//           </div>
//           <div id="video">
//             <Video />
//           </div>
//           <div id="virtualtour">
//             <VirtualTour />
//           </div>
//           <div id="nearby">
//             <Nearby />
//           </div>
//           <div id="walkscore">
//             <WalkScore />
//           </div>
//           <div id="reviews">
//             <Reviews />
//           </div>
//         </div>

//         {/* Sticky Contact Section on the right */}
//         <div className="lg:col-span-1">
//           <div className="sticky top-24">
//             <ContactSection />
//           </div>
//         </div>
//       </div>

//       {/* Similar Listings */}
//       <SimilarListings />
//     </div>
//   );
// }
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Gallery from '@/components/real-estate/property-detail/Gallery.component';
import PropertyDetails from '@/components/real-estate/property-detail/PropertyDetails.component';
import PropertyHeader from '@/components/real-estate/property-detail/PropertyHeader.component';
import MapSection from '@/components/real-estate/property-detail/MapSection.component';
import FloorPlans from '@/components/real-estate/property-detail/FloorPlans.component';
import Amenities from '@/components/real-estate/property-detail/Amenities.component';
import Reviews from '@/components/real-estate/property-detail/Reviews.component';
import SimilarListings from '@/components/real-estate/property-detail/SimilarListings.component';
import PropertyDesc from '@/components/real-estate/property-detail/PropertyDesc.component';
import Nearby from '@/components/real-estate/property-detail/Nearby.component';
import WalkScore from '@/components/real-estate/property-detail/Walkscore.component';
import ContactAgentForm from '@/components/real-estate/property-detail/ContactAgentForm.component';
import PropertyTabs from '@/components/real-estate/PropertyTabs.component';
import Video from '@/components/real-estate/property-detail/Video.component';
import VirtualTour from '@/components/real-estate/property-detail/VirtualTour.component';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// ---------------- AUTH HOOK ----------------
function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  return { isLoggedIn, login, logout, isLoading };
}

// ---------------- LOGIN FORM ----------------
function LoginForm({
  onSuccess,
  onClose,
}: {
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='Enter your email'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          placeholder='Enter your password'
          required
        />
      </div>
      <div className='flex gap-2 pt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onClose}
          className='flex-1'
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isLoading} className='flex-1'>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </div>
    </form>
  );
}

// ---------------- CONTACT SECTION ----------------
function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isLoggedIn, login, isLoading } = useAuth();

  const handleContactClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      setIsModalOpen(true);
    } else {
      setShowLogin(false);
      setIsModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    login();
    setShowLogin(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowLogin(false);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className='space-y-4'>
        <Button disabled className='w-full bg-gray-400 text-white' size='lg'>
          Loading...
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {/* Enquiry button for non-logged-in users */}
      {!isLoggedIn && (
        <Button
          onClick={handleContactClick}
          className='w-full bg-red-500 hover:bg-red-600 text-white'
          size='lg'
        >
          Enquiry
        </Button>
      )}

      {/* Modal for login/contact */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>
              {showLogin ? 'Enquiry' : 'Contact Agent'}
            </DialogTitle>
            <DialogDescription>
              {showLogin
                ? 'Please login to contact the property agent'
                : "Fill out the form below and we'll get back to you soon"}
            </DialogDescription>
          </DialogHeader>

          {showLogin ? (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onClose={handleCloseModal}
            />
          ) : (
            <ContactAgentForm onSuccess={handleFormSuccess} />
          )}
        </DialogContent>
      </Dialog>

      {/* Contact form for logged-in users */}
      {isLoggedIn && <ContactAgentForm onSuccess={handleFormSuccess} />}
    </div>
  );
}

// ---------------- PAGE ----------------
export default function PropertyDetailPage() {
  const images = [
    '/assets/images/real-estate/01.png',
    '/assets/images/real-estate/02.png',
    '/assets/images/real-estate/03.png',
    '/assets/images/real-estate/04.png',
    '/assets/images/real-estate/05.png',
    '/assets/images/real-estate/6.png',
    '/assets/images/real-estate/7.png',
  ];

  return (
    <div className="container mx-auto px-9 py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Header + Gallery */}
      <div className="space-y-6">
        <PropertyHeader />
        <Gallery images={images} />
      </div>

      {/* Property Tabs - Will only appear when overview section comes into view */}
      <PropertyTabs />

      {/* Content sections with proper spacing for scroll detection */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12'>
        <div className='lg:col-span-2 space-y-16'>
          {/* Overview section - This triggers the tabs to appear when scrolled to */}
          <div id='overview'>
            <PropertyDetails />
          </div>
          <div id='desc'>
            <PropertyDesc />
          </div>
          <div id='map'>
            <MapSection />
          </div>
          <div id='amenities'>
            <Amenities />
          </div>
          <div id='floorplans'>
            <FloorPlans />
          </div>
          <div id='video'>
            <Video />
          </div>
          <div id='virtualtour'>
            <VirtualTour />
          </div>
          <div id='nearby'>
            <Nearby />
          </div>
          <div id='walkscore'>
            <WalkScore />
          </div>
          <div id='reviews'>
            <Reviews />
          </div>
        </div>

        {/* Sticky Contact Section */}
        <div className='lg:col-span-1'>
          <div className='sticky top-32'>
            <ContactSection />
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <div className="mt-16">
        <SimilarListings />
      </div>
    </div>
  );
}
