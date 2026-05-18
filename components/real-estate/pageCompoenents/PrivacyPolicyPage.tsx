"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <section className="relative h-[300px] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1520004434532-cd668d27a421?q=80&w=2070&auto=format&fit=crop"
            alt="Privacy Policy Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-light">
              Your privacy is important to us. Learn how we protect your data.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-pad">
          <div className="section-wid max-w-4xl mx-auto">
            <h2 className="section-ti mb-8 text-center">Our Commitment to Your Privacy</h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              This Privacy Policy describes how Real Estate ("we," "us," or "our") collects, uses, and shares your personal information when you use our website, services, and applications (collectively, the "Services"). By using our Services, you agree to the collection and use of information in accordance with this policy.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="section-in-ti mb-3 text-2xl">1. Information We Collect</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect various types of information to provide and improve our Services to you.
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1">
                  <li><strong>Personal Data:</strong> While using our Services, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to, your email address, name, phone number, and address.</li>
                  <li><strong>Usage Data:</strong> We may also collect information on how the Services are accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Services that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</li>
                  <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Services and hold certain information.</li>
                </ul>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">2. How We Use Your Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  Real Estate uses the collected data for various purposes:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1">
                  <li>To provide and maintain our Services</li>
                  <li>To notify you about changes to our Services</li>
                  <li>To allow you to participate in interactive features of our Services when you choose to do so</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Services</li>
                  <li>To monitor the usage of our Services</li>
                  <li>To detect, prevent, and address technical issues</li>
                  <li>To provide you with news, special offers, and general information about other goods, services, and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information.</li>
                </ul>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">3. How We Share Your Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may share your personal information in the following situations:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1">
                  <li><strong>With Service Providers:</strong> We may share your personal information with third-party service providers to monitor and analyze the use of our Services, to contact you.</li>
                  <li><strong>For Business Transfers:</strong> We may share or transfer your personal information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                  <li><strong>With Affiliates:</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Policy.</li>
                  <li><strong>With Your Consent:</strong> We may disclose your personal information for any other purpose with your consent.</li>
                </ul>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">4. Your Data Protection Rights</h3>
                <p className="text-gray-700 leading-relaxed">
                  Depending on your location, you may have the following data protection rights:
                </p>
                <ul className="list-disc list-inside text-gray-700 ml-4 mt-2 space-y-1">
                  <li>The right to access, update or delete the information we have on you.</li>
                  <li>The right of rectification.</li>
                  <li>The right to object.</li>
                  <li>The right of restriction.</li>
                  <li>The right to data portability.</li>
                  <li>The right to withdraw consent.</li>
                </ul>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">5. Security of Your Data</h3>
                <p className="text-gray-700 leading-relaxed">
                  The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">6. Changes to This Privacy Policy</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">7. Contact Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us by email: <Link href="mailto:privacy@realestate.com" className="text-dred hover:underline">privacy@realestate.com</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;