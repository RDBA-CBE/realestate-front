// components/BlogSection.js
import React from 'react';

const BlogSection = () => {
  const blogPosts = [
    {
      title: 'Living Room',
      subtitle: 'Contemporary Home Private Balancing Openness'
    },
    {
      title: 'Living Room',
      subtitle: 'Contemporary Home Private Balancing Openness'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">From Our Blog</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.subtitle}</p>
                <a href="#" className="text-red-600 font-medium">Read More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;