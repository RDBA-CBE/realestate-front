// components/Footer.js
import React from 'react';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-color2 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Need help? Talk to our expert.</h3>
            <p className="text-white mb-4">Talk to our experts or Browse through more properties.</p>
            <div className="space-y-2">
              <p className="font-semibold">+(0) 123 050 945 02</p>
              <p className="text-white font-semibold">realestate@gmail.com</p>
            </div>
          </div>
          
          <div className='md:ps-10'>
            <h4 className="font-semibold mb-4">Apps</h4>
            <div className="space-y-2">
              <a href="#" className="block text-white hover:text-white">Apple Store</a>
              <a href="#" className="block text-white hover:text-white">Google Play</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow us on social media</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <a href="#" className="text-white hover:text-gray-200 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors text-[22px] mt-[-3px]">
               𝕏
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-gray-200 transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Keep Yourself Up to Date</h4>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 border bg-transparent border-white rounded-l focus:outline-none placeholder:text-white" />
              <button className="bg-white text-dred px-4 py-2 rounded-r font-medium">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/30 pt-8 text-center">
          <p className="text-white">© Real Estate - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;