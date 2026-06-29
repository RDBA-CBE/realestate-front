"use client";

import React from "react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using the website, mobile application, or any related services (collectively, the \"Services\") provided by Repute Real Estate (\"we\", \"our\", or \"us\"), you agree to be legally bound by these Terms and Conditions (\"Terms\"). If you do not agree to these Terms in their entirety, you must immediately cease use of our Services. These Terms constitute a legally binding agreement between you and Repute Real Estate.",
  },
  {
    title: "2. Eligibility",
    content:
      "You must be at least 18 years of age and possess the legal capacity to enter into binding agreements under applicable law to use our Services. By using our Services, you represent and warrant that you meet these eligibility requirements. We reserve the right to suspend or terminate access for any user who does not satisfy these requirements.",
  },
  {
    title: "3. Use of Services",
    content: "You agree to use our Services solely for lawful purposes and in accordance with these Terms. You shall not:",
    list: [
      "Use the Services in any manner that violates applicable local, national, or international law or regulation.",
      "Post, transmit, or distribute any content that is false, misleading, defamatory, obscene, or fraudulent.",
      "Impersonate any person or entity or misrepresent your affiliation with any person or entity.",
      "Interfere with, disrupt, or attempt to gain unauthorised access to any part of our Services or related systems.",
      "Use automated tools, bots, or scrapers to extract data from our platform without prior written consent.",
      "List properties for which you do not hold the legal right to advertise or transact.",
    ],
  },
  {
    title: "4. User Accounts",
    content:
      "Certain features of our Services require you to register and maintain a user account. You are responsible for providing accurate, current, and complete information during registration and for keeping your account credentials confidential. You are solely responsible for all activity that occurs under your account. You agree to notify us immediately at support@reputerealestate.com upon becoming aware of any unauthorised use of your account or any other breach of security. We reserve the right to suspend or terminate accounts that violate these Terms or that we determine, in our sole discretion, pose a risk to the integrity of our Services.",
  },
  {
    title: "5. Property Listings and Content",
    content:
      "Our platform enables users to post, view, and interact with property listings and related content. We act solely as an intermediary and do not verify the accuracy, completeness, or legality of any listing. You acknowledge and agree that:",
    list: [
      "All listing information is provided by third-party users and we make no representations or warranties as to its accuracy or reliability.",
      "We are not a party to any transaction between buyers, sellers, landlords, or tenants facilitated through our platform.",
      "Any agreement, negotiation, or transaction entered into between users is solely at their own risk.",
      "We reserve the right to remove any listing that we determine, in our sole discretion, violates these Terms or applicable law.",
    ],
  },
  {
    title: "6. Intellectual Property",
    content:
      "All content, materials, and technology comprising our Services — including but not limited to text, graphics, logos, icons, images, audio clips, and software — are the exclusive property of Repute Real Estate or its licensors and are protected by applicable copyright, trademark, and intellectual property laws. You are granted a limited, non-exclusive, non-transferable, revocable licence to access and use our Services for personal, non-commercial purposes only. You may not reproduce, modify, distribute, publicly display, republish, or create derivative works from any content on our platform without our prior written consent.",
  },
  {
    title: "7. Privacy",
    content:
      "Your use of our Services is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our Services, you consent to the collection, use, and disclosure of your information as described in our Privacy Policy. Please review our Privacy Policy carefully before using our Services.",
  },
  {
    title: "8. Disclaimers",
    content:
      "Our Services are provided on an \"as is\" and \"as available\" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that our Services will be uninterrupted, error-free, or free of viruses or other harmful components. We do not guarantee the accuracy, completeness, timeliness, or reliability of any content, property listing, or information available through our Services.",
  },
  {
    title: "9. Limitation of Liability",
    content:
      "To the fullest extent permitted by applicable law, Repute Real Estate and its officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, data, goodwill, or business opportunities — arising out of or in connection with your use of or inability to use our Services, even if we have been advised of the possibility of such damages. Our aggregate liability to you for any claims arising from your use of the Services shall not exceed the amount paid by you, if any, to us in the twelve (12) months preceding the claim.",
  },
  {
    title: "10. Indemnification",
    content:
      "You agree to indemnify, defend, and hold harmless Repute Real Estate and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising out of or in any way connected with: (a) your access to or use of our Services; (b) your violation of these Terms; (c) your violation of any third-party rights, including intellectual property or privacy rights; or (d) any content you post or transmit through our platform.",
  },
  {
    title: "11. Third-Party Services and Links",
    content:
      "Our Services may contain links to third-party websites, services, or resources. These links are provided for your convenience only. We have no control over the content or practices of third-party sites and accept no responsibility or liability for them. The inclusion of any link does not imply our endorsement of the linked site or its content. We encourage you to review the terms and privacy policies of any third-party services you access.",
  },
  {
    title: "12. Modifications to the Services",
    content:
      "We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with or without notice, and without liability to you. We may also update the features, functionality, or content of our Services at our discretion. Your continued use of the Services following any such modifications constitutes your acceptance of the changes.",
  },
  {
    title: "13. Governing Law and Jurisdiction",
    content:
      "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute, controversy, or claim arising out of or relating to these Terms or the breach, termination, or validity thereof shall be subject to the exclusive jurisdiction of the competent courts located in Chennai, Tamil Nadu, India. You hereby irrevocably consent to the personal jurisdiction of such courts.",
  },
  {
    title: "14. Changes to These Terms",
    content:
      "We reserve the right to revise these Terms at any time. When we make changes, we will update the effective date at the top of this page and, where the changes are material, provide reasonable notice to you through our platform or by email. Your continued use of our Services after the revised Terms have been posted constitutes your acceptance of the updated Terms. If you do not agree to the revised Terms, you must discontinue use of our Services.",
  },
  {
    title: "15. Contact Information",
    content: "If you have any questions or concerns regarding these Terms and Conditions, please contact us at:",
    contact: true,
  },
];

const TermsAndConditionsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="bg-dred h-[65px] md:h-[70px] flex items-center justify-center">
        <h1 className="text-2xl text-white pb-0 mb-0">Terms &amp; Conditions</h1>
      </section>

      {/* Document Body */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Preamble */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Effective Date: January 1, 2025</p>
            <p className="leading-relaxed ">
              Please read these Terms and Conditions carefully before accessing or using any services offered by{" "}
              <span className="font-semibold text-gray-900">Repute Real Estate</span>. These Terms govern your use of our
              website, mobile application, and all related services. By creating an account, submitting an inquiry, or
              otherwise using our platform, you confirm that you have read, understood, and agree to be legally bound by
              these Terms and our Privacy Policy.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-5 last:border-0">
                <h2 className="font-semibold section-in-ti mb-3">{section.title}</h2>
                {section.content && (
                  <p className=" leading-relaxed mb-3">{section.content}</p>
                )}
                {section.list && (
                  <ul className="space-y-1 mt-3">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex gap-3 leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.contact && (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium text-gray-900">Company:</span> Repute Real Estate</p>
                    <p><span className="font-medium text-gray-900">Email:</span> legal@reputerealestate.com</p>
                    <p><span className="font-medium text-gray-900">Phone:</span> +91 00000 00000</p>
                    <p><span className="font-medium text-gray-900">Address:</span> No. 1, Business Avenue, Chennai, Tamil Nadu – 600001, India</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Repute Real Estate. All rights reserved. These Terms and Conditions
              constitute the entire agreement between you and Repute Real Estate with respect to your use of the Services.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
};

export default TermsAndConditionsPage;
