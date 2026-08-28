import TermsAndConditionsPage from "@/components/real-estate/pageCompoenents/TermsAndConditionsPage";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions governing your use of Boom Realty's platform and services.",
  alternates: { canonical: "/terms" },
  robots: { index: false, follow: false },
};

export default function Terms() {
  return <TermsAndConditionsPage />;
}
