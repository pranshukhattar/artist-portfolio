// Button styles from the mockup's "button states" panel.
const base =
  "group inline-flex h-11 items-center justify-center gap-3 rounded-full px-5 text-[11px] font-semibold tracking-[0.14em] uppercase whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 ease-out-expo active:scale-[0.98]";

const variants = {
  ink: "bg-ink text-paper hover:bg-red",
  accent: "bg-red text-paper hover:bg-ink",
  outlineInk: "ring-1 ring-ink/60 text-ink hover:bg-ink hover:text-paper",
  // On a red surface: ink by default, flips to paper on hover (never red-on-red).
  onRed: "bg-ink text-paper hover:bg-paper hover:text-ink",
  outlinePaper: "ring-1 ring-paper/60 text-paper hover:bg-paper hover:text-ink",
  disabled: "bg-grey/50 text-ink/45 cursor-not-allowed",
};

export const button = (variant: keyof typeof variants = "ink", extra = "") => `${base} ${variants[variant]} ${extra}`;

/** Arrow that nudges right on hover; pair with `button()`. */
export const arrowNudge = "transition-transform duration-300 ease-out-expo group-hover:translate-x-1";
