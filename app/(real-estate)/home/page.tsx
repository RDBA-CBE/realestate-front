import HomePageNew from "@/components/real-estate/pageCompoenents/HomePageNew";

export const metadata = {
  title: "Home | Find Properties for Sale & Lease",
  description:
    "Explore verified residential and commercial properties across India. Search apartments, villas, plots, and more with Boom Realty.",
  alternates: { canonical: "/home" },
  openGraph: {
    title: "Boom Realty | Find Properties for Sale & Lease",
    description:
      "Explore verified residential and commercial properties across India.",
    url: "/home",
    type: "website",
  },
};

export default function HomePage() {
  return <HomePageNew />;
}
