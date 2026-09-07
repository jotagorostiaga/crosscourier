type JsonLdData = Record<string, unknown>;

/** Datos estructurados. Se serializan en el servidor, sin JS en el cliente. */
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  const entries = Array.isArray(data) ? data : [data];
  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
    </>
  );
}
