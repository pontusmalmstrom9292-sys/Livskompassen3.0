import type { ReactNode, CSSProperties } from 'react';

export function BastaSectionLabel({ children }: { children: ReactNode }) {
  return <p className="basta-design__section-label">{children}</p>;
}

export function BastaGoldDivider() {
  return <div className="basta-design__gold-divider" />;
}

export function BastaCard({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`basta-design__card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
