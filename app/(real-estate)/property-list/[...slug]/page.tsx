import PropertyListClient from "@/components/real-estate/property-list/PropertyListClient";
import { titleFromSlug, SITE_URL } from "@/utils/seo.utils";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const label = slug.map(titleFromSlug).join(" ");

  return {
    title: `${label} Properties | Boom Realty`,
    description: `Browse ${label.toLowerCase()} properties with verified listings, useful filters, images, location details, and developer information.`,
    alternates: {
      canonical: `/property-list/${slug.join("/")}`,
    },
  };
}

export default async function PropertyListSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const slugStr = Array.isArray(slug) ? slug.join("/") : slug;
  const jobUrl = `${SITE_URL}/property-list/${slugStr}`;

  return <PropertyListClient jobUrl={jobUrl} slug={slugStr} />;
}
