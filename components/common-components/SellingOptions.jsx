// components/SellingOptions.js
import React from 'react';
import { motion } from 'framer-motion';

const SellingOptions = () => {
  return (
    <div className='py-16 bg-white'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='max-w-7xl mx-auto p-6'
      >
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Let's find the right
                <br />
                selling option for you
              </h2>
              <p className='text-gray-600 mb-6'>
                As the complexity of buildings to increase, the field of
                architecture
              </p>
              <ul className='space-y-3 mb-8'>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-red-600 rounded-full mr-3'></span>
                  Find excellent deals
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-red-600 rounded-full mr-3'></span>
                  Friendly host & Fast support
                </li>
                <li className='flex items-center'>
                  <span className='w-2 h-2 bg-red-600 rounded-full mr-3'></span>
                  List your own property
                </li>
              </ul>
            </div>
            <div className='relative h-64 rounded-lg overflow-hidden'>
              <img 
                src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                alt='Modern house exterior'
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SellingOptions;
