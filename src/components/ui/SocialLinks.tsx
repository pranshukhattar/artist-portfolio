import { siteConfig } from "@/lib/site";
import { Icon } from "./Icon";

const PLATFORMS = [
  { key: "instagram", label: "Instagram" },
  { key: "youtube", label: "YouTube" },
  { key: "spotify", label: "Spotify" },
  { key: "tiktok", label: "TikTok" },
  { key: "soundcloud", label: "SoundCloud" },
] as const;

type Props = { only?: (typeof PLATFORMS)[number]["key"][]; size?: number; className?: string };

export function SocialLinks({ only, size = 20, className = "" }: Props) {
  const items = only ? PLATFORMS.filter((p) => only.includes(p.key)) : PLATFORMS;
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {items.map(({ key, label }) => (
        <li key={key}>
          <a
            href={siteConfig.social[key]}
            target="_blank"
            rel="noopener noreferrer"
            className="grid size-11 place-items-center rounded-full opacity-75 transition-opacity duration-200 hover:opacity-100"
          >
            <Icon name={key} size={size} title={`${siteConfig.name} on ${label}`} />
          </a>
        </li>
      ))}
    </ul>
  );
}
