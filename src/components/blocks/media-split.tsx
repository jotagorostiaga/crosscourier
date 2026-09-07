import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { ArrowLink } from "@/components/ui/button";
import { media } from "@/lib/media";
import type { MediaKey } from "@/lib/media";
import { cn } from "@/lib/utils";

export function MediaSplit({
  title,
  body,
  image,
  alt,
  href,
  linkLabel,
  reverse,
  tone = "bg",
  ratio = "4/3",
  children,
}: {
  title: string;
  body: ReactNode;
  image: MediaKey;
  alt: string;
  href: string;
  linkLabel: string;
  reverse?: boolean;
  tone?: "bg" | "surface";
  ratio?: "4/3" | "3/4" | "1/1";
  children?: ReactNode;
}) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal
            className={cn(
              "lg:col-span-6",
              reverse ? "lg:order-2 lg:col-start-7" : "lg:order-1",
            )}
          >
            <h2 className="max-w-[18ch] text-title">{title}</h2>
            <div className="mt-5 max-w-[52ch] space-y-4 text-lead text-fg-muted">
              {body}
            </div>
            {children}
            <ArrowLink href={href} className="mt-8">
              {linkLabel}
            </ArrowLink>
          </Reveal>

          <Reveal
            delay={0.1}
            className={cn(
              "lg:col-span-6",
              reverse ? "lg:order-1 lg:col-start-1" : "lg:order-2",
            )}
          >
            <div
              className="relative overflow-hidden rounded-panel bg-surface-2"
              style={{ aspectRatio: ratio }}
            >
              <Image
                src={media(image)}
                alt={alt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
