import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PropertyDetailRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/property-list/${slug}`);
}
