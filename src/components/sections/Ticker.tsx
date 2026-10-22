import { artist } from "@/content/artist";
import { SoundRoll } from "@/components/motion/SoundRoll";

/**
 * Prelude between the hero and the music (desktop): three facts, then the
 * sound in words rolling past, so visitors know what the music is. On phones
 * the roll lives at the bottom of the hero instead and this section is hidden.
 */
export function Ticker() {
  return (
    <section aria-label="Latest and the sound" className="hidden overflow-hidden bg-ink pt-14 pb-24 text-paper md:block">
      <div className="wrap">
        {/* The 1px gaps over a faint background draw the dividers between facts. */}
        <dl className="grid grid-cols-3 gap-px bg-paper/12">
          {artist.facts.map((fact) => (
            <div key={fact.label} className="bg-ink px-6 py-2 first:pl-0">
              <dt className="label opacity-55">{fact.label}</dt>
              <dd className="mt-2 font-display text-lg tracking-[-0.01em]">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p aria-hidden="true" className="label wrap mt-12 flex items-center gap-3 opacity-55">
        The sound <span className="h-px w-8 bg-current" />
      </p>
      <SoundRoll media="(min-width: 768px)" className="mt-5" />
    </section>
  );
}
