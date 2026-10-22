import { iconData, type IconName } from "./icon-data";

type Props = { name: IconName; size?: number; className?: string; title?: string };

/** Inline SVG icon. Decorative unless a title is given. */
export function Icon({ name, size = 22, className, title }: Props) {
  const { viewBox, body } = iconData[name];
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      className={className}
      fill="currentColor"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      aria-label={title}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
