import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MinistryDetail } from "@/components/ministry/MinistryDetail";
import { ministries } from "@/data/ministries";

export function generateStaticParams() {
  return ministries.map((ministry) => ({ slug: ministry.id }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const ministry = ministries.find((m) => m.id === slug);
    if (!ministry) return {};
    return {
      title: ministry.name,
      description: ministry.description,
      openGraph: {
        title: `${ministry.name} | Hisdayspring Ministries International`,
        description: ministry.description,
        images: ministry.imageUrl ? [{ url: ministry.imageUrl }] : [],
      },
    };
  });
}

export default async function MinistryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ministry = ministries.find((m) => m.id === slug);
  if (!ministry) notFound();

  return <MinistryDetail ministry={ministry} />;
}
