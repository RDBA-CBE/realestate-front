// "use client";

// import { motion } from "framer-motion";
// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";

// export default function ProfilePage() {
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className="max-w-6xl mx-auto space-y-8 p-6"
//     >
//       {/* Profile Info Section */}
//       <Card className="rounded-xl shadow-sm border bg-white">
//         <CardContent className="p-6 space-y-6">
//           {/* Upload Section */}
//           <div className="flex flex-col md:flex-row gap-6 items-center">
//             <div className="relative w-48 h-48 rounded-lg overflow-hidden">
//               <Image
//                 src="/assets/images/real-estate/profile.png"
//                 alt="Profile"
//                 fill
//                 className="object-cover"
//               />
//               <button className="absolute top-2 left-2 bg-white p-2 rounded-full shadow">
//                 🗑
//               </button>
//             </div>
//             <div className="flex-1 space-y-2">
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="rounded-xl h-14 px-8 text-base"
//               >
//                 Upload Profile Files ↗
//               </Button>

//               <p className="text-gray-500 text-sm">
//                 Photos must be JPEG or PNG format and at least 2048x768
//               </p>
//             </div>
//           </div>

//           {/* User Info Grid */}
//           <div className="grid md:grid-cols-3 gap-4">
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//           </div>

//           <Input placeholder="Your Name" />
//           <Textarea
//             placeholder="There are many variations of passages."
//             rows={4}
//           />

//           <div className="flex justify-end">
//             <Button className="h-14 px-8 rounded-lg">Update Profile ↗</Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Social Media Section */}
//       <Card className="rounded-xl shadow-sm border bg-white">
//         <CardContent className="p-6 space-y-6">
//           <h3 className="text-base font-semibold">Social Media</h3>
//           <div className="grid md:grid-cols-3 gap-4">
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//             <Input placeholder="Your Name" />
//           </div>
//           <div className="flex justify-end">
//             <Button className="h-14 px-8 rounded-lg">Update Social ↗</Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Password Section */}
//       <Card className="rounded-xl shadow-sm border bg-white">
//         <CardContent className="p-6 space-y-6">
//           <h3 className="text-base font-semibold">Change password</h3>
//           <div className="grid md:grid-cols-3 gap-4">
//             <Input placeholder="Your Name" type="password" />
//             <Input placeholder="Your Name" type="password" />
//             <Input placeholder="Your Name" type="password" />
//           </div>
//           <div className="flex justify-end">
//             <Button className="h-14 px-8 rounded-lg">Change Password ↗</Button>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }
// 'use client';

// import { motion } from 'framer-motion';
// import Image from 'next/image';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Eye, EyeOff, Trash2 } from 'lucide-react';
// import { useState } from 'react';

// export default function ProfilePage() {
//   const [showPassword, setShowPassword] = useState(false);

//   const [profile, setProfile] = useState({
//     fullName: '',
//     email: '',
//     phone: '',
//     city: '',
//     country: '',
//     zip: '',
//     about: '',
//   });

//   const [social, setSocial] = useState({
//     facebook: '',
//     twitter: '',
//     linkedin: '',
//     instagram: '',
//   });

//   const [passwords, setPasswords] = useState({
//     current: '',
//     new: '',
//     confirm: '',
//   });

//   const [errors, setErrors] = useState({
//     profile: {},
//     social: {},
//     passwords: {},
//     photo: '',
//   });

//   const [photo, setPhoto] = useState(null);
//   const [preview, setPreview] = useState('/assets/images/real-estate/profile.png');

//   // Handle input changes
//   const handleChange = (e, section) => {
//     const { name, value } = e.target;
//     if (section === 'profile') setProfile((prev) => ({ ...prev, [name]: value }));
//     if (section === 'social') setSocial((prev) => ({ ...prev, [name]: value }));
//     if (section === 'passwords') setPasswords((prev) => ({ ...prev, [name]: value }));
//   };

//   // Validation helpers
//   const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
//   const isValidPhone = (phone) => /^\d{7,15}$/.test(phone);
//   const isValidURL = (url) =>
//     url === '' || /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/([\w/_.]*)?)?$/.test(url);

//   const validateProfile = () => {
//     const newErrors = {};
//     if (!profile.fullName.trim()) newErrors.fullName = 'Full Name is required';
//     if (!profile.email.trim()) newErrors.email = 'Email is required';
//     else if (!isValidEmail(profile.email)) newErrors.email = 'Email is invalid';
//     if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
//     else if (!isValidPhone(profile.phone)) newErrors.phone = 'Phone number is invalid';
//     if (!profile.city.trim()) newErrors.city = 'City is required';
//     if (!profile.country.trim()) newErrors.country = 'Country is required';
//     if (!profile.zip.trim()) newErrors.zip = 'Zip code is required';
//     setErrors((prev) => ({ ...prev, profile: newErrors }));
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateSocial = () => {
//     const newErrors = {};
//     Object.keys(social).forEach((key) => {
//       if (!isValidURL(social[key])) newErrors[key] = 'URL is invalid';
//     });
//     setErrors((prev) => ({ ...prev, social: newErrors }));
//     return Object.keys(newErrors).length === 0;
//   };

//   const validatePasswords = () => {
//     const newErrors = {};
//     if (!passwords.current.trim()) newErrors.current = 'Current password is required';
//     if (!passwords.new.trim()) newErrors.new = 'New password is required';
//     if (passwords.new !== passwords.confirm) newErrors.confirm = 'Passwords do not match';
//     setErrors((prev) => ({ ...prev, passwords: newErrors }));
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleProfileUpdate = () => {
//     if (!validateProfile()) return;
//     alert('Profile updated successfully!');
//     console.log(profile, photo);
//   };

//   const handleSocialUpdate = () => {
//     if (!validateSocial()) return;
//     alert('Social links updated successfully!');
//     console.log(social);
//   };

//   const handlePasswordUpdate = () => {
//     if (!validatePasswords()) return;
//     alert('Password changed successfully!');
//     console.log(passwords);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!['image/jpeg', 'image/png'].includes(file.type)) {
//       setErrors((prev) => ({ ...prev, photo: 'Only JPEG or PNG files are allowed.' }));
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       setErrors((prev) => ({ ...prev, photo: 'File size must be less than 2MB.' }));
//       return;
//     }

//     setErrors((prev) => ({ ...prev, photo: '' }));
//     setPhoto(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleDeletePhoto = () => {
//     setPhoto(null);
//     setPreview('/assets/images/real-estate/profile.png');
//     setErrors((prev) => ({ ...prev, photo: '' }));
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       className='max-w-5xl mx-auto space-y-12 p-6'
//     >
//       {/* Combined Profile Card */}
//       <Card className='rounded-2xl shadow-md border bg-white hover:shadow-lg transition'>
//         <CardContent className='flex flex-col md:flex-row gap-6'>
//           {/* Left: Profile Photo */}
//           <div className='pt-6 flex flex-col items-center md:items-start gap-4'>
//             <div className='relative w-36 h-36 rounded-full overflow-hidden border-2 border-gray-200'>
//               <Image
//                 src={preview}
//                 alt='Profile'
//                 fill
//                 className='object-cover pointer-events-none'
//               />
//               <button
//                 type='button'
//                 className='absolute top-4 right-6 bg-white p-1 rounded-full shadow hover:bg-red-50 z-10'
//                 onClick={handleDeletePhoto}
//               >
//                 <Trash2 size={16} className='text-red-600' />
//               </button>
//             </div>
//             <label htmlFor='upload-photo'>
//               <input
//                 type='file'
//                 id='upload-photo'
//                 accept='image/png, image/jpeg'
//                 onChange={handleFileChange}
//                 className='hidden'
//               />
//               <Button
//                 size='md'
//                 variant='outline'
//                 className='rounded-full h-10 px-6 text-red-600 border-red-500 hover:bg-red-50'
//               >
//                 Upload Photo
//               </Button>
//             </label>
//             {errors.photo && <span className='text-red-600 text-sm'>{errors.photo}</span>}
//           </div>

//           {/* Right: Profile Info */}
//           <div className='flex-1 pt-6 space-y-4'>
//             <div className='grid md:grid-cols-2 gap-4'>
//               {['fullName', 'email', 'phone', 'city', 'country', 'zip'].map((field) => (
//                 <div key={field} className='flex flex-col'>
//                   <Input
//                     name={field}
//                     value={profile[field]}
//                     onChange={(e) => handleChange(e, 'profile')}
//                     placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
//                     className={`rounded-lg ${errors.profile[field] ? 'border-red-500' : ''}`}
//                   />
//                   {errors.profile[field] && (
//                     <span className='text-red-600 text-sm mt-1'>{errors.profile[field]}</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//             <Textarea
//               name='about'
//               value={profile.about}
//               onChange={(e) => handleChange(e, 'profile')}
//               placeholder='About Me'
//               rows={4}
//               className={`w-full rounded-lg ${errors.profile.about ? 'border-red-500' : ''}`}
//             />
//             {errors.profile.about && (
//               <span className='text-red-600 text-sm mt-1'>{errors.profile.about}</span>
//             )}
//             <div className='flex justify-end'>
//               <Button
//                 onClick={handleProfileUpdate}
//                 className='h-10 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold'
//               >
//                 Update Profile
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Social Media Section */}
//       <Card className='rounded-2xl shadow-md border bg-white hover:shadow-lg transition'>
//         <CardContent className='pt-6 space-y-4'>
//           <h3 className='font-semibold text-lg'>Social Media</h3>
//           <div className='grid md:grid-cols-2 gap-4'>
//             {['facebook', 'twitter', 'linkedin', 'instagram'].map((field) => (
//               <div key={field} className='flex flex-col'>
//                 <Input
//                   name={field}
//                   value={social[field]}
//                   onChange={(e) => handleChange(e, 'social')}
//                   placeholder={field.charAt(0).toUpperCase() + field.slice(1) + ' URL'}
//                   className={`rounded-lg ${errors.social[field] ? 'border-red-500' : ''}`}
//                 />
//                 {errors.social[field] && (
//                   <span className='text-red-600 text-sm mt-1'>{errors.social[field]}</span>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className='flex justify-end'>
//             <Button
//               onClick={handleSocialUpdate}
//               className='h-10 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold'
//             >
//               Update Social
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Password Section */}
//       <Card className='rounded-2xl shadow-md border bg-white hover:shadow-lg transition'>
//         <CardContent className='pt-6 space-y-4'>
//           <h3 className='font-semibold text-lg'>Change Password</h3>
//           <div className='grid md:grid-cols-3 gap-4'>
//             {['current', 'new', 'confirm'].map((field) => (
//               <div key={field} className='flex flex-col relative'>
//                 <Input
//                   name={field}
//                   value={passwords[field]}
//                   onChange={(e) => handleChange(e, 'passwords')}
//                   placeholder={field.charAt(0).toUpperCase() + field.slice(1) + ' Password'}
//                   type={showPassword ? 'text' : 'password'}
//                   className={`rounded-lg ${errors.passwords[field] ? 'border-red-500' : ''}`}
//                 />
//                 {field === 'confirm' && (
//                   <button
//                     type='button'
//                     className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                   </button>
//                 )}
//                 {errors.passwords[field] && (
//                   <span className='text-red-600 text-sm mt-1'>{errors.passwords[field]}</span>
//                 )}
//               </div>
//             ))}
//           </div>
//           <div className='flex justify-end'>
//             <Button
//               onClick={handlePasswordUpdate}
//               className='h-10 px-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold'
//             >
//               Change Password
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// }

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  Trash2,
  Upload,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Lock,
  Share2,
} from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    zip: '',
    about: '',
  });

  const [social, setSocial] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [errors, setErrors] = useState({
    profile: {},
    social: {},
    passwords: {},
    photo: '',
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(
    '/assets/images/real-estate/profile.png'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) =>
    /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
  const isValidURL = (url) =>
    url === '' ||
    /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(
      url
    );
  const isStrongPassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section === 'profile') {
      setProfile((prev) => ({ ...prev, [name]: value }));
      // Clear error when user starts typing
      if (errors.profile[name]) {
        setErrors((prev) => ({
          ...prev,
          profile: { ...prev.profile, [name]: '' },
        }));
      }
    }
    if (section === 'social') {
      setSocial((prev) => ({ ...prev, [name]: value }));
      if (errors.social[name]) {
        setErrors((prev) => ({
          ...prev,
          social: { ...prev.social, [name]: '' },
        }));
      }
    }
    if (section === 'passwords') {
      setPasswords((prev) => ({ ...prev, [name]: value }));
      if (errors.passwords[name]) {
        setErrors((prev) => ({
          ...prev,
          passwords: { ...prev.passwords, [name]: '' },
        }));
      }
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!profile.fullName.trim()) newErrors.fullName = 'Full Name is required';
    else if (profile.fullName.trim().length < 2)
      newErrors.fullName = 'Name must be at least 2 characters';

    if (!profile.email.trim()) newErrors.email = 'Email is required';
    else if (!isValidEmail(profile.email))
      newErrors.email = 'Please enter a valid email address';

    if (!profile.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!isValidPhone(profile.phone))
      newErrors.phone = 'Please enter a valid phone number';

    if (!profile.city.trim()) newErrors.city = 'City is required';
    if (!profile.country.trim()) newErrors.country = 'Country is required';

    if (!profile.zip.trim()) newErrors.zip = 'Zip code is required';
    else if (!/^\d{5}(-\d{4})?$/.test(profile.zip))
      newErrors.zip = 'Please enter a valid zip code';

    if (profile.about.length > 500)
      newErrors.about = 'About me cannot exceed 500 characters';

    setErrors((prev) => ({ ...prev, profile: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateSocial = () => {
    const newErrors = {};
    Object.keys(social).forEach((key) => {
      if (social[key] && !isValidURL(social[key])) {
        newErrors[key] = 'Please enter a valid URL';
      }
    });
    setErrors((prev) => ({ ...prev, social: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswords = () => {
    const newErrors = {};

    if (!passwords.current.trim())
      newErrors.current = 'Current password is required';

    if (!passwords.new.trim()) newErrors.new = 'New password is required';
    else if (!isStrongPassword(passwords.new))
      newErrors.new =
        'Password must be at least 8 characters with uppercase, lowercase, number, and special character';

    if (!passwords.confirm.trim())
      newErrors.confirm = 'Please confirm your new password';
    else if (passwords.new !== passwords.confirm)
      newErrors.confirm = 'Passwords do not match';

    setErrors((prev) => ({ ...prev, passwords: newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileUpdate = async () => {
    if (!validateProfile()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    // Show success feedback
    document.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { message: 'Profile updated successfully!', type: 'success' },
      })
    );
  };

  const handleSocialUpdate = async () => {
    if (!validateSocial()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    document.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: {
          message: 'Social links updated successfully!',
          type: 'success',
        },
      })
    );
  };

  const handlePasswordUpdate = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    document.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { message: 'Password changed successfully!', type: 'success' },
      })
    );

    // Clear password fields
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: 'Only JPEG, PNG, or WebP files are allowed.',
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: 'File size must be less than 5MB.',
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, photo: '' }));
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setPreview('/assets/images/real-estate/profile.png');
    setErrors((prev) => ({ ...prev, photo: '' }));
  };

  const getInputIcon = (field) => {
    const icons = {
      fullName: <User className='h-4 w-4' />,
      email: <Mail className='h-4 w-4' />,
      phone: <Phone className='h-4 w-4' />,
      city: <MapPin className='h-4 w-4' />,
      country: <Globe className='h-4 w-4' />,
      zip: <MapPin className='h-4 w-4' />,
    };
    return icons[field];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen py-8 px-4'
    >
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <h1 className='text-4xl font-bold '>Profile Settings</h1>
          <p className='text-gray-600 mt-2'>
            Manage your personal information and preferences
          </p>
        </motion.div> */}

        <div className='grid lg:grid-cols-4 gap-8'>
          {/* Sidebar Navigation */}
          <Card className='lg:col-span-1 rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
            <CardContent className='p-6'>
              <nav className='space-y-2'>
                {[
                  { id: 'profile', label: 'Personal Info', icon: User },
                  { id: 'social', label: 'Social Media', icon: Share2 },
                  { id: 'security', label: 'Security', icon: Lock },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-red-600 text-white rounded-full'
                        : 'text-gray-600 hover:bg-red-50'
                    }`}
                  >
                    <item.icon className='h-5 w-5' />
                    <span className='font-medium'>{item.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className='rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                  <CardContent className='p-8'>
                    <div className='flex flex-col md:flex-row gap-8'>
                      {/* Profile Photo */}
                      <div className='flex flex-col items-center'>
                        <div className='relative group'>
                          <div className='w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg'>
                            <Image
                              src={preview}
                              alt='Profile'
                              width={128}
                              height={128}
                              className='object-cover w-full h-full'
                            />
                          </div>
                          <button
                            onClick={handleDeletePhoto}
                            className='absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                          >
                            <Trash2 size={16} />
                          </button>
                          <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-2xl' />
                        </div>

                        <label className='mt-4 cursor-pointer'>
                          <input
                            type='file'
                            onChange={handleFileChange}
                            className='hidden'
                            accept='image/*'
                          />
                          <Button
                            variant='outline'
                            className='rounded-full px-6 bg-red-600 text-white rounded-full'
                          >
                            <Upload className='h-4 w-4 mr-2' />
                            Upload Photo
                          </Button>
                        </label>
                        {errors.photo && (
                          <span className='text-red-500 text-sm mt-2'>
                            {errors.photo}
                          </span>
                        )}
                      </div>

                      {/* Profile Form */}
                      <div className='flex-1 space-y-6'>
                        <h3 className='text-2xl font-bold text-gray-800'>
                          Personal Information
                        </h3>

                        <div className='grid md:grid-cols-2 gap-4'>
                          {[
                            {
                              key: 'fullName',
                              label: 'Full Name',
                              type: 'text',
                            },
                            {
                              key: 'email',
                              label: 'Email Address',
                              type: 'email',
                            },
                            {
                              key: 'phone',
                              label: 'Phone Number',
                              type: 'tel',
                            },
                            { key: 'city', label: 'City', type: 'text' },
                            { key: 'country', label: 'Country', type: 'text' },
                            { key: 'zip', label: 'ZIP Code', type: 'text' },
                          ].map((field) => (
                            <div key={field.key} className='space-y-2'>
                              <label className='text-sm font-medium text-gray-700'>
                                {field.label}
                              </label>
                              <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400'>
                                  {getInputIcon(field.key)}
                                </div>
                                <Input
                                  name={field.key}
                                  type={field.type}
                                  placeholder={field.label} // show as placeholder
                                  value={profile[field.key]}
                                  onChange={(e) => handleChange(e, 'profile')}
                                  className={`pl-10 rounded-xl border-2 transition-all ${
                                    errors.profile[field.key]
                                      ? 'border-red-300 focus:border-red-500'
                                      : 'border-gray-200 focus:border-blue-500'
                                  }`}
                                />
                              </div>
                              {errors.profile[field.key] && (
                                <span className='text-red-500 text-sm block'>
                                  {errors.profile[field.key]}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className='space-y-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            About Me{' '}
                            <span className='text-gray-400 text-xs'>
                              ({profile.about.length}/500)
                            </span>
                          </label>
                          <Textarea
                            name='about'
                            value={profile.about}
                            onChange={(e) => handleChange(e, 'profile')}
                            rows={4}
                            className={`rounded-xl border-2 transition-all ${
                              errors.profile.about
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-blue-500'
                            }`}
                            placeholder='Tell us about yourself...'
                          />
                          {errors.profile.about && (
                            <span className='text-red-500 text-sm'>
                              {errors.profile.about}
                            </span>
                          )}
                        </div>

                        <Button
                          onClick={handleProfileUpdate}
                          disabled={isLoading}
                          className='w-full md:w-auto px-8 bg-red-600 text-white rounded-full'
                        >
                          {isLoading ? 'Updating...' : 'Update Profile'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Social Media Section */}
            {activeSection === 'social' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className='rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                  <CardContent className='p-8'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                      Social Media Links
                    </h3>

                    <div className='grid md:grid-cols-2 gap-6'>
                      {Object.entries(social).map(([platform, url]) => (
                        <div key={platform} className='space-y-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            {platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
                          </label>
                          <Input
                            name={platform}
                            value={url}
                            onChange={(e) => handleChange(e, 'social')}
                            placeholder={`https://${platform}.com/username`}
                            className={`rounded-xl border-2 transition-all ${
                              errors.social[platform]
                                ? 'border-red-300 focus:border-red-500'
                                : 'border-gray-200 focus:border-blue-500'
                            }`}
                          />
                          {errors.social[platform] && (
                            <span className='text-red-500 text-sm block'>
                              {errors.social[platform]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handleSocialUpdate}
                      disabled={isLoading}
                      className='mt-6 px-8 bg-red-600 text-white rounded-full'
                    >
                      {isLoading ? 'Updating...' : 'Update Social Links'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className='rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm'>
                  <CardContent className='p-8'>
                    <h3 className='text-2xl font-bold text-gray-800 mb-6'>
                      Change Password
                    </h3>

                    <div className='space-y-6 max-w-md'>
                      {[
                        { key: 'current', label: 'Current Password' },
                        { key: 'new', label: 'New Password' },
                        { key: 'confirm', label: 'Confirm New Password' },
                      ].map((field) => (
                        <div key={field.key} className='space-y-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            {field.label}
                          </label>
                          <div className='relative'>
                            <Input
                              name={field.key}
                              type={showPassword ? 'text' : 'password'}
                              value={passwords[field.key]}
                              onChange={(e) => handleChange(e, 'passwords')}
                              className={`pr-10 rounded-xl border-2 transition-all ${
                                errors.passwords[field.key]
                                  ? 'border-red-300 focus:border-red-500'
                                  : 'border-gray-200 focus:border-blue-500'
                              }`}
                              placeholder={`Enter your ${field.label.toLowerCase()}`}
                            />
                            <button
                              type='button'
                              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </button>
                          </div>
                          {errors.passwords[field.key] && (
                            <span className='text-red-500 text-sm block'>
                              {errors.passwords[field.key]}
                            </span>
                          )}
                          {field.key === 'new' &&
                            !errors.passwords.new &&
                            passwords.new && (
                              <div className='text-xs text-gray-500'>
                                Password strength:{' '}
                                {isStrongPassword(passwords.new)
                                  ? 'Strong'
                                  : 'Weak'}
                              </div>
                            )}
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={handlePasswordUpdate}
                      disabled={isLoading}
                      className='mt-6 px-8 bg-red-600 text-white rounded-full'
                    >
                      {isLoading ? 'Updating...' : 'Change Password'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
