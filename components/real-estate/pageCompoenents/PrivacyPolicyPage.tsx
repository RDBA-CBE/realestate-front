"use client";

import React from "react";

const sections = [
  {
    title: "1. Information We Collect",
    content: "We collect information you provide directly to us, as well as information generated through your use of our Services. The categories of information we collect include:",
    list: [
      "Personal Identification Information: full name, email address, phone number, and postal address provided during registration or inquiry.",
      "Property Preference Data: search history, saved listings, preferred locations, budget range, and property type selections.",
      "Usage and Technical Data: IP address, browser type and version, device identifiers, pages visited, time and date of access, and referring URLs.",
      "Communication Data: messages, inquiries, and correspondence submitted through our platform.",
      "Cookies and Tracking Technologies: session data and behavioral analytics to enhance your browsing experience.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: "We use the information we collect for the following purposes:",
    list: [
      "To create, manage, and maintain your user account and provide access to our Services.",
      "To match you with relevant property listings based on your stated preferences and search behavior.",
      "To facilitate communication between buyers, sellers, tenants, landlords, and agents.",
      "To send transactional notifications, service updates, and alerts relevant to your account activity.",
      "To improve, personalize, and optimize the functionality and content of our platform.",
      "To conduct internal analytics, research, and reporting to enhance our Services.",
      "To comply with applicable legal obligations and enforce our Terms and Conditions.",
      "To send promotional communications and newsletters, where you have provided consent.",
    ],
  },
  {
    title: "3. How We Share Your Information",
    content: "We do not sell your personal information. We may share your information only in the following circumstances:",
    list: [
      "With Property Professionals: agents, developers, and landlords as necessary to fulfil your property inquiry or transaction.",
      "With Service Providers: third-party vendors engaged to operate, maintain, or support our platform, subject to confidentiality obligations.",
      "For Legal Compliance: when required by law, regulation, court order, or governmental authority.",
      "In Business Transfers: in connection with a merger, acquisition, restructuring, or sale of assets, where your information may be transferred as a business asset.",
      "With Your Consent: for any purpose where you have given explicit prior consent.",
    ],
  },
  {
    title: "4. Cookies and Tracking Technologies",
    content: "We use cookies, web beacons, and similar tracking technologies to operate and improve our Services. Cookies allow us to recognise your browser, retain your preferences, and analyse usage patterns. You may control cookie settings through your browser; however, disabling certain cookies may affect the functionality of our Services. We use the following types of cookies:",
    list: [
      "Essential Cookies: necessary for the operation of our platform, including session management and security.",
      "Analytical Cookies: used to understand how visitors interact with our Services and to measure performance.",
      "Preference Cookies: used to remember your settings, language preferences, and customisations.",
      "Marketing Cookies: used to deliver relevant advertisements and track campaign effectiveness, where applicable.",
    ],
  },
  {
    title: "5. Data Retention",
    content: "We retain your personal information for as long as is necessary to fulfil the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by applicable law. When your information is no longer required, we will securely delete or anonymise it in accordance with our data retention procedures.",
  },
  {
    title: "6. Security of Your Data",
    content: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. These measures include encrypted data transmission, access controls, and regular security assessments. However, no method of transmission over the internet or electronic storage is entirely secure. We cannot guarantee the absolute security of your information and encourage you to take appropriate precautions when sharing data online.",
  },
  {
    title: "7. Your Data Protection Rights",
    content: "Subject to applicable law, you may have the following rights with respect to your personal information:",
    list: [
      "Right of Access: the right to request a copy of the personal information we hold about you.",
      "Right of Rectification: the right to request correction of inaccurate or incomplete personal information.",
      "Right to Erasure: the right to request deletion of your personal information under certain conditions.",
      "Right to Restrict Processing: the right to request that we limit how we use your information.",
      "Right to Data Portability: the right to receive your information in a structured, machine-readable format.",
      "Right to Object: the right to object to processing of your personal information for direct marketing or other purposes.",
      "Right to Withdraw Consent: the right to withdraw consent at any time where processing is based on consent, without affecting the lawfulness of prior processing.",
    ],
  },
  {
    title: "8. Third-Party Links",
    content: "Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of such third parties. We encourage you to review the privacy policies of any third-party sites you visit.",
  },
  {
    title: "9. Children's Privacy",
    content: "Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that personal information has been submitted by a person under the age of 18, we will take steps to delete such information promptly.",
  },
  {
    title: "10. Changes to This Privacy Policy",
    content: "We reserve the right to update or modify this Privacy Policy at any time. When we make material changes, we will update the effective date at the top of this page and, where appropriate, notify you by email or through a notice on our platform. Your continued use of our Services following the posting of changes constitutes your acceptance of the revised Privacy Policy. We encourage you to review this page periodically.",
  },
  {
    title: "11. Contact Us",
    content: "If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us at:",
    contact: true,
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <section className="bg-dred h-[65px] md:h-[70px] flex items-center justify-center">
        <h1 className="text-2xl text-white pb-0 mb-0">Privacy Policy</h1>
      </section>

      {/* Document Body */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Preamble */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Effective Date: January 1, 2025</p>
            <p className=" leading-relaxed ">
              This Privacy Policy (&ldquo;Policy&rdquo;) describes how <span className="font-semibold text-gray-900">Repute Real Estate</span> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, discloses, and safeguards your personal information when you access or use our website, mobile application, and related services (collectively, the &ldquo;Services&rdquo;). Please read this Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by the terms of this Policy.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-8 last:border-0">
                <h2 className="section-in-ti font-semibold  mb-3">{section.title}</h2>
                {section.content && (
                  <p className=" leading-relaxed mb-3">{section.content}</p>
                )}
                {section.list && (
                  <ul className="space-y-2 mt-3">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex gap-3  leading-relaxed">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.contact && (
                  <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium text-gray-900">Company:</span> Repute Real Estate</p>
                    <p><span className="font-medium text-gray-900">Email:</span> privacy@reputerealestate.com</p>
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
              &copy; {new Date().getFullYear()} Repute Real Estate. All rights reserved. This document constitutes the entire privacy policy of Repute Real Estate with respect to the Services described herein.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
