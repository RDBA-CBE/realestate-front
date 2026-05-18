"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TermsAndConditionsPage = () => {
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
            src="https://images.unsplash.com/photo-1516156007-ad02b522cff4?q=80&w=2070&auto=format&fit=crop"
            alt="Legal Document Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Terms and Conditions</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-light">
              Understanding your rights and responsibilities when using our services.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="section-pad">
          <div className="section-wid max-w-4xl mx-auto">
            <h2 className="section-ti mb-8 text-center">Agreement to Our Terms</h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              Welcome to Real Estate! These Terms and Conditions ("Terms") govern your use of our website, services, and applications (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="section-in-ti mb-3 text-2xl">1. Use of Services</h3>
                <p className="text-gray-700 leading-relaxed">
                  You must be at least 18 years old to use our Services. You agree to use the Services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Services. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our Services.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">2. User Accounts</h3>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of our Services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">3. Intellectual Property</h3>
                <p className="text-gray-700 leading-relaxed">
                  All content on our Services, including text, graphics, logos, images, and software, is the property of Real Estate or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works of any content without our express written permission.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">4. Disclaimers and Limitation of Liability</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our Services are provided "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content or information provided through our Services. To the fullest extent permitted by law, Real Estate shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the Services.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">5. Governing Law</h3>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in [Your City/Region].
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">6. Changes to Terms</h3>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Services after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>

              <div>
                <h3 className="section-in-ti mb-3 text-2xl">7. Contact Us</h3>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms, please contact us at <Link href="mailto:support@realestate.com" className="text-dred hover:underline">support@realestate.com</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default TermsAndConditionsPage;