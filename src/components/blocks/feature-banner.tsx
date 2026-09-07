import type { ReactNode } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { media } from "@/lib/media";
import type { MediaKey } from "@/lib/media";
import { cn } from "@/lib/utils";

/**
 * Banner fotográfico contenido: titular, bajada y una sola acción sobre una
 * pieza con puntas redondeadas. Se usa para los momentos en que la página
 * necesita cambiar de registro y empujar una decisión, no para decorar.
 *
 * El degradado no es estético: garantiza contraste del texto sobre cualquier
 * foto, así la tipografía nunca queda peleando con la imagen.
 */
export function FeatureBanner({
  eyebrow,
  title,
  body,
  cta,
  ctaHref,
  image,
  alt = "",
  height = "default",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  body: ReactNode;
  cta: string;
  ctaHref: string;
  image: MediaKey;
  alt?: string;
  height?: "default" | "tall";
  className?: string;
}) {
  return (
    <section className={cn("bg-bg py-10 md:py-14", className)}>
      <Container>
        <Reveal>
          <div
            className={cn(
              "relative isolate flex overflow-hidden rounded-[clamp(1.25rem,2vw,2rem)] bg-surface-ink text-on-ink",
              height === "default"
                ? "min-h-[26rem] md:min-h-[30rem]"
                : "min-h-[32rem] md:min-h-[38rem]",
            )}
          >
            <Image
              src={media(image)}
              alt={alt}
              aria-hidden={alt === "" ? true : undefined}
              fill
              sizes="(max-width: 1240px) 100vw, 1160px"
              className="object-cover object-center"
            />
            {/* Dos capas: una vertical para mobile y una horizontal para desktop. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,28,34,0.92),rgba(20,28,34,0.45)_65%,rgba(20,28,34,0.25))] md:bg-[linear-gradient(100deg,rgba(20,28,34,0.94)_12%,rgba(20,28,34,0.72)_46%,rgba(20,28,34,0.12)_88%)]"
            />

            <div className="relative flex w-full flex-col justify-end p-7 sm:p-10 md:max-w-[38rem] md:justify-center md:p-14">
              {eyebrow ? (
                <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-orange uppercase">
                  {eyebrow}
                </p>
              ) : null}
              <h2 className="mt-4 max-w-[18ch] text-[clamp(1.85rem,1.1rem+2.2vw,3rem)] leading-[1.06] tracking-[-0.035em]">
                {title}
              </h2>
              <div className="mt-5 max-w-[46ch] space-y-3 text-lead text-on-ink-muted">
                {body}
              </div>
              <div className="mt-8">
                <Button href={ctaHref} size="lg" withArrow>
                  {cta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
