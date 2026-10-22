/** Handwritten note in the margin. Always decorative. */
export function Marginalia({ children, className = "" }: { children: string; className?: string }) {
  return (
    <p aria-hidden="true" className={`pointer-events-none font-hand text-[clamp(22px,2.2vw,30px)] leading-[1.05] select-none ${className}`}>
      {children}
    </p>
  );
}
