// components/BlogSection.js
import React from 'react';

const BlogSection = () => {
  const blogPosts = [
    {
      title: 'Buying Your First Home',
      subtitle: 'Essential tips and strategies for first-time home buyers in the current market',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      date: 'April 10, 2024',
      readTime: '5 min read'
    },
    {
      title: 'Real Estate Investment',
      subtitle: 'How to identify profitable rental properties and maximize your ROI',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
      date: 'April 8, 2024',
      readTime: '7 min read'
    },
    {
      title: 'Home Staging Tips',
      subtitle: 'Professional staging techniques to sell your property faster and for more money',
      image: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400&h=300&fit=crop',
      date: 'April 5, 2024',
      readTime: '4 min read'
    }
  ];


  return (
    <div className='py-16 bg-gray-50'> 
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">From Our Blog</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-cover bg-center relative" style={{ backgroundImage: `url(${post.image})` }}>
                {/* Dark overlay for better text readability if needed */}
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              </div>
              <div className="p-6">
                {/* Date and Read Time */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.subtitle}</p>
                <a href="#" className="text-red-600 font-medium hover:text-red-700 transition-colors inline-flex items-center">
                  Read More
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;