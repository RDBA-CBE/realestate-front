import PropertyListClient from "@/components/real-estate/property-list/PropertyListClient";

export const metadata = {
  title: "Properties for Sale and Lease | Boom Realty",
  description:
    "Browse verified residential and commercial properties with filters for location, type, price, bedrooms, developers, projects, and amenities.",
  alternates: {
    canonical: "/property-list",
  },
};

export default function PropertyListPage() {
  return <PropertyListClient />;
}

