"use client";

import React from "react";

const sections = [
  {
    title: "1. Personal Data we collect:",
    content:
      "We collect the following types of Personal Data about you when you access our Platform or Services:",
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
    content:
      "We do not sell your personal information. We may share your information only in the following circumstances:",
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
    content:
      "We use cookies, web beacons, and similar tracking technologies to operate and improve our Services. Cookies allow us to recognise your browser, retain your preferences, and analyse usage patterns. You may control cookie settings through your browser; however, disabling certain cookies may affect the functionality of our Services. We use the following types of cookies:",
    list: [
      "Essential Cookies: necessary for the operation of our platform, including session management and security.",
      "Analytical Cookies: used to understand how visitors interact with our Services and to measure performance.",
      "Preference Cookies: used to remember your settings, language preferences, and customisations.",
      "Marketing Cookies: used to deliver relevant advertisements and track campaign effectiveness, where applicable.",
    ],
  },
  {
    title: "5. Data Retention",
    content:
      "We retain your personal information for as long as is necessary to fulfil the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by applicable law. When your information is no longer required, we will securely delete or anonymise it in accordance with our data retention procedures.",
  },
  {
    title: "6. Security of Your Data",
    content:
      "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. These measures include encrypted data transmission, access controls, and regular security assessments. However, no method of transmission over the internet or electronic storage is entirely secure. We cannot guarantee the absolute security of your information and encourage you to take appropriate precautions when sharing data online.",
  },
  {
    title: "7. Your Data Protection Rights",
    content:
      "Subject to applicable law, you may have the following rights with respect to your personal information:",
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
    content:
      "Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of such third parties. We encourage you to review the privacy policies of any third-party sites you visit.",
  },
  {
    title: "9. Children's Privacy",
    content:
      "Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that personal information has been submitted by a person under the age of 18, we will take steps to delete such information promptly.",
  },
  {
    title: "10. Changes to This Privacy Policy",
    content:
      "We reserve the right to update or modify this Privacy Policy at any time. When we make material changes, we will update the effective date at the top of this page and, where appropriate, notify you by email or through a notice on our platform. Your continued use of our Services following the posting of changes constitutes your acceptance of the revised Privacy Policy. We encourage you to review this page periodically.",
  },
  {
    title: "11. Contact Us",
    content:
      "If you have any questions, concerns, or requests regarding this Privacy Policy or the handling of your personal information, please contact us at:",
    contact: true,
  },
];

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white privacy">
      {/* Header Banner */}
      <section className="bg-dred h-[65px] md:h-[70px] flex items-center justify-center">
        <h1 className="text-2xl text-white pb-0 mb-0">Privacy Policy</h1>
      </section>

      {/* Document Body */}
      <section className="section-pad">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Preamble */}
          <div className="mb-10 pb-8 border-b border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              Effective Date: January 1, 2025
            </p>
            <p className=" leading-relaxed ">
              We, at Repute Real Estate and our affiliated companies worldwide,
              are committed to respecting your online privacy and recognize your
              need for appropriate protection and management of any personally
              identifiable information you share with us.
              <br /> <br />
              This Privacy Policy <strong> (“Policy”) </strong> governs our
              website available at <strong>(www.boomrealtys.com)</strong> and
              our mobile application (collectively, the
              <strong> “Platform”)</strong>. The Policy describes how Repute
              Real Estate (hereinafter referred to as the{" "}
              <strong>“Company”)</strong> collects, uses, discloses and
              transfers personal data of users while browsing the Platform or
              availing specific services therein (the{" "}
              <strong>“Services”)</strong>.
              <br /> <br />
              This Policy describes how we process personal data of all users of
              our Platform or Services, including buyers, renters, owners,
              dealers, brokers and website visitors.
              <br /> <br />
              <strong>“Personal Data”</strong> means any data about an
              individual who is identifiable by or in relation to such data.
              <br /> <br />
              By providing your consent to this Policy, either on
              the Platform or through other means, or accessing
              the Platform and Services, you consent to the Company’s processing
              of your Personal Data in accordance with this Policy. Where
              required, for processing your Personal Data for distinct purposes,
              we seek your consent separately on the Platform or through other
              means.
            </p>
            <p className="leading-relaxed mb-3">
              This Privacy Policy is divided into the following sections
            </p>
            <ul className="space-y-2 mt-3">
              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Personal Data We Collect</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>How We Use Your Personal Data</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Who We Share Your Personal Data With</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Data Storage and Retention</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Your Rights</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Data Protection Practices</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Third-Party Websites, Apps and Services</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Children</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>Changes to the Privacy Policy</span>
              </li>

              <li className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                <span>How to Contact Us – Grievance Officer</span>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold  mb-3">
                1. Personal Data we collect:
              </h2>

              <p className=" leading-relaxed mb-3">
                We collect the following types of Personal Data about you when
                you access our Platform or Services:
              </p>

              <h2 className="section-in-ti font-semibold  mb-3">
                A. Information you give us:
              </h2>

              <p className=" leading-relaxed mb-3">
                We collect information you provide to us directly when you use
                our Platforms (like when you sign-up/ register an account, or
                post a property listings). We may also collect this information
                over calls, emails, messages, or other communications
                established with you to create, update or maintain your details
                on the Platform. Further, we may also collect this information
                when you provide it by filling out relevant forms to express
                your interest in availing our Services. This information
                includes:
              </p>

              <ul className="space-y-2 mt-3">
                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Personal Details:</strong> This includes your name,
                    contact information (such as address, email address, phone
                    number), and login information (such as username).
                  </span>
                </li>

                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Property Details:</strong> This includes property
                    type, location, area, dimensions, road connectivity,
                    photographs, pricing, and available amenities.
                  </span>
                </li>

                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Identification Documents:</strong> This includes
                    identity proofs (such as Aadhaar, PAN, Passport, Voter ID,
                    Driving License) and property documents (such as sale deed,
                    registration, utility bills, and property tax records).
                  </span>
                </li>

                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Payment Information:</strong> Payments are processed
                    through third-party payment providers. We receive
                    transaction details but do not store or access your bank
                    account, card, or UPI information.
                  </span>
                </li>

                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Communication Details:</strong> This includes
                    records of calls, emails, messages, feedback, support
                    requests, and other communications with us.
                  </span>
                </li>

                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Voice Recordings:</strong> If you add voiceovers to
                    property listings or videos, we may collect and process your
                    voice recordings for playback.
                  </span>
                </li>

                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>
                    <strong>Other Information:</strong> Any additional
                    information you voluntarily provide with your consent,
                    permissions, or preferences.
                  </span>
                </li>
              </ul>
            </div>

            {/* 1B */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">B. Information we collect when you use our Platforms:</h2>
              <p className="leading-relaxed mb-3">
                When you use our Platforms, we collect certain types of Information about how you use or access our Platforms. This includes:
              </p>
              <ul className="space-y-2 mt-3">
                {[
                  ["Usage data", "Data collected and processed about you when you access the Platform, such as your search queries, intent capture, your account settings, times at which you access the Platforms, time spent on certain pages, inferences of your interests and preferences based on your usage."],
                  ["Technical data", "Technical data may include data about the devices, software and technology you use such as hardware model, operating system, IP address, preferred languages, unique device identifiers, advertising identifiers, serial numbers, device motion data, network data and web browser details."],
                  ["General or approximate location data", "General location data, such as your city, region, or country. This may be understood from technical data such as your IP address."],
                  ["Communication data", "When you communicate with the Platform or use the Platform to communicate with other members (such as other users, advertisers, dealers and builders etc.), the Company collects and stores information about your communication and any other information you provide."],
                  ["Cookies data", "We use cookies or other similar technologies (like web beacons, log files, etc.) to recognize your device, remember you and support the continuity of your experience. Cookies are files which are downloaded to your device when you access our website or web apps."],
                  ["Purchase or transactional data", "Transactional details, such as details about your purchase orders and the payments to and from your accounts with us. However, we do not store and do not have access to your financial information such as your bank account numbers, credit/ debit card numbers, or UPI handle."],
                  ["App-specific permissions", "This includes permissions for Notifications, Camera, Location, Phone (Dialer), Photos and videos on mobile devices. Most app-specific permissions require manual approval by you. If you have given the Platform access to non-essential permissions, but wish to turn them off, you can do so through your phone's settings. The app may not function in case you revoke certain essential app permissions."],
                  ["Insight data", "We may use your data to derive insights into your usage of our Platform."],
                ].map(([label, text]) => (
                  <li key={label} className="flex gap-3 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                    <span><strong>{label}:</strong> {text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 1C */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">C. Information we receive from other sources:</h2>
              <p className="leading-relaxed mb-3">
                We may receive information about you from third parties, such as, advertising and marketing partners. We may collect your information through property campaigns and publicly available sources.
              </p>
              <p className="leading-relaxed">
                We may also receive information from third parties, when you use a third-party account, like SSO/MFA/2FA providers, to log in or upload information to the Platform. This information may include name, email, phone number, location.
              </p>
            </div>

            {/* Section 2 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">2. How we use your Personal Data:</h2>
              <p className="leading-relaxed mb-3">The Platform may process your Personal Data for the following purposes:</p>

              <h2 className="section-in-ti font-semibold mb-3">A. Provision of the Platform and Services:</h2>
              <p className="leading-relaxed mb-3">We use your Personal Data to provide the Services and access to Platform, and to enable you to use the various features of the Platforms. For instance, we may use your data</p>
              <ul className="space-y-2 mt-3 mb-6">
                {[
                  "for account creation, onboarding and registration purposes.",
                  "for listing your properties or for properties which you are authorised to advertise or extending the listing of your properties on the Platform or for recording your interest in a particular property or type of properties.",
                  "for establishing connectivity with other members of the Platform (such as other users, advertisers, dealers and builders, banks, NBFCs, banking agents, etc.) or for enabling other members of the Platform to contact you for a reasonable period from the last activity on the Platform.",
                  "for giving visibility into your profile and property listing to other users of the Platform; or for providing you with relevant details of a particular property or types of properties.",
                  "for generating or providing voiceover playbacks in video property listings.",
                  "for providing you customized search results or for recommending users or properties or advertisers or for purchase by advertiser that might be relevant to you or your interest.",
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {[
                ["B. Our marketing activities:", "We may use Personal Data to provide you marketing and promotional material and notify you of discounts and offers, about our Platform and Services or about third-party services, if you've consented to receive such communication from us."],
                ["C. Third-party marketing activities:", "Based on your expression of interest, that we receive from you, we may share your Personal Data with third-parties (like banks, NBFCs, banking agents, etc.) - so that they can contact you for their own promotional/marketing purposes."],
                ["D. For Platform and Service improvement:", "We may use Personal Data to improve our Platform and its content, to ideate, develop and provide new or better Platform features or Services. We may also use Personal Data for providing a better user experience on the Platform and to personalize the Platform for improving your usability. The Platform uses YouTube API services. In order to check the performance of a video we may track the video play, pause, mute/unmute action performed by the user on the Platform."],
                ["E. For fraud prevention:", "We may use Personal Data for identifying suspicious users or property listings on the Platform, for verifying users and property listings, for ensuring network security; and to prevent, detect, investigate and prosecute crimes (including but not limited to fraud and other financial crimes) on the Platform."],
                ["F. For troubleshooting and recovery:", "We may use your Personal Data to troubleshoot issues or problems with the Platform or Services and for maintaining adequate back-ups to ensure high availability, and aid in disaster recovery."],
                ["G. Analytics Operations:", "We may collect and use analytics information together with your Personal Data to build a broader profile of our users so that the Company can serve you better and provide custom, personalized content, and information."],
                ["H. Legal Obligation:", "In some cases, the Company will need to collect Personal Data to comply with any legal obligation and to establish, exercise or defend legal rights in connection with legal proceedings and seeking professional or legal advice in relation to such legal proceedings, and to protect the safety and integrity of our Platforms."],
                ["I. For communicating with you:", "We use your personal data to respond to your queries, comments, or feedback, resolve issues faced by you on a Platform or related to a product or service, and to implement your suggestions. We may also be contacting you in relation to providing you access to the Platform or for helping you use the Platform or the Services."],
                ["J. For grievance redressal:", "We may use your Personal Data to address your grievances and to respond to your complaints."],
              ].map(([label, text]) => (
                <div key={label} className="mb-4">
                  <h2 className="section-in-ti font-semibold mb-2">{label}</h2>
                  <p className="leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            {/* Section 3 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">3. Cookies:</h2>
              <p className="leading-relaxed mb-3">
                Some of our web pages utilize &quot;Cookies&quot; and other tracking technologies. A Cookie is a small text file that may be used, for example, to collect information about web-site activity. Some cookies and other technologies may serve to recall Personal Data previously indicated by a user.
              </p>
              <p className="leading-relaxed mb-3">
                Most browsers allow you to control cookies, including whether or not to accept them and how to remove them. You may set most browsers to notify you if you receive a cookie, or you may choose to block cookies with your browser, but please note that if you choose to erase or block your cookies, your experience on our platform might be affected.
              </p>
              <p className="leading-relaxed">
                Tracking technologies may record information such as Internet domain and host names; Internet protocol (IP) addresses; browser software and operating system types; clickstream patterns; and dates and times that our site is accessed. Our use of cookies and other tracking technologies allows us to improve our Platform and the overall website experience. We may also analyse information that does not contain Personal Information for trends and statistics.
              </p>
            </div>

            {/* Section 4 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">4. Who we share your personal data with:</h2>
              <h2 className="section-in-ti font-semibold mb-3">A. Information you give us:</h2>
              <p className="leading-relaxed mb-3">
                The Company may disclose Personal Data only for the purposes explained in this Privacy Policy, with the following third parties:
              </p>
              <ul className="space-y-2 mt-3">
                {[
                  ["Service Providers", "The Company may disclose Personal Data (overriding NDNC registration) with service providers, vendors, consultants, agents, field verifiers, or others who assist the Company in operating the Platform or providing the Services. This may include entities engaged in delivering programs, products, information, generating voiceover playbacks for video listings and Services, maintenance of the Platform and mailing lists, verifying properties."],
                  ["Other Platform users", "The Company may share your information with other users of the Platform, such as owners, renters, brokers, dealers, etc. to establish connectivity with such other users of the Platform. The other users of the Platform may be able to access your contact details to communicate with you, regarding your property listing or your interest in a particular property or type of properties."],
                  ["Banking Partners", "The Company may share your Personal Data with participating banks, NBFCs, their employees or their agents (banking agents), based on your expression of interest regarding home loans. The banking partners may contact you to offer their products or services."],
                  ["Legal Purpose", "The Company shares personal data when required by law, such as responding to subpoenas, court orders, or legal process, or to establish or exercise legal rights or defending against legal claims."],
                  ["Corporate Restructuring", "The Company may share personal data with another Company pursuant to any corporate re-organization, amalgamation or restructuring. In this event, the Company will notify you before information about you is transferred and becomes subject to a different privacy policy."],
                  ["Other Third Parties", "The Company may share your Personal Data with other third parties, on a need-to-know basis, such as accountants, lawyers, auditors, etc."],
                ].map(([label, text]) => (
                  <li key={label} className="flex gap-3 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                    <span><strong>{label}:</strong> {text}</span>
                  </li>
                ))}
              </ul>
              <p className="leading-relaxed mt-4">
                Please note that the Platform sometimes displays advertisements or contains links to third party websites that may collect personal data, and those are not governed by this Policy. The Company will not be responsible for the privacy practices of such websites. The Company recommends that you review the privacy policy of each third-party site linked from the Platform to determine their use of your Personal Data.
              </p>
            </div>

            {/* Section 5 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">5. User Rights:</h2>
              <ul className="space-y-3">
                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>If you wish to access, verify, correct, complete, update or erase any of your Personal Data collected through the Platforms or Services, you may write to us at (email_id).</span>
                </li>
                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>You may withdraw your consent for any or all processing of your Personal Data by sending a mail to (email). Do note however, that the Company reserves the right to refuse to provide you access to the Platform and Services in circumstances where such Personal Data is essential to the provision of the Platform and Services.</span>
                </li>
                <li className="flex gap-3 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dred flex-shrink-0" />
                  <span>We (or our service providers or partners) may communicate with you through voice calls, text messages, emails, Platform notifications, or other means. You may opt out of receiving information about promotional offers by writing to our grievance officer. We may still need to send you non-promotional communication (information about the Platforms and Services).</span>
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                Please note that the Platform sometimes displays advertisements or contains links to third party websites that may collect personal data, and those are not governed by this Policy. The Company will not be responsible for the privacy practices of such websites. The Company recommends that you review the privacy policy of each third-party site linked from the Platform to determine their use of your Personal Data.
              </p>
            </div>

            {/* Section 6 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">6. Storage and Protection of personal data:</h2>
              <p className="leading-relaxed mb-3">
                Our Company is located in India. We store and process your personal data in India. However, we may transfer your personal data to our service providers or partners in other parts of the world.
              </p>
              <p className="leading-relaxed mb-3">
                The security and confidentiality of your personal data is important to us and Company has invested significant resources to protect the safekeeping and confidentiality of your Personal Data. When using external service providers acting as processors, the Company requires that they adhere to the same standards as the Platform. Regardless of where your Personal Data is transferred or stored, the Company take all steps reasonably necessary to ensure that personal data is kept secure.
              </p>
              <p className="leading-relaxed">
                The Company has physical, electronic, and procedural safeguards that comply with the laws prevalent in India to protect Personal Data and take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data.
              </p>
            </div>

            {/* Section 7 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">7. Retention of personal data:</h2>
              <p className="leading-relaxed mb-3">
                Your personal data is processed and retained to enable your access or use of the Platform and Services. We will keep your Personal Data as long as it is necessary to provide you Services on the Platform or for the purposes for which the data was obtained.
              </p>
              <p className="leading-relaxed">
                To ensure compliance with applicable laws or other legal obligations, or to exercise our legal rights, we may need to retain information even after you have requested us to erase your personal data, terminated your account with us, or stopped using the Platform. We may also keep your contact information and other details for fraud prevention, for the exercise/defense of a legal claim, or for providing evidence in legal proceedings, maintaining accurate accounting, financial, and other operational records, resolving disputes, and enforcing the Company&apos;s agreements. Post termination, we may continue to store, use, and share aggregated anonymized data for any purpose. Anonymized data cannot be used to identify you.
              </p>
            </div>

            {/* Section 8 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">8. Third party websites, apps, and services:</h2>
              <p className="leading-relaxed mb-3">
                The Platform may contain links to third party websites, apps, or services, such as websites of our partners, or third-party websites that contain informational or other content. This Privacy Policy does not apply to collection, use, storage, sharing, etc. by third parties when you visit or interact with their websites or services, even if they are our partners and display our branding on their website or service. Data collected by third parties is subject to their own privacy policies and privacy practices such as the Privacy Policy of Google (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-dred underline">link</a>). You may control the display of your content by using settings available at Google&apos;s security settings page (<a href="https://myaccount.google.com/connections?filters=3,4&hl=en" target="_blank" rel="noopener noreferrer" className="text-dred underline">link</a>).
              </p>
              <p className="leading-relaxed">
                We (and any other affiliate; or any of our Company directors, officers, agents, contractors, sub-contractors or workers) have no responsibility or liability for the content, activities and services relating to those linked websites, and for data collection, use, storage, sharing, etc. by third parties.
              </p>
            </div>

            {/* Section 9 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">9. Children:</h2>
              <p className="leading-relaxed">
                The Platform is not intended for use by children under 18 years of age. Any use of Platform by a child under the age of 18 years must be under parental supervision. We do not knowingly collect any information about, or market to, children, minors or anyone under the age of 18. If you are less than 18 years old, we request that you do not visit or use the Platforms, and that you do not submit any Personal Data to us.
              </p>
            </div>

            {/* Section 10 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">10. Changes to this Privacy Policy:</h2>
              <p className="leading-relaxed">
                The Platform reserves the right to update, change or modify this Policy at any time. The Policy shall come to effect from the date of such update, change or modification.
              </p>
            </div>

            {/* Section 11 */}
            <div className="border-b border-gray-100 pb-8 last:border-0">
              <h2 className="section-in-ti font-semibold mb-3">11. Grievance Redressal:</h2>
              <p className="leading-relaxed mb-4">
                Questions, concerns or complaints related to the processing of your Personal Data may be made to the Grievance Officer appointed by the Company. In case of any grievances please contact:
              </p>
            </div>

            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 space-y-1">
              <p>
                <span className="font-medium text-gray-900">Company:</span>{" "}
                Boom Realtys
              </p>
              <p>
                <span className="font-medium text-gray-900">Email:</span>{" "}
                info@boomrealtys.com
              </p>
              
              {/* <p>
                <span className="font-medium text-gray-900">Address:</span> No.
                1, Business Avenue, Chennai, Tamil Nadu – 600001, India
              </p> */}
            </div>
          </div>

          {/* Footer Note
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} Repute Real Estate. All rights
              reserved. This document constitutes the entire privacy policy of
              Repute Real Estate with respect to the Services described herein.
            </p>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
