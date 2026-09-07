import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  tone = "light",
  className,
  priority,
}: {
  tone?: "light" | "ink";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="CrossCourier, ir al inicio"
    >
      <Image
        src={tone === "ink" ? "/brand/crosscourier-light.png" : "/brand/crosscourier.png"}
        alt="CrossCourier"
        width={460}
        height={77}
        priority={priority}
        className="h-6 w-auto md:h-[26px]"
      />
    </Link>
  );
}
