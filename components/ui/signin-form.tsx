

'use client';

import { motion, AnimatePresence, TargetAndTransition } from 'framer-motion';
import { useState , useEffect  } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Chrome } from 'lucide-react';

// Define types
type Role = 'SELLER' | 'AGENT' | 'DEVELOPER' | 'BUYER';

interface Field {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
}

interface RoleAnimation {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
}

// Role-specific fields
const roleFields: Record<Role, Field[]> = {
  SELLER: [
    {
      id: 'companyName',
      label: 'Company Name',
      placeholder: 'Enter Company Name',
    },
    { id: 'licenseNo', label: 'License No', placeholder: 'Enter License No' },
  ],
  AGENT: [
    {
      id: 'agencyName',
      label: 'Agency Name',
      placeholder: 'Enter Agency Name',
    },
    { id: 'agentId', label: 'Agent ID', placeholder: 'Enter Agent ID' },
  ],
  DEVELOPER: [
    {
      id: 'projectName',
      label: 'Project Name',
      placeholder: 'Enter Project Name',
    },
    { id: 'gstNumber', label: 'GST Number', placeholder: 'Enter GST Number' },
  ],
  BUYER: [
    { id: 'firstName', label: 'First Name', placeholder: 'Enter First Name' },
    { id: 'lastName', label: 'Last Name', placeholder: 'Enter Last Name' },
  ],
};

// Role-specific animations
const roleAnimations: Record<Role, RoleAnimation> = {
  SELLER: { initial: { x: -40, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  AGENT: { initial: { y: -40, opacity: 0 }, animate: { y: 0, opacity: 1 } },
  DEVELOPER: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  },
  BUYER: { initial: { opacity: 0 }, animate: { opacity: 1 } },
};

export default function SignInForm() {
  const [role, setRole] = useState<Role | ''>('');
  useEffect(() => {
  if (role) {
    // Disable scroll
    document.body.style.overflow = 'hidden';
  } else {
    // Enable scroll
    document.body.style.overflow = 'auto';
  }

  // Cleanup on unmount
  return () => {
    document.body.style.overflow = 'auto';
  };
}, [role]);

  return (
    <div className='flex' style={{paddingTop:'30px'}}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        className='hidden md:flex relative flex-1 items-center justify-center'
      >
        <Image
          src='/assets/images/real-estate/01.png' // replace with a nice real estate / city image
          alt='Real Estate Background'
          fill
          className='object-cover'
          priority
        />

        <div className='absolute inset-0 bg-gradient-to-b from-black/50 to-black/20' />
        <div className='relative z-10 text-white text-center px-8'>
          <h1 className='text-4xl font-bold'>Find Your Dream Home</h1>
          <p className='mt-3 text-gray-200 max-w-md mx-auto'>
            Join our real estate platform to explore the latest listings and
            manage your properties effortlessly.
          </p>
        </div>
      </motion.div>

      {/* RIGHT SIDE - Card Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className='flex flex-1 justify-center items-center px-6'
      >
        <Card className='w-full max-w-md shadow-lg rounded-2xl'>
          <CardContent className='p-8 space-y-6'>
            {/* Logo / Header */}
            <div className='flex items-center gap-2'>
              <div className='h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold'>
                R
              </div>
              <span className='text-lg font-semibold'>Repute</span>
            </div>

            <div>
              <h2 className='text-2xl font-bold'>Create account</h2>
              <p className='text-sm text-gray-500'>
                Sign in with this account across the following sites.
              </p>
            </div>

            {/* Role Selector */}
            <div className='space-y-2'>
              <Label>Select Role</Label>
              <div className='grid grid-cols-2 gap-3'>
                {['SELLER', 'AGENT', 'DEVELOPER', 'BUYER'].map((r) => (
                  <Button
                    key={r}
                    variant={role === r ? 'default' : 'outline'}
                    className={`w-full ${
                      role === r ? 'bg-red-500 text-white' : ''
                    }`}
                    onClick={() => setRole(r as Role)}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dynamic Fields */}
            <AnimatePresence mode='wait'>
              {role && (
                <motion.div
                  key={role}
                  initial={roleAnimations[role].initial}
                  animate={roleAnimations[role].animate}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className='grid grid-cols-2 gap-4'
                >
                  {roleFields[role].map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className='space-y-2'
                    >
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        type={field.type || 'text'}
                        placeholder={field.placeholder}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email & Password */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='Enter Email' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter Password'
                />
              </div>
            </div>

            {/* Submit */}
            <Button className='w-full bg-red-500 hover:bg-red-600'>
              Create account
            </Button>

            {/* Divider */}
            <div className='relative flex items-center'>
              <div className='flex-grow border-t' />
              <span className='px-3 text-xs text-gray-400'>OR</span>
              <div className='flex-grow border-t' />
            </div>

            {/* Social logins */}
            <div className='space-y-3'>
              <Button
                variant='outline'
                className='w-full flex items-center gap-2'
              >
                <Chrome size={18} /> Continue with Google
              </Button>
            </div>

            {/* Footer */}
            <p className='text-center text-sm text-gray-600'>
              Already Have an Account?{' '}
              <Link
                href='/login'
                className='font-medium text-red-600 hover:underline'
              >
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
