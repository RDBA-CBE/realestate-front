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
    <section className="section blog">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">From Our Blog</h2>
            <p className="section-subtitle">Aliquam lacinia diam quis lacus euismod</p>
          </div>
        </div>
        <div className="grid grid-2">
          {blogPosts.map((post, index) => (
            <div key={index} className="blog-card">
              <div className="blog-image">
                {/* Blog image would go here */}
              </div>
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p>{post.subtitle}</p>
                <a href="#" className="read-more">Read More</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;