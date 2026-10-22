"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/icon-data";

const TABS: { label: string; href: string; icon: IconName }[] = [
  { label: "Home", href: "#top", icon: "home" },
  { label: "Music", href: "#music", icon: "music" },
  { label: "Journey", href: "#journey", icon: "calendar" },
  { label: "About", href: "#about", icon: "user" },
];

/** Bottom tab bar on phones (mockup v2). The active tab follows the section in view. */
export function MobileTabBar() {
  const [active, setActive] = useState("#top");

  useEffect(() => {
    const sections = TABS.map((t) => document.querySelector(t.href)).filter(Boolean) as Element[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(`#${entry.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Sections" className="fixed inset-x-0 bottom-0 z-40 border-t border-paper/10 bg-ink text-paper md:hidden">
      <ul className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const current = active === tab.href;
          return (
            <li key={tab.href}>
              <a
                href={tab.href}
                aria-current={current ? "location" : undefined}
                className={`flex h-[60px] flex-col items-center justify-center gap-1 transition-opacity ${current ? "opacity-100" : "opacity-45"}`}
              >
                <Icon name={tab.icon} size={24} />
                <span className="text-[9.5px] font-medium tracking-[0.14em] uppercase">{tab.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
