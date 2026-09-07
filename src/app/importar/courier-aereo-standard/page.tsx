import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServicePage } from "@/components/blocks/service-page";
import { getService } from "@/lib/services";

const SLUG = "/importar/courier-aereo-standard";
const service = getService(SLUG);

export const metadata: Metadata = service
  ? {
      title: service.seoTitle,
      description: service.seoDescription,
      alternates: { canonical: SLUG },
      openGraph: {
        title: service.seoTitle,
        description: service.seoDescription,
        url: SLUG,
      },
    }
  : {};

export default function Page() {
  if (!service) notFound();
  return <ServicePage service={service} />;
}
