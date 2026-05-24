import type { WidgetIconProps } from './types';

/** 3×3 widget grid — center dot highlighted (mockup WIDGETEAR). */
export function WidgetGridIcon({ className, strokeWidth = 1.65 }: WidgetIconProps) {
  const r = 1.1;
  const dots: [number, number, boolean][] = [];
  for (let row = 0; row < 3; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      dots.push([5 + col * 7, 5 + row * 7, row === 1 && col === 1]);
    }
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeOpacity="0.35"
      />
      {dots.map(([cx, cy, active]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={active ? r + 0.35 : r}
          fill="currentColor"
          fillOpacity={active ? 1 : 0.45}
        />
      ))}
    </svg>
  );
}
