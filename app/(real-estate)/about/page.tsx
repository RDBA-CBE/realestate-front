import AboutPage from "@/components/real-estate/pageCompoenents/AboutPage";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Boom Realty — our mission, team, and commitment to helping you find the perfect property across India.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Boom Realty",
    description:
      "Learn about Boom Realty — our mission, team, and commitment to helping you find the perfect property.",
    url: "/about",
    type: "website",
  },
};

export default function About() {
  return <AboutPage />;
}
