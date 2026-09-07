import type { Metadata } from "next";
import { DirectionHub } from "@/components/blocks/direction-hub";

export const metadata: Metadata = {
  title: "Importar: courier aéreo, marítimo y carga internacional",
  description:
    "Traé muestras, repuestos, insumos, tecnología o mercadería desde el exterior. Analizamos tu operación y te decimos qué modalidad corresponde.",
  alternates: { canonical: "/importar" },
};

export default function Page() {
  return <DirectionHub direction="importar" />;
}
