"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";
import { nav, artist } from "@/content/artist";
import { ScrollTrigger, getLenis, lockScroll, useGSAP } from "@/lib/motion";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/LogoMark";
import { SocialLinks } from "@/components/ui/SocialLinks";

/** Smooth-scroll to an in-page anchor, falling back to native scrolling. */
export function scrollToHash(hash: string, offset = 0) {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(target, { offset });
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset });
}

export function Nav() {
  const menuClose = useRef<HTMLButtonElement>(null);
  const menuOpen = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  // Past the hero, the nav gathers into frosted pills so it reads over anything beneath it.
  const [floating, setFloating] = useState(false);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#top",
      start: "bottom top+=96",
      onEnter: () => setFloating(true),
      onLeaveBack: () => setFloating(false),
    });
  });

  // The pill surfaces keep their padding in both states, so nothing shifts when they fill in.
  const pill = `transition-[background-color,box-shadow] duration-500 ease-out-expo ${
    floating
      ? "bg-ink/72 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_8px_24px_-8px_rgba(0,0,0,0.45)] ring-1 ring-paper/10 backdrop-blur-md"
      : "bg-transparent"
  }`;

  useEffect(() => {
    if (!open) return;
    const opener = menuOpen.current;
    lockScroll(true);
    menuClose.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => scrollToHash(href));
  };

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>

      <header
        className="fixed inset-x-0 top-0 z-40 text-paper"
      >
        <div className="wrap flex h-16 items-center justify-between md:h-20">
          <a href="#top" className={`-ml-1.5 flex h-11 items-center gap-3 rounded-full px-3.5 md:-ml-3.5 ${pill}`} aria-label={`${siteConfig.name}, back to top`}>
            <LogoMark className="h-5 w-auto" />
            <span className="label">{siteConfig.name}</span>
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className={`flex h-11 items-center gap-8 rounded-full px-6 ${pill}`}>
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="label relative py-2 after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-out-expo hover:after:origin-left hover:after:scale-x-100">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={menuOpen}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label="Open menu"
            className={`-mr-0.5 grid size-11 place-items-center rounded-full ${pill}`}
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </header>

      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-ink text-paper transition-[clip-path] duration-700 ease-out-expo ${open ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(0_0_100%_0)]"}`}
      >
        <div className="wrap flex h-16 items-center justify-between md:h-20">
          <LogoMark className="h-5 w-auto" />
          <button ref={menuClose} type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center">
            <Icon name="close" size={28} />
          </button>
        </div>
        <nav aria-label="Menu" className="wrap flex flex-1 flex-col justify-center">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} className="overflow-hidden">
                <a
                  href={item.href}
                  onClick={(e) => go(e, item.href)}
                  className={`group flex items-baseline gap-4 py-1 font-display text-[clamp(44px,9vw,112px)] leading-[0.95] font-medium tracking-[-0.04em] transition-transform duration-700 ease-out-expo ${open ? "translate-y-0" : "translate-y-full"}`}
                  style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
                >
                  <span className="label w-8 opacity-40">{String(i + 1).padStart(2, "0")}</span>
                  <span className="transition-colors group-hover:text-red">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="wrap flex items-center justify-between pb-[max(24px,env(safe-area-inset-bottom))]">
          <span className="label opacity-60">Based in {artist.basedIn}</span>
          <SocialLinks />
        </div>
      </div>
    </>
  );
}
