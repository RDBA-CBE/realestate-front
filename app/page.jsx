import { redirect } from "next/navigation";

export const metadata = {
  title: "Boom Realty | Find Properties for Sale & Lease",
  description:
    "Discover verified residential and commercial properties for sale and lease across India. Browse apartments, villas, plots, and more on Boom Realty.",
  alternates: { canonical: "/" },
};

export default function RootPage() {
  redirect("/home");
}
