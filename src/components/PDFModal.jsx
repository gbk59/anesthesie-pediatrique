export default function PDFModal({
  pdfOuvert,
  setPdfOuvert,
}) {
  if (!pdfOuvert) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.72)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 9999,

        display: "flex",
        flexDirection: "column",

        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",

          padding: "12px 14px",
          background: "rgba(255,255,255,0.92)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Aide cognitive SFAR
        </div>

        <button
          onClick={() => setPdfOuvert(null)}
          style={{
            border: "none",
            background: "#111827",
            color: "#fff",
            borderRadius: 12,
            padding: "10px 14px",
            fontSize: 14,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Fermer
        </button>
      </div>

      <iframe
        src={pdfOuvert}
        title="PDF"
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          background: "#fff",
        }}
      />
    </div>
  );
}