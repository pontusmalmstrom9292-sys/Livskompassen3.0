import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useExecutiveHomeMotion } from './executiveHomeMotion';

type Props = {
  children: ReactNode;
  className?: string;
};

export function ExecutiveHomeStagger({ children, className }: Props) {
  const { staggerRoot } = useExecutiveHomeMotion();

  return (
    <motion.div className={className} {...staggerRoot}>
      {children}
    </motion.div>
  );
}

export function ExecutiveHomeStaggerItem({ children, className }: Props) {
  const { staggerChild } = useExecutiveHomeMotion();

  return (
    <motion.div className={className} {...staggerChild}>
      {children}
    </motion.div>
  );
}
