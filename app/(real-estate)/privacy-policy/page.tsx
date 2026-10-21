import PrivacyPolicyPage from "@/components/real-estate/pageCompoenents/PrivacyPolicyPage";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read Boom Realty's privacy policy to understand how we collect, use, and protect your personal information.",
  alternates: { canonical: "/privacy-policy" },
  robots: { index: false, follow: false },
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
