// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Need help? Talk to our expert.</h3>
            <p className="text-gray-400 mb-4">Talk to our experts or Browse through more properties.</p>
            <div className="space-y-2">
              <p className="font-semibold">+(0) 123 050 945 02</p>
              <p className="text-red-400 font-semibold">realestate@gmail.com</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Apps</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white">Apple Store</a>
              <a href="#" className="block text-gray-400 hover:text-white">Google Play</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow us on social media</h4>
            <div className="flex space-x-4">
              {/* Social media icons would go here */}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Keep Yourself Up to Date</h4>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l focus:outline-none" />
              <button className="bg-red-600 px-4 py-2 rounded-r font-medium">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">© Real Estate - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;