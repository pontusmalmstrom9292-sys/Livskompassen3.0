/**
 * Premium Card — re-export from design-system.
 * Preserves full BentoCard API (title, description, icon on root).
 */
import type { ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  type CardProps,
  type CardGlow,
  type CardHeaderProps,
} from '@/design-system';

export type CalmCardGlow = CardGlow;

export type BentoCardProps = Omit<CardProps, 'children'> & {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  /** @deprecated Use `interactive={false}` */
  noHover?: boolean;
};

export function BentoCard({
  title,
  description,
  icon,
  children,
  noHover,
  interactive,
  glow,
  depth = true,
  ...rest
}: BentoCardProps) {
  return (
    <Card interactive={noHover ? false : interactive ?? true} glow={glow} depth={depth} {...rest}>
      {(title || description || icon) && (
        <CardHeader title={title} description={description} icon={icon} glow={glow} />
      )}
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export { CardHeader, CardBody, type CardHeaderProps };
