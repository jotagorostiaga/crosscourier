import type { Metadata } from "next";
import { DirectionHub } from "@/components/blocks/direction-hub";

export const metadata: Metadata = {
  title: "Exportar: courier aéreo y Exporta Simple",
  description:
    "Enviá muestras, documentación o productos al exterior con la modalidad adecuada para cada operación. Te ayudamos a definir el encuadre.",
  alternates: { canonical: "/exportar" },
};

export default function Page() {
  return <DirectionHub direction="exportar" />;
}
